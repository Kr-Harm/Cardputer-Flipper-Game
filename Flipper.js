let width = 240;  // TFT-Breite
let height = 135; // TFT-Höhe

// Ball und Flipper-Parameter
let ball = {
  x: width / 2,
  y: height / 2,
  radius: 4,
  dx: 1,
  dy: -1
};

let paddle1 = {
  x: 50,
  y: height - 10,
  width: 40,
  height: 5
};

let paddle2 = {
  x: width - 90,
  y: height - 10,
  width: 40,
  height: 5
};

// Spielstatus und Score
let score = 0;
let gameOver = false;

// Initialisierung
function setup() {
  createCanvas(width, height);
  resetGame();
}

function resetGame() {
  ball = { x: width / 2, y: height / 2, radius: 4, dx: 1, dy: -1 };
  paddle1 = { x: 50, y: height - 10, width: 40, height: 5 };
  paddle2 = { x: width - 90, y: height - 10, width: 40, height: 5 };
  score = 0;
  gameOver = false;
}

// Ball bewegen
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball Kollision mit den Wänden
  if (ball.x <= 0 || ball.x >= width) ball.dx = -ball.dx; // Seitenwände
  if (ball.y <= 0) ball.dy = -ball.dy; // Decke

  // Ball Kollision mit Flippern
  if (
      ball.y + ball.radius >= paddle1.y &&
      ball.x >= paddle1.x &&
      ball.x <= paddle1.x + paddle1.width
  ) {
    ball.dy = -ball.dy;
    score++;
  }

  if (
      ball.y + ball.radius >= paddle2.y &&
      ball.x >= paddle2.x &&
      ball.x <= paddle2.x + paddle2.width
  ) {
    ball.dy = -ball.dy;
    score++;
  }

  // Spielende, wenn der Ball den Boden erreicht
  if (ball.y + ball.radius >= height) {
    gameOver = true;
  }
}

// Flipper bewegen
function movePaddles() {
  if (keyIsDown(LEFT_ARROW)) paddle1.x -= 5; // Flipper 1 nach links
  if (keyIsDown(RIGHT_ARROW)) paddle1.x += 5; // Flipper 1 nach rechts

  if (keyIsDown(65)) paddle2.x -= 5; // Flipper 2 nach links (Taste 'A')
  if (keyIsDown(68)) paddle2.x += 5; // Flipper 2 nach rechts (Taste 'D')

  // Grenzen für Flipper
  paddle1.x = constrain(paddle1.x, 0, width / 2 - paddle1.width);
  paddle2.x = constrain(paddle2.x, width / 2, width - paddle2.width);
}

// Spielfeld zeichnen
function drawGame() {
  background(0);
  fill(255);
  textSize(12);
  text(`Score: ${score}`, 10, 10);

  fill(0, 0, 255);
  rect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); // Flipper 1

  fill(0, 255, 0);
  rect(paddle2.x, paddle2.y, paddle2.width, paddle2.height); // Flipper 2

  fill(255);
  ellipse(ball.x, ball.y, ball.radius * 2); // Ball

  if (gameOver) {
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    text("Press any key to restart", width / 2, height / 2 + 20);
  }
}

// Hauptspiel-Loop
function draw() {
  if (!gameOver) {
    moveBall();
    movePaddles();
    drawGame();
  } else {
    drawGame();
    if (keyIsPressed) resetGame();
  }
}
