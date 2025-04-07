import "./bullets.js";
import "./enemies.js";
import { updateBullets, drawBullets } from "./bullets.js";
import { drawEnemies, createEnemies, updateEnemies, waveLevel } from "./enemies.js";
import { updateEnemyBullets, drawEnemyBullets } from "./enemyBullets.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export { player };

createEnemies(3, 5, 20, 20, 40, 30, 2);

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

export const handlePlayerHit = () => {
  gameState.playerLives--;
  console.log(`Zbývající životy: ${gameState.playerLives}`);
  if (gameState.playerLives <= 0) console.log("Game Over!");
  //dalsi shit kterej jsem ted linej delat
};

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

let gameStarted = false;

const drawStartScreen = () => {
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

    ctx.fillStyle = "#ff6600";
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

let gameLoop = () => {
    if (!gameStarted) {
        drawStartScreen(); 
        requestAnimationFrame(gameLoop);
        return;
    }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  update();
  updateBullets();
  drawBullets();
  updateEnemies();
  drawEnemies();
  updateEnemyBullets();
  drawEnemyBullets();
  drawScore();
  requestAnimationFrame(gameLoop);
};

gameLoop();
