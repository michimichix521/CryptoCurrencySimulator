"use strict";

{
  const FRAME_RATE = 50; //フレームレート
  const TIMER_ID = window.setInterval(update,1000/FRAME_RATE); //ループ処理(フレーム数はFRAME_RATE)

  const HTML_CVS = document.querySelector(".canvas"); //キャンバスの領域の取得
  const CANVAS = HTML_CVS.getContext("2d"); //キャンバスの描画機能を有効
  const HTML_USER_A_MONEY = document.querySelector(".userA_money"); //ユーザAの所持金額の領域の取得
  const HTML_USER_B_MONEY = document.querySelector(".userB_money"); //ユーザBの所持金額の領域の取得
  const HTML_FEE = document.querySelector(".fee"); //手数料の領域の取得
  const HTML_CHANGE_BUTTON = document.querySelector(".change_button"); //変更ボタンの領域の取得
  const HTML_SEND_BUTTON = document.querySelector(".send_button"); //送金ボタンの領域の取得
  const HTML_INPUT_TEXT_A = document.querySelector("input[name='input_textA']"); //ユーザAの送金金額の領域の取得
  const HTML_INPUT_TEXT_B = document.querySelector("input[name='input_textB']"); //ユーザBの送金金額の領域の取得
  const HTML_WARNING = document.querySelector(".warning"); //警告の領域の取得

  const SHA_OBJ = new jsSHA("SHA-256","TEXT"); //SHA_OBJというjsSHAインスタンスの生成(sha256ハッシュ関数を使ってハッシュ化させるため)
  const P2P_NETWORK = new P2PNetwork(CANVAS); //P2P_NETWORKというP2PNetworkインスタンスの生成
  const USER_A = new User(CANVAS,10000,100,60,40,"#f00","A"); //USER_AというUserインスタンスの生成
  const USER_B = new User(CANVAS,10000,100,440,40,"#00f","B"); //USER_BというUserインスタンスの生成
  //以下のコードがとても書きたかったので、書けて最高です！
  const MICHIHIRO = new Blockchain(SHA_OBJ,USER_A.money,USER_B.money); //MICHIHIRO(自分の名前（笑）)というBlockchainインスタンスの生成

  window.onload = () => { //windowロード時に動くメソッド
    HTML_USER_A_MONEY.innerHTML = "<p>"+USER_A.money+"円</p>";
    HTML_USER_B_MONEY.innerHTML = "<p>"+USER_B.money+"円</p>";
    HTML_FEE.innerHTML = "<p>"+"手数料 : "+MICHIHIRO.fee+"円</p>";
  }

  function update(){ //ループ処理(フレーム数はFRAME_RATE)
    P2P_NETWORK.createP2PFrame(); //p2pネットワークの作成

    USER_A.createUser(); //ユーザAの作成
    USER_B.createUser(); //ユーザBの作成

    consensusAlgorithm(); //コンセンサスアルゴリズム（オリジナル"PoR:Proof of Random"）←本物はこんなものじゃない

    if(USER_A.transaction.active){ //ユーザAがトランザクション送信中
      USER_A.transaction.createTransaction();
      USER_A.transaction.transactionMove(P2P_NETWORK,USER_A,USER_B,MICHIHIRO);
    }
    if(USER_B.transaction.active){ //ユーザBがトランザクション送信中
      USER_B.transaction.createTransaction();
      USER_B.transaction.transactionMove(P2P_NETWORK,USER_A,USER_B,MICHIHIRO);
    }
  }

  function consensusAlgorithm(){ //コンセンサスアルゴリズム（オリジナル"PoR:Proof of Random"）←本物はこんなものじゃない
    let _consensusTime = 10; //総意するするまでの時間(秒)
    P2P_NETWORK.timeCount++;

    if(P2P_NETWORK.timeCount === FRAME_RATE*_consensusTime){ //_consensusTime間隔で総意を行う
      if(P2P_NETWORK.victoryServerNumber !== undefined){ //1つ目のブロック生成時の生成権は初めて決まるので、最初は除く
        P2P_NETWORK.server[P2P_NETWORK.victoryServerNumber].color = "#0f0"; //生成権を得たサーバの色を元の色(緑色)に戻す
      }

      P2P_NETWORK.victoryServerNumber = Math.floor(Math.random()*P2P_NETWORK.server.length); //乱数を使って、ブロック生成権のサーバを決める
      MICHIHIRO.data.unshift("サーバ"+P2P_NETWORK.server[P2P_NETWORK.victoryServerNumber].serverNumber+"がブロック生成！"); //ブロックチェーンのdata部分の先頭にブロックを生成したサーバ番号を追記する
      MICHIHIRO.currentIndex++;

      if(P2P_NETWORK.poolCounter === 0){ //トランザクションプールが空の場合
        MICHIHIRO.data.push("トランザクションがありませんでした。取引は行われていません。");
      }

      MICHIHIRO.addBlock(new Block(MICHIHIRO.shaObj,MICHIHIRO.currentIndex,"",MICHIHIRO.data,USER_A.money,USER_B.money));//ブロック追加

      HTML_USER_A_MONEY.innerHTML = "<p>"+USER_A.money+"円</p>"; //ユーザAの所持金額の反映
      HTML_USER_B_MONEY.innerHTML = "<p>"+USER_B.money+"円</p>"; //ユーザBの所持金額の反映

      MICHIHIRO.data = [];
      P2P_NETWORK.poolCounter = 0;
      P2P_NETWORK.timeCount = 0;
    }

    if(P2P_NETWORK.victoryServerNumber !== undefined){ //ブロック生成権を得たサーバに関する処理(最初のブロックを除く)
      P2P_NETWORK.server[P2P_NETWORK.victoryServerNumber].color = "#ff0";
      P2P_NETWORK.server[P2P_NETWORK.victoryServerNumber].victoryServer(MICHIHIRO);
    }
  }

  HTML_CHANGE_BUTTON.addEventListener("click",() => { //切替ボタンをクリックした時の処理
    for(let i=0;i<MICHIHIRO.chain.length;i++){
      MICHIHIRO.chain[i].HTMLBlock.classList.toggle("blockchain_opacity"); //ブロックチェーン画面とユーザ・p2pネットワーク画面の表示切替
      MICHIHIRO.chain[i].HTMLChain.classList.toggle("blockchain_opacity");
    }
  });

  HTML_SEND_BUTTON.addEventListener("click",() => { //送金ボタンをクリックした時の処理
    USER_A.sendMoney = HTML_INPUT_TEXT_A.value;
    USER_B.sendMoney = HTML_INPUT_TEXT_B.value;

    if(USER_A.sendMoney !== "" && USER_B.sendMoney !== ""){ //両ユーザの入力テキストが空白でない時
      HTML_WARNING.innerHTML = "<p>[警告]両ユーザに送金金額が入力されています</p>";
    }else if(USER_A.sendMoney === "" && USER_B.sendMoney === ""){ //両ユーザの入力テキストが空白の時
      HTML_WARNING.innerHTML = "<p>[警告]送金金額が入力されていません</p>";
    }else if(USER_A.transaction.active || USER_B.transaction.active){ //トランザクション送信中の時
      HTML_WARNING.innerHTML = "<p>[警告]トランザクション送信中です</p>";
    }else{ //送信準備OK
      HTML_WARNING.innerHTML = "";

      if(USER_A.sendMoney !== ""){ //ユーザAの送金の場合
        if(USER_A.money-Number(USER_A.sendMoney)-MICHIHIRO.fee >= 0){ //金額不足でなければ送金！
          USER_A.transaction.active = true; //トランザクションA送信
        }else{
          HTML_WARNING.innerHTML = "<p>[警告]ユーザAのお金が足りません</p>";
        }
      }

      if(USER_B.sendMoney !== ""){ //ユーザBの送金の場合
        if(USER_B.money-Number(USER_B.sendMoney)-MICHIHIRO.fee >= 0){ //金額不足でなければ送金！
          USER_B.transaction.active = true; //トランザクションB送信
        }else{
          HTML_WARNING.innerHTML = "<p>[警告]ユーザBのお金が足りません</p>";
        }
      }
    }

    HTML_INPUT_TEXT_A.value = "";
    HTML_INPUT_TEXT_B.value = "";
  });
}