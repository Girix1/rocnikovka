import { canvas, ctx, gameState, increaseScore, showGameOver } from "./main.js";
import { bullets, setCanShoot } from "./bullets.js";
import { sfx } from "./sound.js";

export const enemies = [];
export let waveLevel = 0;

const realEnemies = [
  "res/img/enemies/real1.png",
  "res/img/enemies/real2.png",
  "res/img/enemies/real3.png",
  "res/img/enemies/real4.png",
  "res/img/enemies/real5.png"
];

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
      const img = new Image();
      img.src = realEnemies[Math.floor(Math.random() * realEnemies.length)];

      enemies.push({
        x: startX + col * (enemyWidth + spacingX),
        y: startY + row * (enemyHeight + spacingY),
        width: enemyWidth,
        height: enemyHeight,
        speedX: speed,
        direction: 1,
        image: img
      });
    }
  }
};

export const updateEnemies = (deltaTime) => {
  let changeDirection = false;
  
  for (let i = 0; i < enemies.length; i++) {
    const nextX = enemies[i].x + enemies[i].speedX * enemies[i].direction * deltaTime;
    if (nextX + enemies[i].width >= canvas.width || nextX <= 0) {
      changeDirection = true;
      break;
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (changeDirection) {
      enemies[i].direction *= -1;
      enemies[i].y += 20;
    }
    enemies[i].x += enemies[i].speedX * enemies[i].direction * deltaTime;

      // kulky dotknuti enemaku 
      for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        bullets[j].x < enemies[i].x + enemies[i].width &&
        bullets[j].x + bullets[j].width > enemies[i].x &&
        bullets[j].y < enemies[i].y + enemies[i].height &&
        bullets[j].y + bullets[j].height > enemies[i].y
      ) {
        sfx.pop.play();
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        setCanShoot(true);
        increaseScore(waveLevel);
        break;
      }
    }
  }

  for (let j = 0; j < enemies.length; j++) {
    if (enemies[j].y + enemies[j].height >= canvas.height - 100) {
      console.log("Game Over: enemies landed!");
      requestAnimationFrame(() => showGameOver());
    }
  }

  if (enemies.length === 0) {
    gameState.playerLives++;
    sfx.levelUp.play();
    waveLevel++;
    const newSpeed = 1 + waveLevel * 0.5;
    createEnemies(3, 6, 20, 20, 60, 60, newSpeed);
  }
}

export const drawEnemies = () => {
  enemies.forEach((enemy) => {
    if (enemy.image.complete) ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
  });
};
