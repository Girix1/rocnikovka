import { player } from "./main.js";
import { canvas, ctx } from "./main.js";


const bullets = [];

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: canvas.height * 0.015
        });
    }
});
