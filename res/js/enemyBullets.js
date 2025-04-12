import { canvas, ctx, player, handlePlayerHit } from "./main.js";
import { enemies, waveLevel } from "./enemies.js";

export const enemyBullets = [];

const shootChance = 0.003;

export const updateEnemyBullets = (deltaTime) => {
    const currentShootChance = shootChance + waveLevel * 0.001;
    enemies.forEach(enemy => {
        if (Math.random() < currentShootChance) {
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 5,
                y: enemy.y + enemy.height,
                width: 10,
                height: 20,
                speed: 5 + waveLevel * 0.5
            });
        }
    });

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed * deltaTime;
        if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            enemyBullets.splice(i, 1);
            handlePlayerHit();
            continue;
        }
        if (enemyBullets[i].y > canvas.height) enemyBullets.splice(i, 1);
    }
};

export const drawEnemyBullets = () => {
    ctx.fillStyle = "white";
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
};