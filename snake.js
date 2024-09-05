const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//設定果實，以class的方式建立物件，寫法比較簡短
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit; //會得出最小為0 ~ 最大為width-unit的結果
    this.y = Math.floor(Math.random() * row) * unit; //會得出最小為0 ~ 最大為height-unit的結果
  }

  drawFruit() {
    ctx.fillStyle = "tomato";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      //先至少執行一次隨機產生果實位置，如overlapping再繼續產生新果實位置
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x; //確認果實與蛇沒有overlap之後，將果實位置指派給new_x, new_y
    this.y = new_y;
  }
}

createSnake();
let myFruit = new Fruit();
let d = "Right";
let highestScore;
loadHighestScore();
let score = 0; //初始化分數
document.querySelector("#myScore").innerHTML = "my score : " + score;
document.querySelector("#myHighestScore").innerHTML = "my highest score : " + highestScore;

window.addEventListener("keydown", changeDirection); //利用事件監聽擷取鍵盤方向鍵來控制蛇的方向
function changeDirection(e) {
  //還要設第二個條件是因為要限制蛇不能逆行
  if (e.key == "ArrowRight" && d != "Left") {
    //按下方向鍵右 & 蛇不是正在左行時 才可以右轉
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }
}

function draw() {
    //確認蛇有沒有咬到自己
    for (i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) { //迴圈從1開始是因為0就是蛇頭的位置
            clearInterval(myGame);
            alert("GAME OVER!");
            return;
        }
    }
  ctx.fillStyle = "#67595e";
  ctx.fillRect(0, 0, canvas.width, canvas.height); //在每次動作開始前重置畫布

  myFruit.drawFruit(); //在畫布重置後產生果實

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "#eed6d3"; //蛇頭
    } else {
      ctx.fillStyle = "#e8b4b8"; //蛇身
    }
    ctx.strokeStyle = "#67595e"; //蛇外框

    //設定蛇穿牆
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //fillRect填滿方塊(x, y, height, width)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); //strokeRect填滿方塊外框(x, y, height, width)
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //蛇吃到果實的相關設定
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++; //吃到果實後+分數
    setHighestScore(score);
    document.querySelector("#myScore").innerHTML = "my score : " + score;
    document.querySelector("#myHighestScore").innerHTML = "my highest score : " + highestScore;
  } else {
    snake.pop(); //刪掉蛇尾
  }
  snake.unshift(newHead); //新增蛇頭
}
let myGame = setInterval(draw, 100); //畫布更新的時間(蛇移動的速度)

function loadHighestScore() {
    if (localStorage.getItem("highestScore") == null) {
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score) {
    if (score > highestScore) {
        localStorage.setItem("highestScore", score); //score高過highestScore時，更新localstorage
        highestScore = score; //score高過highestScore時，把值指派給highestScore
    }
}