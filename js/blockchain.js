"use strict";

class Blockchain{
  constructor(shaObj,userAMoney,userBMoney){
    this.shaObj = shaObj; //ハッシュ関数(sha256)

    this.fee = 100; //手数料
    this.currentIndex = 0; //最新のブロック番目
    this.data = ["Genesis block（最初のブロック）"]; //データの内容

    this.chain = [new Block(this.shaObj,this.currentIndex,"0",this.data,userAMoney,userBMoney)] //最初のブロックをブロックチェーンに
    this.chain[this.chain.length-1].blockShowToHtml(); //HTML上にブロックチェーンの情報を記述
    this.data = [];
  }

  addBlock(newBlock){ //ブロックチェーンにブロックを追加するメソッド
    newBlock.previousHash = this.chain[this.chain.length-1].hash; //前ブロックのハッシュ値を格納
    newBlock.hash = newBlock.calcHash(); //ハッシュ値の計算
    this.chain.push(newBlock); //chain配列に挿入
    newBlock.blockShowToHtml(); //HTML上にブロックチェーンの情報を記述

    if(this.chain[this.chain.length-2].HTMLBlock.classList.contains("blockchain_opacity")){ //１つ前のブロックに"blockchain_opacity"がついていたら、つける
      newBlock.HTMLBlock.classList.add("blockchain_opacity");
      newBlock.HTMLChain.classList.add("blockchain_opacity");
    }
  }
}

class Block{
  constructor(shaObj,index,previousHash,data,userAMoney,userBMoney){
    this.shaObj = shaObj; //ハッシュ関数のオブジェクト
    this.index = index; //インデックス値
    this.previousHash = previousHash; //１つ前のブロックのハッシュ値
    this.timestamp = new Date(); //タイムスタンプ
    this.data = data.join("/"); //ブロックのデータ
    this.userAMoney = userAMoney; //ユーザAの所持金額
    this.userBMoney = userBMoney; //ユーザBの所持金額
    this.allData = this.data+this.userAMoney+this.userBMoney; //データを１つに
    this.hash = this.calcHash(); //ハッシュ値

    this.HTMLBlock = document.createElement("div"); //HTML上にブロックの領域を確保
    this.addHtmlBlock(); //HTML上にブロックの作成

    this.HTMLChain = document.createElement("div"); //HTML上にブロックとブロックを繋ぐ鎖の役目の領域を確保
    this.addHtmlChain(); //HTML上にブロックとブロックを繋ぐ鎖の役目を果たすものの作成

  }
  calcHash(){ //ハッシュ値の計算
    this.shaObj.update(this.index+this.previousHash+this.timestamp+this.allData);
    return this.shaObj.getHash("HEX");
  }

  addHtmlBlock(){ //HTML上にブロックの作成
    document.body.appendChild(this.HTMLBlock);
    this.HTMLBlock.classList.add("block");
  }

  addHtmlChain(){ //HTML上にブロックとブロックを繋ぐ鎖の役目を果たすものの作成
    document.body.appendChild(this.HTMLChain);
    this.HTMLChain.classList.add("chain");
  }

  blockShowToHtml(){ //HTML上にブロックチェーンの情報を記述
    this.HTMLBlock.innerHTML = "<p>index : "+this.index+"</p>"+
                               "<p>previousHash : "+this.previousHash+"</p>"+
                               "<p>timestamp : "+this.timestamp.toLocaleString()+"</p>"+
                               "<p>data : "+this.data+"</p>"+
                               "<p>ユーザAの所持金額 : "+this.userAMoney+"円</p>"+
                               "<p>ユーザBの所持金額 : "+this.userBMoney+"円</p>"+
                               "<br><p>☆hash : "+this.hash+"</p>";
  }
}