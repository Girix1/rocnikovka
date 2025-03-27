import { canvas, ctx } from "./main.js";

export const enemies = [];

export const createEnemies = (rows, cols, spacingX, spacingY, enemyWidth, enemyHeight, speed) => {
    enemies.length = 0;

    const startX = (canvas.width - (cols * (enemyWidth + spacingX) - spacingX)) / 2;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: startX + col * (enemyWidth + spacingX),
                y: startY + row * (enemyHeight + spacingY),
                width: enemyWidth,
                height: enemyHeight,
                speedX: speed,
                direction: 1
            });
        }
    }
};

export const updateEnemies = () => {
    let changeDirection = false;

    enemies.forEach(enemy => {
        enemy.x += enemy.speedX * enemy.direction;

        if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
            changeDirection = true;
        }
    });

    if (changeDirection) {
        enemies.forEach(enemy => {
            enemy.direction *= -1;
            enemy.y += 20;
        });
    }
};

export const drawEnemies = () => {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
};
