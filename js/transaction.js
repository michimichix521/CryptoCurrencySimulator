"use strict";

class Transaction{
  constructor(canvas,x,y,name){
    this.canvas = canvas;
    this.x = x; //トランザクションのx座標
    this.y = y; //トランザクションのy座標
    this.w = 100; //トランザクションの横の長さ
    this.h = 50; //トランザクションの縦の長さ
    this.name = name; //トランザクションの名前
    this.color = "#fff"; //トランザクションの色
    this.active = false; //トランザクションのアクティブ状態
  }

  drawText(){ //トランザクションというテキストの表示
    this.canvas.fillStyle = "#000";
    this.canvas.font = "12px Arial";
    this.canvas.fillText("トランザクション",this.x,this.y+30);
  }

  createTransaction(){ //トランザクションの描画
    this.canvas.fillStyle = this.color;
    this.canvas.fillRect(this.x,this.y,this.w,this.h);
    this.drawText();
  }

  transactionMove(p2pNetwork,userA,userB,michihiro){ //トランザクションの移動
    let _speed = 3; //トランザクションの移動の速さ

    if(this.name === "A"){
      if(this.x < 255){
        if(this.y < 150){
          this.y += _speed;
          return;
        }
      this.x += _speed;
      }

      if(this.x >= 255){
        this.sendTransaction(p2pNetwork,userA,userB,michihiro);
        this.x = 150;
        this.y = 45;
      }

    }else if(this.name === "B"){
      if(this.x < 255){
        if(this.y > 305){
          this.y -= _speed;
          return;
        }
        this.x += _speed;
      }

      if(this.x >= 255){
        this.sendTransaction(p2pNetwork,userA,userB,michihiro);
        this.x = 150;
        this.y = 410;
      }
    }
  }

  sendTransaction(p2pNetwork,userA,userB,michihiro){ //トランザクション送信完了時
    this.active = false;
    p2pNetwork.poolCounter++;
    if(this.name === "A"){ //ユーザAがトランザクションを送った場合の処理
      userA.money = userA.money-Number(userA.sendMoney)-michihiro.fee;
      userB.money = userB.money+Number(userA.sendMoney);
      michihiro.data.push("A→B:"+userA.sendMoney+"円");

    }else if(this.name === "B"){ //ユーザBがトランザクションを送った場合の処理
      userB.money = userB.money-Number(userB.sendMoney)-michihiro.fee;
      userA.money = userA.money+Number(userB.sendMoney);
      michihiro.data.push("B→A:"+userB.sendMoney+"円");
    }
  }
}