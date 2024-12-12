// M5Stack Cardputer Setup (TFT Display und Tastatur)
#include <M5Stack.h>

int width = 240;  // TFT-Breite
int height = 135; // TFT-Höhe

// Ball und Flipper-Parameter
struct Ball {
  int x, y, radius, dx, dy;
} ball;

struct Paddle {
  int x, y, width, height;
} paddle1, paddle2;

// Spielstatus und Score
int score = 0;
bool gameOver = false;

// Initialisierung
void setup() {
  M5.begin();
  M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextColor(WHITE);

  // Ball- und Flipper-Positionen
  ball = {width / 2, height / 2, 4, 1, -1};
  paddle1 = {50, height - 10, 40, 5};
  paddle2 = {width - 90, height - 10, 40, 5};

  // Spielstatus zurücksetzen
  score = 0;
  gameOver = false;
  M5.Lcd.setCursor(10, 10);
  M5.Lcd.print("Score: ");
  M5.Lcd.print(score);
  M5.Lcd.setCursor(10, 30);
  M5.Lcd.print("Press keys to play");
}

// Ball bewegen
void moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball Kollision mit den Wänden
  if (ball.x <= 0 || ball.x >= width) ball.dx = -ball.dx;  // Seitenwände
  if (ball.y <= 0) ball.dy = -ball.dy; // Decke

  // Ball Kollision mit Flippern
  if (ball.y + ball.radius >= paddle1.y && ball.x >= paddle1.x && ball.x <= paddle1.x + paddle1.width) {
    ball.dy = -ball.dy;
    score++;  // Punkte erhöhen
    M5.Lcd.setCursor(10, 10);
    M5.Lcd.fillRect(10, 10, 60, 20, BLACK);
    M5.Lcd.print("Score: ");
    M5.Lcd.print(score);
  }

  if (ball.y + ball.radius >= paddle2.y && ball.x >= paddle2.x && ball.x <= paddle2.x + paddle2.width) {
    ball.dy = -ball.dy;
    score++;  // Punkte erhöhen
    M5.Lcd.setCursor(10, 10);
    M5.Lcd.fillRect(10, 10, 60, 20, BLACK);
    M5.Lcd.print("Score: ");
    M5.Lcd.print(score);
  }

  // Spielende, wenn der Ball den Boden erreicht
  if (ball.y + ball.radius >= height) {
    gameOver = true;
    M5.Lcd.fillScreen(RED);
    M5.Lcd.setCursor(width / 4, height / 2);
    M5.Lcd.print("GAME OVER");
    M5.Lcd.setCursor(width / 4, height / 2 + 20);
    M5.Lcd.print("Press any key to restart");
  }
}

// Flipper bewegen (Steuerung über Tastatur)
void movePaddles() {
  if (M5.BtnA.wasPressed()) paddle1.x -= 5; // Flipper 1 nach links
  if (M5.BtnB.wasPressed()) paddle1.x += 5; // Flipper 1 nach rechts

  // Grenzen für Flipper
  if (paddle1.x < 0) paddle1.x = 0;
  if (paddle1.x > width / 2 - paddle1.width) paddle1.x = width / 2 - paddle1.width;

  if (M5.BtnC.wasPressed()) paddle2.x -= 5; // Flipper 2 nach links
  if (M5.BtnD.wasPressed()) paddle2.x += 5; // Flipper 2 nach rechts

  // Grenzen für Flipper
  if (paddle2.x < width / 2) paddle2.x = width / 2;
  if (paddle2.x > width - paddle2.width) paddle2.x = width - paddle2.width;
}

// Spielfeld zeichnen
void draw() {
  M5.Lcd.fillRect(0, 0, width, height, BLACK);
  M5.Lcd.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, BLUE); // Flipper 1
  M5.Lcd.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, GREEN); // Flipper 2
  M5.Lcd.fillRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2, WHITE); // Ball
}

// Hauptspiel-Loop
void loop() {
  if (gameOver && M5.BtnA.wasPressed() || M5.BtnB.wasPressed() || M5.BtnC.wasPressed() || M5.BtnD.wasPressed()) {
    setup();  // Neustart
  }

  if (!gameOver) {
    moveBall();
    movePaddles();
    draw();
    delay(10); // Verzögerung für bessere Steuerung
  }

  M5.update(); // Tasteneingabe aktualisieren
}
