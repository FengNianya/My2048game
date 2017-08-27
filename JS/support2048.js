// 定位 &&找到方格位置的函数
function getPosTop(i,j){
    var top=20+i*(100+20);
    return top;
}
function getPosLeft(i,j){
    var left=20+j*(100+20);
    return left;
}

//随机生成一个数2或4
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

// 更新面板（每次更新先将所有的数字方块全部移除，在弄个循环创建它们）
function updateBoardView(){
  //如果有number-cell后先删除
    $(".number-cell").remove();
        //遍历格子，改变样式弄个循环创建它们
        for (var i = 0; i < 4; i++) {
          for (var j = 0;  j< 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
            var theNumberCell=$("#number-cell-"+i+"-"+j);

            if (board[i][j]==0) {
              theNumberCell.css({
                "with":"0px",
                "height":"0px",
                "top":getPosTop(i,j)+50,/*这里是为了把它放中间，动画才好看*/
                "left":getPosLeft(i,j)+50
              });
            } else {
              theNumberCell.css({
                "with":"100px",
                "height":"100px",
                "top":getPosTop(i,j),
                "left":getPosLeft(i,j),
                "background-color":getNumberBackgroundColor(board[i][j]),
                "color":getNumberColor(board[i][j])
              });
              theNumberCell.text(board[i][j]);
            }
          }


        }
}

// 数字方块的背景色与前景色的获取
function getNumberBackgroundColor(number){
    var color="black";
    switch(number){
        case 2:
            color='#eee4da';
            break;
        case 4:
             color="#ede0c8";
            break;
        case 8:
            color='#668f86';
            break;
        case 16:
            color="#396b84";
            break;
        case 32:
            color='#424980';
            break;
        case 64:
            color="#662a5e";
            break;
        case 128:
            color='#4f2e48';
            break;
        case 256:
            color="#edcc61";
            break;
        case 512:
            color='#9c0';
            break;
        case 1024:
            color="#33b5e5";
            break;
        case 2048:
            color='#09c';
            break;
        case 4096:
            color="#fff";
    }
    return color;
}
function getNumberColor(number){
    if(number<=4){
        return "#776e50";
    }
    return "white";
}
//确定还有空格子可以生成,没有的话直接返回
function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}
//检测是否能向左移动
function canMoveLeft(board){
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                if(board[i][j-1]==0||board[i][j-1]==board[i][j])
                    return true;
            }
        }
    }
    return false;
}
function canMoveUp(board){
  for(var i=1;i<4;i++){
      for(var j=0;j<4;j++){
          if(board[i][j]!=0){
              if(board[i-1][j]==0||board[i-1][j]==board[i][j])
                  return true;
          }
      }
  }
  return false;
}

function canMoveRight(bord){
  for(var i=0;i<4;i++){
      for(var j=0;j<3;j++){
          if(board[i][j]!=0){
              if(board[i][j+1]==0||board[i][j+1]==board[i][j])
                  return true;
          }
      }
  }
}
function canMoveDown(bord){
  for(var i=0;i<3;i++){
      for(var j=0;j<4;j++){
          if(board[i][j]!=0){
              if(board[i+1][j]==0||board[i+1][j]==board[i][j])
                  return true;
          }
      }
  }
}

//向左移动
function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }

    //遍历右边12个格子
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                //有数字则遍历左边
                for(var k=0;k<j;k++){
                    //看落点是否为空且路上有无障碍
                    if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //更新
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)/*&&!hasConflicted[i][k]*/){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //更新
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //分数增加
                        score += board[i][k];
                        updateScore(score);

                        // hasConflicted[i][k]=true;

                        continue;
                    }
                }
            }
        }
    }
    //遍历完后更新格子显示状态,慢一点才能显示动画
    setTimeout("updateBoardView()",200);
    return true;
}

//向上移动
function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    //遍历格子
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                //有数字则遍历上边
                for(var k=0;k<i;k++){
                    //看落点是否为空且路上有无障碍
                    if(board[k][j]==0&&noBlockVertical(k,j,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //更新
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j]&&noBlockVertical(k,j,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //更新
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //分数增加
                        score += board[k][j];
                        updateScore(score);

                        // hasConflicted[i][k]=true;

                        continue;
                    }
                }
            }
        }
    }
    //遍历完后更新格子显示状态,慢一点才能显示动画
    setTimeout("updateBoardView()",200);
    return true;
}

// 向右移动
function moveRight(){
  if(!canMoveRight(board)){
      return false;
  }

  //遍历左边12个格子
  for(var i=0;i<4;i++){
      for(var j=2;j>-1;j--){
          if(board[i][j]!=0){
              //有数字则遍历右边
              for(var k=3;k>j;k--){
                  //看落点是否为空且路上有无障碍
                  if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
                      //move
                      showMoveAnimation(i,j,i,k);
                      //更新
                      board[i][k]=board[i][j];
                      board[i][j]=0;
                      continue;
                  }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)/*&&!hasConflicted[i][k]*/){
                      //move
                      showMoveAnimation(i,j,i,k);
                      //更新
                      board[i][k]+=board[i][j];
                      board[i][j]=0;
                      //分数增加
                      score += board[i][k];
                      updateScore(score);

                      // hasConflicted[i][k]=true;

                      continue;
                  }
              }
          }
      }
  }
  //遍历完后更新格子显示状态,慢一点才能显示动画
  setTimeout("updateBoardView()",200);
  return true;
}
// 向下移动
function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }

    //遍历格子
    for(var i=2;i>-1;i--){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                //有数字则遍历左边
                for(var k=3;k>i;k--){
                    //看落点是否为空且路上有无障碍
                    if(board[k][j]==0&&noBlockVertical(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //更新
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j]&&noBlockVertical(i,j,k,board)/*&&!hasConflicted[i][k]*/){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //更新
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //分数增加
                        score += board[k][j];
                        updateScore(score);

                        // hasConflicted[i][k]=true;

                        continue;
                    }
                }
            }
        }
    }
    //遍历完后更新格子显示状态,慢一点才能显示动画
    setTimeout("updateBoardView()",200);
    return true;
}
//有无障碍
function noBlockHorizontal(row,col1,col2,board){
    for(var j=col1+1;j<col2;j++){
        if(board[row][j]!=0)
            return false;
    }
    return true;
}
function noBlockVertical(rows,col,rowl,board){
  for (var i=rows+1; i<rowl;i++) {
    if (board[i][col]!=0)

      return false;
  }
    return true;
}
//游戏是否结束？
function isgameover(){
  var i=0;
  if(canMoveLeft(board))
  i++;
  if(canMoveUp(board))
  i++;
  if(canMoveRight(board))
  i++;
  if(canMoveDown(board))
  i++;
  if (i==0){
    alert("亲爱的游戏结束了，你的得分是"+score+",可以说是非常厉害了。再来一局吧！")
    return false;
  }
    return true;
}

//有无障碍
function noBlockHorizontal(row,col1,col2,board){
    for(var i=col1+1;i<col2;i++){
        if(board[row][i]!=0)
            return false;
    }
    return true;
}
