const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{ x: 10 * box, y: 10 * box }];
let direction = 'right';
let score = 0;
let isGameOver = false;
let gameLoop;

let food = {
  x: Math.floor(Math.random() * cols) * box,
  y: Math.floor(Math.random() * rows) * box
};

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#0ff' : '#0aa';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.shadowBlur = 0;
  }
}

function drawFood() {
  ctx.fillStyle = '#f00';
  ctx.shadowColor = '#f00';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();

  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === 'up') head.y -= box;
  if (direction === 'down') head.y += box;
  if (direction === 'left') head.x -= box;
  if (direction === 'right') head.x += box;

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Pontos: ${score}`;
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };
  } else {
    snake.pop();
  }
}

function endGame() {
  isGameOver = true;
  clearInterval(gameLoop);
  restartBtn.style.display = 'inline-block';
}

restartBtn.addEventListener('click', () => {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = 'right';
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = `Pontos: ${score}`;
  food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
  };
  restartBtn.style.display = 'none';
  gameLoop = setInterval(draw, 150); // velocidade reduzida
});

gameLoop = setInterval(draw, 150);
