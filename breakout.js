const WALL_WIDTH = 7;
const WALL_HEIGHT = 7;
const MARGIN = 0.0625;

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
        y: (1 - MARGIN) * game.height - rect.height,
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

function brick_id(x, y) { return "b_" + x + "_" + y };
const wall = document.getElementById("wall");
let bricks = [];
for (let y = 0; y < WALL_HEIGHT; y++) {
    for (let x = 0; x < WALL_WIDTH; x++) {
        const id = brick_id(x, y);
        wall.innerHTML += '<div class="brick" id="' + id + '">' + id + '</div>';
    }
}
const example_brick = document.getElementById(brick_id(0, 0)).getBoundingClientRect();
const brick_width = example_brick.width;
const brick_height = example_brick.height;
const offset = (game.width - (brick_width + 1) * WALL_WIDTH - 1) / 2;
for (let y = 0; y < WALL_HEIGHT; y++) {
    for (let x = 0; x < WALL_WIDTH; x++) {
        bricks.push({
            x: offset + x * (brick_width + 1),
            y: MARGIN * game.height + y * (brick_height + 1),
            element: document.getElementById(brick_id(x, y)),
        });
    }
}

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
    for (let brick of bricks) {
        brick.element.style.translate = brick.x + "px " + brick.y + "px";
    }
}

function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}
