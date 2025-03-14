const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("myAudio");

let player = { x: 350, y: 330, width: 140, height: 140, dy: 0, isJumping: false };
let ball = { x: player.x + player.width, y: player.y + player.height / 2, radius: 15, isMoving: false, dx: 0,  dy: 0, hasBall: true };
let hoop = { x: 790, y: 188, width: 50, height: 3 };

let score = 0;
const gravity = 0.2;
const friction = 0.98;
let shotSpeed = 20;

const playerImage = new Image();
const ballImage  = new Image();
playerImage.src = "./assets/player1.png";
ballImage.src = "./assets/ball.png";

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.drawImage(ballImage,ball.x,ball.y, )
}

function drawHoop() {
    ctx.fillStyle = "red";
    ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 420, 30);
}

//music
function togglePlay() {
    if (!audio.paused) {
      audio.pause();
    } else {
      audio.play();
    }
  }

function updateBall() {
    if (!ball.hasBall && ball.isMoving) {
        ball.dy += gravity;
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.dx *= friction;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx *= -1;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius -100;
            ball.dy *= -0.6;
        }
        
        if (ball.x > hoop.x && ball.x < hoop.x + hoop.width && ball.y - ball.radius <= hoop.y && ball.dy > 0) {
            score++;
            resetBall();
        }
    }
    if (ball.hasBall) {
        ball.x = player.x + player.width - 40;
        ball.y = player.y + player.height / 2.5;
    }
}

function resetBall() {
    ball.isMoving = false;
    ball.hasBall = true;
    ball.dx = 0;
    ball.dy = 0;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBall();
    drawHoop();
    drawScore();
    updateBall();
    updatePlayer();
    requestAnimationFrame(update);
}

function updatePlayer() {
    if (player.isJumping) {
        player.dy += gravity + 0.3;
        player.y += player.dy;
        if (player.y >= 350) {
            player.y = 325;
            player.dy = 0;
            player.isJumping = false;
        }
    }
}


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= 20;
    } else if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += 20;
    } else if (event.key === "ArrowUp" && !player.isJumping) {
        player.dy = -10;
        player.isJumping = true;
    }
    if (!ball.hasBall && Math.abs(player.x - ball.x) < 100 && Math.abs(player.y - ball.y) < 50) {
        ball.hasBall = true;
        ball.isMoving = false;
    }

    if (event.key === "z") {
        shotSpeed = 26; // Super Shot
        shootBall();
    } else if (event.key === "x") {
        shotSpeed = 18; // Normal Shot
        shootBall();
    }
});

function shootBall() {
    if (ball.hasBall) {
        ball.hasBall = false;
        ball.isMoving = true;
        
        let targetX = hoop.x + hoop.width / 2;
        let targetY = hoop.y - 70;
        let angle = Math.atan2(targetY - ball.y, targetX - ball.x);
        
        ball.dx = Math.cos(angle) * shotSpeed;
        ball.dy = Math.sin(angle) * shotSpeed;
    }
}

playerImage.onload = update;