import { canvas, ctx, gameState, increaseScore} from "./main.js";
import { bullets } from "./bullets.js";
import { setCanShoot } from "./bullets.js";

export const enemies = [];
export let waveLevel = 1;

export const createEnemies = (
  rows,
  cols,
  spacingX,
  spacingY,
  enemyWidth,
  enemyHeight,
  speed
) => {
  enemies.length = 0;

  const startX =
    (canvas.width - (cols * (enemyWidth + spacingX) - spacingX)) / 2;
  const startY = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: startX + col * (enemyWidth + spacingX),
        y: startY + row * (enemyHeight + spacingY),
        width: enemyWidth,
        height: enemyHeight,
        speedX: speed,
        direction: 1,
      });
    }
  }
};

export const updateEnemies = () => {
  let changeDirection = false;

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].x += enemies[i].speedX * enemies[i].direction;

    if (enemies[i].x + enemies[i].width >= canvas.width || enemies[i].x <= 0) {
      changeDirection = true;
    }
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        bullets[j].x < enemies[i].x + enemies[i].width &&
        bullets[j].x + bullets[j].width > enemies[i].x &&
        bullets[j].y < enemies[i].y + enemies[i].height &&
        bullets[j].y + bullets[j].height > enemies[i].y
      ) {
        // to splice proste pracuje s polem a meni nebo maze jeho obsah (hodne funny)
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        setCanShoot(true);
        increaseScore(waveLevel);
        break;
      }
    }
  }

  if (changeDirection) {
    enemies.forEach((enemy) => {
      enemy.direction *= -1;
      enemy.y += 20;
    });
  }

  if (enemies.length === 0) {
    increaseScore();
    waveLevel++;
    const newSpeed = 2 + waveLevel * 0.5;
    createEnemies(3, 6, 20, 20, 40, 40, newSpeed);
  }
};

export const drawEnemies = () => {
  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
};
