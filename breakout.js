const WALL_WIDTH = 7;
const WALL_HEIGHT = 7;
const MARGIN = 0.0625;

const BRICK_WIDTH = parseFloat(get_from_css("--brick-width"));
const BRICK_HEIGHT = parseFloat(get_from_css("--brick-height"));

const game = init_game();
const paddle = init_paddle();
const ball = init_ball();
const bricks = init_wall();

let mouseX = 0;
let mouseY = 0;
game.element.addEventListener("mousemove", (event) => {
    mouseX = px_to_vmin(event.offsetX);
    mouseY = px_to_vmin(event.offsetY);
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

function init_game() {
    const element = document.getElementById("game");
    return {
        width: px_to_vmin(element.clientWidth),
        height: px_to_vmin(element.clientHeight),
        element: element,
    }
}

function init_paddle() {
    const element = document.getElementById("paddle");
    const rect = get_bounding_client_rect_in_vmin(element);
    return {
        x: game.width / 2 - rect.width / 2,
        y: (1 - MARGIN) * game.height - rect.height,
        width: rect.width,
        height: rect.height,
        element: element,
    }
}

function init_ball() {
    const element = document.getElementById("ball");
    const rect = get_bounding_client_rect_in_vmin(element);
    const angle = random_between(Math.PI / 4, Math.PI * 3 / 4);
    return {
        x: game.width / 2 - rect.width / 2,
        y: paddle.y - paddle.height / 2 - rect.height / 2,
        width: rect.width,
        height: rect.height,
        speed_x: Math.cos(angle),
        speed_y: -Math.sin(angle),
        element: element,
    }
}

function init_wall() {
    function brick_id(x, y) { return "b_" + x + "_" + y };
    const wall = document.getElementById("wall");
    let bricks = [];
    for (let y = 0; y < WALL_HEIGHT; y++) {
        for (let x = 0; x < WALL_WIDTH; x++) {
            const id = brick_id(x, y);
            wall.innerHTML += '<div class="brick" id="' + id + '">' + id + '</div>';
        }
    }
    const offset_x = (game.width - BRICK_WIDTH * WALL_WIDTH) / 2;
    const offset_y = MARGIN * game.height;
    for (let y = 0; y < WALL_HEIGHT; y++) {
        for (let x = 0; x < WALL_WIDTH; x++) {
            bricks.push({
                x: offset_x + x * BRICK_WIDTH,
                y: offset_y + y * BRICK_HEIGHT,
                element: document.getElementById(brick_id(x, y)),
            });
        }
    }
    return bricks;
}

function update_screen() {
    paddle.element.style.translate = paddle.x + "vmin " + paddle.y + "vmin";
    ball.element.style.translate = ball.x + "vmin " + ball.y + "vmin";
    for (let brick of bricks) {
        brick.element.style.translate = brick.x + "vmin " + brick.y + "vmin";
    }
}

function tick() {
    paddle.x = clamp(mouseX - paddle.width / 2, 0, game.width - paddle.width);
    ball.x += ball.speed_x;
    ball.y += ball.speed_y;
    update_screen();
}

// ---- Utilities ----

function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}

function px_to_vmin(px) {
    const vmin = Math.min(innerWidth, innerHeight) / 100;
    return px / vmin;
}

function get_bounding_client_rect_in_vmin(element) {
    let rect = element.getBoundingClientRect();
    const vmin = Math.min(innerWidth, innerHeight) / 100;
    return {
        x: rect.x / vmin,
        y: rect.y / vmin,
        width: rect.width / vmin,
        height: rect.height / vmin,
    }
}

function get_from_css(varname) {
    return getComputedStyle(document.documentElement).getPropertyValue(varname).trim();
}

function random_between(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.random() * (max - min) + min;
}
