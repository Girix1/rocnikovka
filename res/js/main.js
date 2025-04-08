import "./bullets.js";
import "./enemies.js";
import { updateBullets, drawBullets } from "./bullets.js";
import { drawEnemies, createEnemies, updateEnemies, waveLevel } from "./enemies.js";
import { updateEnemyBullets, drawEnemyBullets } from "./enemyBullets.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export { player };

createEnemies();

export const gameState = {
  score: 0,
  playerLives: 3
};

export const increaseScore = (amount = 1) => {
  gameState.score += amount;
};

const resizeCanvas = () => {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;

  player.width = canvas.width * 0.05;
  player.height = player.width;
  player.speed = canvas.width * 0.01;

  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 20;
};

//hrac

const player = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  speed: 0,
  dx: 0,
};
const playerImg = new Image();
playerImg.src = "res/img/raketa.png";

const drawPlayer = () =>
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") player.dx = -player.speed;
  else if (event.key === "ArrowRight" || event.key === "d")
    player.dx = player.speed;
});

document.addEventListener("keyup", (event) => {
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) player.dx = 0;
});

const update = () => {
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
};

//zivoty

export const handlePlayerHit = () => {
  gameState.playerLives--;
  console.log(`Zbývající životy: ${gameState.playerLives}`);
  if (gameState.playerLives <= 0) showGameOver();
};
//score 

const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "24px 'Press Start 2P', monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${gameState.score}`, 20, 40);
  ctx.textAlign = "center";
  ctx.fillText(`Lives: ${gameState.playerLives}`, canvas.width / 2, 30);
  ctx.textAlign = "right";
  ctx.fillText(`Wave: ${waveLevel}`, canvas.width - 20, 30);
};

//startscreen 
let gameStarted = false;
let gameOver = false;

const showStartScreen = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "64px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("SPACE INVADERS!", canvas.width / 2, canvas.height / 2 - 100);
    ctx.font = "32px 'Press Start 2P', monospace";
    ctx.fillText("By Tomáš Novák", canvas.width / 2, canvas.height / 2 - 50);

    const buttonWidth = 300;
    const buttonHeight = 80;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    ctx.fillStyle = "#ffa31a";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = "black";
    ctx.font = "32px 'Press Start 2P', monospace";
    ctx.fillText("START", canvas.width / 2, buttonY + buttonHeight / 2 + 10);
};

canvas.addEventListener("click", (event) => {
    if (gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 300;
    const buttonHeight = 80;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    const withinX = mouseX >= buttonX && mouseX <= buttonX + buttonWidth;
    const withinY = mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

    if (withinX && withinY) {
        gameStarted = true;
        gameLoop();
    }
});

//game over screen
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const waveNumber = document.getElementById("waveNumber");
const restartButton = document.getElementById("restartButton");
const highScoresList = document.getElementById("highScoresList");

restartButton.addEventListener("click", () => {
  location.reload();
});

let gameOverDisplayed = false;
let frozenFrame = null;

export const showGameOver = () => {
    if (gameOverDisplayed) return;
    frozenFrame = new Image();
    frozenFrame.src = canvas.toDataURL();
    console.log("Game Over!");
    gameOver = true;
    gameStarted = false
    gameOverDisplayed = true;
    finalScore.textContent = `Score: ${gameState.score}`;
    waveNumber.textContent = `Wave: ${waveLevel}`;
    saveHighScore(gameState.score);
    updateHighScoresList();
    gameOverScreen.style.display = "block";
};

const saveHighScore = (score) => {
    let scores = JSON.parse(localStorage.getItem("highScores")) || [];
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    localStorage.setItem("highScores", JSON.stringify(scores));
};

const updateHighScoresList = () => {
    const scores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScoresList.innerHTML = scores.map(s => `<li>${s}</li>`).join("");
};

let gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted && !gameOver) {
        drawPlayer();
        update();
        updateBullets();
        drawBullets();
        updateEnemies();
        drawEnemies();
        updateEnemyBullets();
        drawEnemyBullets();
        drawScore();
    } else if (gameOver && frozenFrame) {
        ctx.drawImage(frozenFrame, 0, 0, canvas.width, canvas.height);
  return;
    } else {
        showStartScreen();
    }
    requestAnimationFrame(gameLoop);
};

gameLoop();
