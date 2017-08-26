// 两个全局变量
var board=new Array();//游戏数据储存
var score=0;//初始化分数为0

//初始化游戏
$(document).ready(function(){
  newGame();
})


function newbox(){

}

function newGame(){
  //为移动端初始化宽度
  // prepareForMobile();
  //初始化棋盘格
  init();
  //在随机两个格子生成数字
   generateOneNumber();
   generateOneNumber();
}
//初始化棋盘格
function init(){
  // //有数字的小方块
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell=$("#grid-cell-"+i+"-"+j);
      var top=getPosTop(i,j);
      var left=getPosLeft(i,j);
      gridCell.css({
        "top":top,
        "left":left
      });
    }
  }
  // for (var i = 0; i < 4; i++) {
  //   for (var j = 0; j < 4; j++) {
  //     var gridCell=$("#grid-cell-"+"i"+"-"+"j");
  //     gridCell.css({
  //       "top":getPosTop(i,j),
  //       "left":getPosLeft(i,j)
  //     });
  //   }
  // }
  //初始化board数组
  for (var i = 0; i < 4; i++) {
    board[i]=new Array();
    for (var j = 0; j < 4 ; j++) {
      board[i][j]=0;
    }
  }
   //如果有操作,更新界面
   updateBoardView();
   score=0;
   $("#score").text(score);
}

//生成格子
function generateOneNumber(){
  //先看有无空格
    if(nospace(board)){
        return false;
    }

    //随机生成一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
//看是不是空格,优化随机
    var times=0;
    while(times<50){
        if(board[randx][randy]==0){
            break;
        }
        //重复
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));

        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    // 在格子上随机生成一个数字
    var randNumber=Math.random()<0.65?2:4;
    showNumberWithAnimation(randx,randy,randNumber);
    board[randx][randy]=randNumber;
}

//键盘控制
$(document).keydown(function (event){
   switch(event.keyCode){
       case 37: //left
           isgameover();
           canMoveLeft(board);
           moveLeft();
           generateOneNumber();
           break;
       case 38: //up
           isgameover();
           canMoveUp(board);
           moveUp();
           generateOneNumber();
           break;
       case 39: //right
           isgameover();
           canMoveRight(board);
           moveRight();
           generateOneNumber();
           break;
       case 40: //down
           isgameover();
           canMoveDown(board);
           moveDown();
           generateOneNumber();
           break;
   }
});

//有无障碍
function noBlockHorizontal(row,col1,col2,board){
    for(var i=col1+1;i<col2;i++){
        if(board[row][i]!=0)
            return false;
    }
    return true;
}


function updateScore(score){
  var scorebox=$("#score");
  scorebox.text(score);
}
