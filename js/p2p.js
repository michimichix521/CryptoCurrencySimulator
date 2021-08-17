"use strict";

class P2PNetwork{
  constructor(canvas){
    this.canvas = canvas;

    this.victoryServerNumber; //乱数によって得られる、ブロック生成権の番号
    this.server = new Array(6); //サーバ(6個分用意)
    for(let i=0;i<this.server.length;i++){
      this.server[i] = new Server(this.canvas,i+1); //6個分のserverインスタンスを生成
    }

    this.poolObj = new Array(4); //トランザクションプール(4個分用意)
    this.poolCounter = 0; //トランザクションプールの個数カウンタ

    for(let i=0;i<this.poolObj.length;i++){
      this.poolObj[i] = new TransactionPool(this.canvas,400+(i*80)); //4個分のpoolObjインスタンスを生成
    }

    this.sX = this.server[0].x; //サーバの初期位置x
    this.sY = this.server[0].y; //サーバの初期位置y
    this.sR = 120; //描く円の半径
    this.a = 0; //描く円の角度

    this.timeCount = 0; //サーバのブロック生成の時間調整用変数
  }

  createP2PFrame(){ //p2pネットワークの作成

    this.canvas.fillStyle = "#000";
    this.canvas.fillRect(0,0,700,500); //図のブロックチェーン枠の作成

    this.canvas.strokeStyle = "#fff";
    this.canvas.lineWidth = 3;
    this.canvas.strokeRect(350,20,340,460); //p2pネットワークの枠の作成

    this.canvas.fillStyle = "#fff";
    this.canvas.font = "24px Arial";
    this.canvas.fillText("p2pネットワーク",360,50); //p2pネットワークの文字の作成

    this.createServerFrame(); //p2pネットワークにおけるサーバ部分の作成

    this.createTransactionPoolFrame(); //p2pネットワークにおけるトランザクションプール部分の作成

    for(let i=0;i<this.poolCounter;i++){ //プールカウンタによって、トランザクションプールの白丸を表示する。
      if(i < 4){ //最大4個まで表示できる
        this.poolObj[i].createTransactionPool();
      }
    }
  }

  createServerFrame(){ //p2pネットワークにおけるサーバ部分の作成
    this.createCircle(); //サーバの円軌道の作成
    this.serverMove(); //サーバの回転の動き
  }

  createCircle(){ //サーバの円軌道の作成
    let _circleX,_circleY;

    this.canvas.beginPath();
    for(let i=0;i<=360;i++){
      _circleX = 40+this.sX+this.sR*Math.cos(i*Math.PI/180);
      _circleY = 20+this.sY+this.sR*Math.sin(i*Math.PI/180);
      this.canvas.lineTo(_circleX,_circleY);
    }
    this.canvas.strokeStyle = "#f0f";
    this.canvas.lineWidth = 5;
    this.canvas.stroke();
  }

  serverMove(){ //サーバの回転の動き
    this.a += 0.5;
    this.a = this.a%360;
    for(let i=0;i<this.server.length;i++){
      this.server[i].x = this.sX+this.sR*Math.cos((this.a+i*60)*Math.PI/180);
      this.server[i].y = this.sY+this.sR*Math.sin((this.a+i*60)*Math.PI/180);
      this.server[i].createServer();
    }
  }

  createTransactionPoolFrame(){ //p2pネットワークにおけるトランザクションプール部分の作成
    this.canvas.strokeStyle = "#ff0";
    this.canvas.lineWidth = 3;
    this.canvas.strokeRect(360,95,320,50);

    this.canvas.fillStyle = "#ff0";
    this.canvas.font = "15px Arial";
    this.canvas.fillText("トランザクションプール",360,85);

    for(let i=1;i<4;i++){
      this.canvas.beginPath();
      this.canvas.moveTo(360+(i*80),95);
      this.canvas.lineTo(360+(i*80),145);
      this.canvas.strokeStyle = "#ff0";
      this.canvas.stroke();
    }
  }
}

class Server{
  constructor(canvas,serverNumber){
    this.canvas = canvas;
    this.serverNumber = serverNumber; //サーバ番号
    this.x = 480; //サーバのx座標
    this.y = 285; //サーバのy座標
    this.w = 80; //サーバの横の長さ
    this.h = 60; //サーバの縦の長さ
    this.color = "#0f0"; //サーバの色
  }

  drawText(){ //サーバという文字の作成
    this.canvas.fillStyle = "#000";
    this.canvas.font = "20px Arial";
    this.canvas.fillText("サーバ"+this.serverNumber,this.x+4,this.y+38);
  }

  createServer(){ //サーバの作成
    this.canvas.fillStyle = this.color;
    this.canvas.fillRect(this.x,this.y,this.w,this.h);

    this.drawText();
  }

  victoryServer(michihiro){ //ブロックの生成権を得たサーバの処理
    this.canvas.strokeStyle = "#ff0";
    this.canvas.lineWidth = 3;
    this.canvas.strokeRect(30,220,280,61);

    this.canvas.fillStyle = "#ff0";
    this.canvas.font = "25px Bold";
    this.canvas.fillText(michihiro.currentIndex+"番目のブロック",75,245);
    this.canvas.fillText("生成権：サーバ"+this.serverNumber,75,275);
  }
}

class TransactionPool{
  constructor(canvas,x){
    this.canvas = canvas;
    this.x = x; //トランザクションプールの白丸のx座標
    this.y = 120; //トランザクションプールの白丸のy座標
    this.r = 15; //トランザクションプールの白丸の半径
  }

  createTransactionPool(){ //トランザクションプールの白丸を作成
    this.canvas.beginPath();
    this.canvas.fillStyle="#fff";
    this.canvas.arc(this.x,this.y,this.r,0*Math.PI,2*Math.PI,true);
    this.canvas.fill();
  }
}