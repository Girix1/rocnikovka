import { player } from "./main.js";
import { canvas, ctx } from "./main.js";

const bullets = [];

document.addEventListener("keydown", (event) => {
    if (event.key === " " && bullets.length === 0) {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: canvas.height * 0.015
        });
    }
});

export function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

export function drawBullets() {
  ctx.fillStyle = "red";
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}
