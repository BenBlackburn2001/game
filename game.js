const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');

const player = { x: 50, y: 50, size: 20, color: 'lime' };
const goal = { x: 530, y: 330, size: 30, color: 'gold' };
const obstacles = [
    { x: 200, y: 100, w: 100, h: 20 },
    { x: 400, y: 250, w: 20, h: 100 },
    { x: 300, y: 300, w: 80, h: 20 }
];

let gameOver = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.size, goal.size);

    // Draw obstacles
    ctx.fillStyle = 'red';
    obstacles.forEach(ob => {
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function checkCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.size > b.x &&
        a.y < b.y + b.h &&
        a.y + a.size > b.y
    );
}

function checkGoal() {
    return (
        player.x < goal.x + goal.size &&
        player.x + player.size > goal.x &&
        player.y < goal.y + goal.size &&
        player.y + player.size > goal.y
    );
}

function update() {
    if (gameOver) return;

    // Check obstacle collisions
    for (let ob of obstacles) {
        if (checkCollision(player, ob)) {
            messageDiv.textContent = "You hit an obstacle! Game Over.";
            gameOver = true;
            return;
        }
    }

    // Check goal
    if (checkGoal()) {
        messageDiv.textContent = "You reached the goal! You win!";
        gameOver = true;
        return;
    }
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    const speed = 5;
    if (e.key === 'ArrowUp') player.y -= speed;
    if (e.key === 'ArrowDown') player.y += speed;
    if (e.key === 'ArrowLeft') player.x -= speed;
    if (e.key === 'ArrowRight') player.x += speed;

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
});

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
