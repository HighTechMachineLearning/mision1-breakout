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
