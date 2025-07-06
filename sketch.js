let board;
let currentPlayer;
let cellSize;
let winner = null;

let scoreX = 0;
let scoreO = 0;

let gameOver = false;

let startTime;

// Sonidos
let soundCorrect;
let soundFanfare;

function preload() {
  // Archivos en la MISMA carpeta que sketch.js
  soundCorrect = loadSound('correct-6033.mp3');
  soundFanfare = loadSound('fanfare-1-276819.mp3');
}

function setup() {
  // El tablero tendrá 600x500, centrado dentro del marco 900x700
  let canvas = createCanvas(400, 500);
  canvas.parent('ledFrame'); // Ancla el canvas dentro del marco LED
  cellSize = height / 3;
  resetBoard();

  const btn = select('#newGameBtn');
  btn.mousePressed(() => {
    if (!gameOver) {
      resetBoard();
    }
  });

  startTime = millis();
  updateScores();
}

function draw() {
  background(20);

  drawBoard();
  drawMarks();
  updateTimer();

  if (winner) {
    fill(0, 255, 0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Jugador ${winner} ganó este juego!`, width / 2, height - 20);

    if (scoreX === 5 || scoreO === 5) {
      if (!soundFanfare.isPlaying()) {
        soundFanfare.play();
      }
      gameOver = true;
      textSize(28);
      text(`Jugador ${winner} ganó la serie!`, width / 2, height / 2);
      noLoop();
    }
  }
}

function drawBoard() {
  strokeWeight(4);
  let glow = map(sin(frameCount * 0.05), -1, 1, 180, 255);
  stroke(0, glow, 0);

  for (let i = 1; i < 3; i++) {
    line(cellSize * i, 0, cellSize * i, height);
    line(0, cellSize * i, width, cellSize * i);
  }
}

function drawMarks() {
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(0, 255, 0);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = cellSize * j + cellSize / 2;
      let y = cellSize * i + cellSize / 2;
      text(board[i][j], x, y);
    }
  }
}

function mousePressed() {
  if (winner || gameOver) return;

  let j = floor(mouseX / cellSize);
  let i = floor(mouseY / cellSize);

  if (i >= 0 && i < 3 && j >= 0 && j < 3) {
    if (board[i][j] === '') {
      board[i][j] = currentPlayer;
      if (checkWinner()) {
        winner = currentPlayer;
        if (currentPlayer === 'X') {
          scoreX++;
        } else {
          scoreO++;
        }
        updateScores();

        // Reproduce sonido de juego ganado
        soundCorrect.play();

      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }
}

function resetBoard() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  winner = null;
  currentPlayer = 'X';
  startTime = millis();
  loop();
}

function checkWinner() {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === currentPlayer &&
        board[i][1] === currentPlayer &&
        board[i][2] === currentPlayer) {
      return true;
    }

    if (board[0][i] === currentPlayer &&
        board[1][i] === currentPlayer &&
        board[2][i] === currentPlayer) {
      return true;
    }
  }

  if (board[0][0] === currentPlayer &&
      board[1][1] === currentPlayer &&
      board[2][2] === currentPlayer) {
    return true;
  }

  if (board[0][2] === currentPlayer &&
      board[1][1] === currentPlayer &&
      board[2][0] === currentPlayer) {
    return true;
  }

  return false;
}

function updateTimer() {
  let elapsed = floor((millis() - startTime) / 1000);
  let mins = floor(elapsed / 60);
  let secs = elapsed % 60;
  let formatted = nf(mins, 1) + ':' + nf(secs, 2);
  document.getElementById('timer').textContent = `Tiempo: ${formatted}`;
}

function updateScores() {
  document.getElementById('scoreX').textContent = scoreX;
  document.getElementById('scoreO').textContent = scoreO;
}


