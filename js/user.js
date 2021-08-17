"use strict";

class User{
  constructor(canvas,money,x,y,r,color,name){
    this.canvas = canvas;
    this.money = money; //所持金額
    this.sendMoney = 0; //送金金額
    this.x = x; //ユーザのx座標
    this.y = y; //ユーザのy座標
    this.r = r; //ユーザの円の半径
    this.color = color; //ユーザの色
    this.name = name; //ユーザの名前

    this.transaction = new Transaction(this.canvas,this.x+50,this.y-25,this.name); //トランザクションインスタンスの生成
  }

  drawText(){ //ユーザとその名前のテキストを表示
    this.canvas.fillStyle = "#fff";
    this.canvas.font = this.r/2+"px Arial";
    this.canvas.fillText("ユーザ"+this.name,this.x-35,this.y+5);
  }

  createUser(){ //ユーザを描画
    this.canvas.beginPath();
    this.canvas.fillStyle = this.color;
    //円の中心座標:(x,y),半径:r,開始角度:0度(0*Math.PI/180),終了角度:360度(360*Math.PI/180)
    //方向:true=反時計回りの円、false=時計回りの円
    this.canvas.arc(this.x,this.y,this.r,0*Math.PI,2*Math.PI,true);
    this.canvas.fill();

    this.drawText();
  }
}