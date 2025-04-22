import "./bullets.js";
import "./enemies.js";
import { updateBullets, drawBullets } from "./bullets.js";
import {drawEnemies, createEnemies, updateEnemies, waveLevel} from "./enemies.js";
import { updateEnemyBullets, drawEnemyBullets } from "./enemyBullets.js";
import { sfx } from "./sound.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export { player };
export const gameState = {
  score: 0,
  playerLives: 2,
};
export const increaseScore = (amount) => {
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
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A")
    player.dx = -player.speed;
  else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D")
    player.dx = player.speed;
});

document.addEventListener("keyup", (event) => {
  if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(event.key)) player.dx = 0;
});

const update = (deltaTime) => {
  player.x += player.dx * deltaTime;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
};

//zivoty

export const handlePlayerHit = () => {
  gameState.playerLives--;
  sfx.damage.play();
  console.log(`Zbývající životy: ${gameState.playerLives}`);
  if (gameState.playerLives <= 0) showGameOver();
};
//vykresleni score, zivotu a wavelevelu

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
let showingInstructions = false;

const startMenu = document.getElementById("startMenu");
const instructionsScreen = document.getElementById("instructionsScreen");
const startGameButton = document.getElementById("startGameButton");
const instructionsButton = document.getElementById("instructionsButton");

const showStartScreen = () => {
  instructionsScreen.style.display = "none";
  canvas.style.display = "none";
  startMenu.style.display = "flex";
};

startGameButton.addEventListener("click", () => {
  sfx.button.play();
  startMenu.style.display = "none";
  canvas.style.display = "block";
  sfx.gameStart.play();
  gameStarted = true;
  gameLoop();
});

instructionsButton.addEventListener("click", () => {
  sfx.button.play();
  startMenu.style.display = "none";
  instructionsScreen.style.display = "flex";
  showingInstructions = true;
});

const backToStart = () => {
  sfx.button.play();
  showingInstructions = false;
  instructionsScreen.style.display = "none";
  startMenu.style.display = "flex";
};
window.backToStart = backToStart;

//game over screen
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const waveNumber = document.getElementById("waveNumber");
const restartButton = document.getElementById("restartButton");
const highScoresList = document.getElementById("highScoresList");

restartButton.addEventListener("click", () => {
  sfx.button.play();
  setTimeout(() => {
    location.reload();
  }, 300);
});

let gameOverDisplayed = false;
let frozenFrame = null;

export const showGameOver = () => {
  if (gameOverDisplayed) return;
  frozenFrame = new Image();
  frozenFrame.src = canvas.toDataURL();
  sfx.gameOver.play();
  console.log("Game Over!");
  gameOver = true;
  gameStarted = false;
  gameOverDisplayed = true;
  finalScore.textContent = `Score: ${gameState.score}`;
  waveNumber.textContent = `Wave: ${waveLevel}`;
  saveHighScore(gameState.score);
  updateHighScoresList();
  gameOverScreen.style.display = "block";
};

// ukladani score 

const saveHighScore = (score) => {
  let scores = JSON.parse(localStorage.getItem("highScores")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(scores));
};

const updateHighScoresList = () => {
  const scores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScoresList.innerHTML = scores.map((s) => `<li>${s}</li>`).join("");
};

// universal speed hokus pokus diplodokus 🗣️ (uz to ztracim)

let lastTime = performance.now();

//volani funkci pro spravne spousteni hry atd

let gameLoop = (currentTime = performance.now()) => {
  const deltaTime = (currentTime - lastTime) / 10;
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameStarted && !gameOver) {
    drawPlayer();
    update(deltaTime);
    updateBullets(deltaTime);
    drawBullets();
    updateEnemies(deltaTime);
    drawEnemies();
    updateEnemyBullets(deltaTime);
    drawEnemyBullets();
    drawScore();
  } else if (gameOver && frozenFrame) {
    ctx.drawImage(frozenFrame, 0, 0, canvas.width, canvas.height);
    return;
  } else if (!showingInstructions) {
    showStartScreen();
  }  
  requestAnimationFrame(gameLoop);
};

gameLoop();

//Ahoj Honzo :-)