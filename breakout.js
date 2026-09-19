const WALL_WIDTH = 7;
const WALL_HEIGHT = 7;
document.documentElement.style.setProperty("--wall-width", WALL_WIDTH);
document.documentElement.style.setProperty("--wall-height", WALL_HEIGHT);

const wall = document.getElementById("wall");
for (let i = 0; i < WALL_WIDTH * WALL_HEIGHT; i++) {
    wall.innerHTML += brick_html(i);
}

function brick_html(num) {
    return '<div class="brick">' + num + '</div>';
}

const game = (() => {
    const element = document.getElementById("game");
    return {
        width: element.clientWidth,
        height: element.clientHeight,
        element: element,
    }
})();

const paddle = (() => {
    const element = document.getElementById("paddle");
    const rect = element.getBoundingClientRect();
    return {
        x: game.width / 2 - rect.width / 2,
        y: game.height * 0.90625,
        width: rect.width,
        height: rect.height,
        element: element,
    }
})();

const ball = (() => {
    const element = document.getElementById("ball");
    const rect = element.getBoundingClientRect();
    return {
        x: game.width / 2 - rect.width / 2,
        y: paddle.y - paddle.height / 2 - rect.height / 2,
        width: rect.width,
        height: rect.height,
        speed_x: 0,
        speed_y: -1,
        element: element,
    }
})();

let mouseX = 0;
let mouseY = 0;
game.element.addEventListener("mousemove", (event) => {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
})

let interval = null;
game.element.addEventListener("click", (event) => {
    if (interval === null) interval = setInterval(tick, 1000 / 60);
    else {
        clearInterval(interval);
        interval = null;
    }
})

update_screen();

// End of main, only functions below

function tick() {
    paddle.x = clamp(mouseX - paddle.width / 2, 0, game.width - paddle.width);
    ball.x += ball.speed_x;
    ball.y += ball.speed_y;
    update_screen();
}

function update_screen() {
    paddle.element.style.translate = paddle.x + "px " + paddle.y + "px";
    ball.element.style.translate = ball.x + "px " + ball.y + "px";
}

function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}
