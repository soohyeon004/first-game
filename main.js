// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

// 4.적군의 우주선이 바닥에 닿으면 게임 오버
let gameOver = false; // true이면 게임이 끝남, false이면 게임 안끝남
let score = 0;

// 우주선 좌표
let spaceshipImageX = canvas.width / 2 - 32;
let spaceshipImageY = canvas.height - 64;

// 2. 총알이 발사 = y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
let bulletList = []; // 총알들을 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() { // 초기화
        this.x = spaceshipImageX + 24;
        this.y = spaceshipImageY;
        this.alive = true; // true면 살아있는총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function() {
        this.y -= 7;
    };

    this.checkHit = function() {
    // 5. 적군과 총알이 만나면 우주선이 사라지고 점수 1점 획득 -> 총알.y <= 적군.y And 총알.x >= 적군.x And 총알.x <= 적군.x + 적군의 넓이
        for (let i = 0; i < enemyList.length; i++) {
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 60){
            // 점수획득
            score++;
            this.alive = false; // 죽은 총알
            enemyList.splice(i, 1); // 잘라냄
            }
        }
    };
}

// 적군만들기
// 1. 적군은 위치가 랜덤하다
// 2. 적군은 밑으로 내려온다
let enemyList = [];

function generateRandomValue(min, max) {
    let randomeNum = Math.floor(Math.random() * (max-min + 1)) + min;
    return randomeNum;
}

function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width - 60);
        enemyList.push(this);
    };
    this.update = function() {
        this.y += 2; // 적군의 속도 조절
    // 4.적군의 우주선이 바닥에 닿으면 게임 오버
        if(this.y >= canvas.height - 60) {
            gameOver = true;
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "./images/background.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "./images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "./images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "./images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "./images/gameover.png";
}

// 방향키를 누르면
let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener("keydown", function(e) {
        keysDown[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e) {
        delete keysDown[e.keyCode];
        // 총알만들기
        // 1. 스페이스를 누르면 총알 발사
        if(e.keyCode == 32) {
            createBullet(); // 총알 생성
        }
    });
}

// 총알 생성
function createBullet() {
    let b = new Bullet;
    b.init();
}

// 3. 1초마다 하나씩 적군이 나온다
function createEnemy() {
    const interval = setInterval(function() {
        let en = new Enemy();
        en.init();
    },1000); // setInterval(호출하고싶은함수, 호출 할 시간)
}


// 우주선의 xy좌표가 바뀌고
function update() {
    if(39 in keysDown) {
        spaceshipImageX += 5; // 우주선의 속도
    } // right
    if(37 in keysDown) {
        spaceshipImageX -= 5;
    } // left
    if(spaceshipImageX <= 0) {
        spaceshipImageX = 0;
    } // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?
    if(spaceshipImageX >= canvas.width - 64) {
        spaceshipImageX = canvas.width - 64;
    }
    // 5. 총알 배열을 가지고 render 그려준다.
    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit(); // 점수획득
        }
    }
    // 적군의 y좌표 업데이트하는 함수 호출
    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipImageX, spaceshipImageY);
    ctx.fillText(`Score: ${score}`, 25, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // 총알
    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        };
    }
    
    for(let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function main() {
    if(!gameOver) {
        update(); // 좌표값을 업데이트하고
        render(); // 그려주고
        requestAnimationFrame(main);   
    } else {
        ctx.drawImage(gameOverImage, 8, 100, 380, 380);
    }
}




loadImage();
setupKeyboardListener();
createEnemy();
main();