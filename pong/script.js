const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;

const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#0ff",
  score: 0
};

const ai = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#f0f",
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speed: 4,
  velocityX: 4,
  velocityY: 4,
  color: "#fff"
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "bold 36px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

canvas.addEventListener("mousemove", evt => {
  let rect = canvas.getBoundingClientRect();
  player.y = evt.clientY - rect.top - player.height / 2;
});

function collision(ball, paddle) {
  return (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y - ball.radius < paddle.y + paddle.height &&
    ball.y + ball.radius > paddle.y
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 4;
  ball.velocityX = ball.velocityX > 0 ? -4 : 4;
  ball.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.1;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY *= -1;
  }

  let paddle = ball.x < canvas.width / 2 ? player : ai;
  if (collision(ball, paddle)) {
    let collidePoint = ball.y - (paddle.y + paddle.height / 2);
    collidePoint = collidePoint / (paddle.height / 2);
    let angleRad = collidePoint * (Math.PI / 4);
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.5;
  }

  if (ball.x - ball.radius < 0) {
    ai.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#111");
  drawText(`${player.score} : ${ai.score}`, canvas.width / 2, 50, "#0ff");
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
  update();
  render();
}

setInterval(game, 1000 / 60);
