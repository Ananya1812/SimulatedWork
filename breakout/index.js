const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let balls = [{ x, y, dx, dy, radius: ballRadius }];
let powerUps = [];
let level = 1;
let isLevelUp = false;

// Sounds
const hitSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const brickSound = new Audio("https://www.soundjay.com/button/beep-01a.wav");
const levelUpSound = new Audio("https://www.soundjay.com/button/beep-09.wav");

// Event listeners for paddle movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Create a 2D array for bricks
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Handle keydown events for paddle movement
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

// Handle keyup events for paddle movement
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw the ball
function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Check collision with bricks and apply effects
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy; // Reverse ball direction
          b.status = 0; // Mark the brick as broken
          score += 10;
          brickSound.play(); // Play brick hit sound
          if (Math.random() < 0.1) createPowerUp(b.x, b.y); // 10% chance to spawn a power-up
          if (Math.random() < 0.1 && balls.length < 3) createBall(); // 10% chance to spawn a ball
        }
      }
    }
  }
}

// Create power-ups
function createPowerUp(x, y) {
  const powerUpType = Math.random() < 0.5 ? "paddle" : "ball"; // Randomize power-up type
  powerUps.push({ x, y, type: powerUpType, radius: 10, dy: 1 });
}

// Draw power-ups
function drawPowerUps() {
  powerUps.forEach((powerUp, index) => {
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
    ctx.fillStyle = powerUp.type === "paddle" ? "#FF0000" : "#00FF00"; // Red for paddle, Green for ball
    ctx.fill();
    ctx.closePath();
    powerUp.y += powerUp.dy;

    if (powerUp.y > canvas.height) {
      powerUps.splice(index, 1); // Remove off-screen power-ups
    }

    // Check for collision with paddle
    if (
      powerUp.y + powerUp.radius > canvas.height - paddleHeight &&
      powerUp.x > paddleX &&
      powerUp.x < paddleX + paddleWidth
    ) {
      powerUps.splice(index, 1);
      applyPowerUp(powerUp.type);
    }
  });
}

// Apply the power-up effect
function applyPowerUp(type) {
  if (type === "paddle") {
    paddleWidth += 20; // Increase paddle size
  } else if (type === "ball") {
    balls.forEach((ball) => (ball.dx *= 1.1)); // Increase ball speed
  }
}

// Create new ball when power-up is triggered
function createBall() {
  balls.push({
    x: paddleX + paddleWidth / 2,
    y: canvas.height - paddleHeight - 10,
    dx: 2,
    dy: -2,
    radius: ballRadius,
  });
}

// Draw all balls
function drawBalls() {
  balls.forEach((ball) => drawBall(ball));
}

// Move all balls
function moveBalls() {
  balls.forEach((ball) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (
      ball.x + ball.dx > canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
        ball.dy = -ball.dy;
        hitSound.play();
      } else {
        lives--;
        if (lives === 0) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          ball.x = paddleX + paddleWidth / 2;
          ball.y = canvas.height - paddleHeight - 10;
          ball.dx = 2;
          ball.dy = -2;
        }
      }
    }
  });
}

// Move paddle
function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// Draw score and lives
function drawScoreAndLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Check for level-up
function checkLevelUp() {
  if (score >= level * 100) {
    level++;
    isLevelUp = true;
    levelUpSound.play();
    setTimeout(() => {
      isLevelUp = false;
      resetBricks();
    }, 1500);
  }
}

// Reset bricks for next level
function resetBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBalls();
  drawPowerUps();
  drawScoreAndLives();
  movePaddle();
  moveBalls();
  collisionDetection();
  checkLevelUp();
  if (isLevelUp) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level " + level, canvas.width / 2 - 50, canvas.height / 2);
  }

  requestAnimationFrame(draw);
}

// Start the game
draw();
