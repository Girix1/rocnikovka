import { player } from "./main.js";
import { canvas, ctx } from "./main.js";

export const bullets = [];
const cannons = [
    { offsetX: 0.2 },
    { offsetX: 0.8 } 
];

let cannonIndex = 0;
let canShoot = true;

document.addEventListener("keydown", (event) => {
    if (event.key === " " && canShoot) {
        const cannon = cannons[cannonIndex];
        cannonIndex = (cannonIndex + 1) % cannons.length;

        bullets.length = 0;
        bullets.push({
            x: player.x + player.width * cannon.offsetX - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: canvas.height * 0.015
        });
        canShoot = false;
    }
});

export function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
      canShoot = true;  
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
