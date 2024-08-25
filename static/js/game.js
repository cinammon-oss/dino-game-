// Get DOM elements
const dino = document.getElementById("dino");
const obstacle = document.getElementById("obstacle");
const ground1 = document.getElementById("ground1"); // First ground element
const ground2 = document.getElementById("ground2"); // Second ground element
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restart-button");
const finalScoreElement = document.getElementById("final-score");

// Game variables
let score = 0;
let highScore = 0;
let isJumping = false;
let gameInterval;
const jumpHeight = 100; // Fixed jump height
const jumpVelocity = 10; // Constant velocity for jumping and coming down
const obstacleSpeed = 8; // Velocity of the obstacle
const groundSpeed = 4; // Speed at which the ground moves
const dinoInitialBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
const obstacleInitialRight = -30; // Initial position of the obstacle off-screen

// Start game
function startGame() {
    score = 0;
    scoreElement.innerText = "Score: 0";
    dino.style.bottom = dinoInitialBottom + "px";
    obstacle.style.right = obstacleInitialRight + "px";
    ground1.style.left = "0px"; // Reset first ground position
    ground2.style.left = "100%"; // Position the second ground right next to the first one
    gameOverScreen.classList.add("hidden"); // Hide the game over screen

    if (gameInterval) {
        clearInterval(gameInterval); // Clear any existing game interval
    }
    gameInterval = setInterval(() => {
        moveObstacle();
        moveGround();
        checkCollision();
    }, 20); // Start the game loop
}

function selectDinoImage(imageFileName) {
    const dino = document.getElementById("dino");
    const imagePath = `/static/uploads/${imageFileName}`;
    dino.style.backgroundImage = `url('${imagePath}')`;
}


// Handle jumping mechanism
function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpStartBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let jumpPeak = jumpStartBottom + jumpHeight;
    let ascent = true;

    const jumpInterval = setInterval(() => {
        let currentBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));

        if (ascent) {
            if (currentBottom < jumpPeak) {
                dino.style.bottom = (currentBottom + jumpVelocity) + "px";
            } else {
                ascent = false;
            }
        } else {
            if (currentBottom > dinoInitialBottom) {
                dino.style.bottom = (currentBottom - jumpVelocity) + "px";
            } else {
                dino.style.bottom = dinoInitialBottom + "px";
                clearInterval(jumpInterval);
                isJumping = false;
            }
        }
    }, 20);
}

// Move obstacle and update score
function moveObstacle() {
    let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));

    if (obstacleRight > 800) { // Reset obstacle position and increase score
        obstacle.style.right = obstacleInitialRight + "px";
        score++;
        scoreElement.innerText = "Score: " + score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = "High Score: " + highScore;
        }
    } else {
        obstacle.style.right = (obstacleRight + obstacleSpeed) + "px"; // Move obstacle to the left
    }
}

// Move the ground continuously in a loop
function moveGround() {
    let ground1Left = parseInt(window.getComputedStyle(ground1).getPropertyValue("left"));
    let ground2Left = parseInt(window.getComputedStyle(ground2).getPropertyValue("left"));

    // Move both ground elements
    ground1.style.left = (ground1Left - groundSpeed) + "px";
    ground2.style.left = (ground2Left - groundSpeed) + "px";

    // Reset ground positions when they move out of view
    if (ground1Left <= -window.innerWidth) {
        ground1.style.left = (ground2Left + window.innerWidth) + "px"; // Position ground1 right after ground2
    }

    if (ground2Left <= -window.innerWidth) {
        ground2.style.left = (ground1Left + window.innerWidth) + "px"; // Position ground2 right after ground1
    }
}

// Check for collision with the obstacle
function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dinoRect.right > obstacleRect.left &&
        dinoRect.left < obstacleRect.right &&
        dinoRect.bottom > obstacleRect.top &&
        dinoRect.top < obstacleRect.bottom
    ) {
        endGame();
    }
}

// End the game and show the game over screen
function endGame() {
    clearInterval(gameInterval); // Stop the game loop
    finalScoreElement.innerText = "Your Score: " + score;
    gameOverScreen.classList.remove("hidden");
}

// Reload the page to restart the game
function restartGame() {
    location.reload(); // Reload the entire page
}

// Event listeners
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

restartButton.addEventListener("click", restartGame);

// Initialize the game on page load
startGame();
