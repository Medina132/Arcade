const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart");

const emojis = ["🐍", "🎮", "🚀", "🧠", "🕹️", "💾", "🧱", "🏁"];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;
let points = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  pairsFound = 0;
  points = 0;
  updateScore();
  gameBoard.innerHTML = "";
  const doubled = [...emojis, ...emojis];
  const shuffled = shuffle(doubled);

  shuffled.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.addEventListener("click", handleCardClick);
    card.textContent = emoji;
    gameBoard.appendChild(card);
  });

  cards = document.querySelectorAll(".card");
}

function handleCardClick(e) {
  const card = e.currentTarget;
  if (lockBoard || card.classList.contains("revealed")) return;

  card.classList.add("revealed");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    pairsFound++;
    points += 2; // ✅ acerto: +2 pontos
    updateScore();
    resetTurn();

    // Reinicia automaticamente quando todos os pares forem encontrados
    if (pairsFound === emojis.length) {
      setTimeout(() => {
        createBoard();
      }, 1000);
    }
  } else {
    points -= 1; // ❌ erro: -1 ponto
    updateScore();
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  scoreDisplay.textContent = `Pontos: ${points} | Pares encontrados: ${pairsFound}`;
}

restartBtn.addEventListener("click", createBoard);

createBoard();
