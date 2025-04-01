import "./bullets.js";
import "./enemies.js";
import { updateBullets, drawBullets } from "./bullets.js";
import { drawEnemies, createEnemies, updateEnemies } from "./enemies.js";
import { updateEnemyBullets, drawEnemyBullets} from "./enemyBullets.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d"); 
export { player };

createEnemies(3, 5, 20, 20, 40, 30, 2);

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
    dx: 0
};
const playerImg = new Image();
playerImg.src = "res/img/raketa.png";

const drawPlayer = () => ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") player.dx = -player.speed;
    else if (event.key === "ArrowRight" || event.key === "d") player.dx = player.speed;
});

document.addEventListener("keyup", (event) => {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) player.dx = 0;
});

const update = () => {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
};

let playerLives = 3;
export const handlePlayerHit = () => {
    playerLives--;
    console.log(`Zbývající životy: ${playerLives}`)
    if (playerLives <= 0) console.log("Game Over!");
    //dalsi shit kterej jsem ted linej delat
};

let gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    update();
    updateBullets();
    drawBullets();
    updateEnemies();
    drawEnemies();
    updateEnemyBullets();
    drawEnemyBullets();
    requestAnimationFrame(gameLoop);
};

gameLoop();