const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
ctx.scale(20, 20);

const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let score = 0;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let gameOver = false;

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

const colors = [
  null,
  '#0ff',
  '#f0f',
  '#ff0',
  '#0f0',
  '#f00',
  '#00f',
  '#fa0'
];

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  switch (type) {
    case 'T': return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
    case 'O': return [[2, 2], [2, 2]];
    case 'L': return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
    case 'J': return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
    case 'I': return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
    case 'S': return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    case 'Z': return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
  }
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] &&
          (arena[y + o.y] &&
           arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    score = 0;
    updateScore();
    gameOver = true;
    restartBtn.style.display = 'inline-block';
  }
}

function playerRotate(dir) {
  const m = player.matrix;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
    }
  }
  if (dir > 0) {
    m.forEach(row => row.reverse());
  } else {
    m.reverse();
  }

  let offset = 1;
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > m[0].length) {
      playerRotate(-dir);
      return;
    }
  }
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (!arena[y][x]) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    score += rowCount * 10;
    rowCount *= 2;
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval && !gameOver) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function updateScore() {
  scoreDisplay.textContent = `Pontos: ${score}`;
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    playerMove(-1);
  } else if (event.key === 'ArrowRight') {
    playerMove(1);
  } else if (event.key === 'ArrowDown') {
    playerDrop();
  } else if (event.key === 'q') {
    playerRotate(-1);
  } else if (event.key === 'w' || event.key === 'Enter') {
    playerRotate(1);
  }
});
  
  restartBtn.addEventListener('click', () => {
    gameOver = false;
    restartBtn.style.display = 'none';
    playerReset();
  });
  
  const arena = createMatrix(12, 20);
  const player = {
    pos: { x: 0, y: 0 },
    matrix: null
  };
  
  playerReset();
  updateScore();
  update();
  