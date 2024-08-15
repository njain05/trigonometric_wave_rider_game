const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const amplitudeInput = document.getElementById('amplitude');
const frequencyInput = document.getElementById('frequency');
const phaseShiftInput = document.getElementById('phaseShift');
const startButton = document.getElementById('startButton');
const amplitudeValue = document.getElementById('amplitudeValue');
const frequencyValue = document.getElementById('frequencyValue');
const phaseShiftValue = document.getElementById('phaseShiftValue');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let amplitude = parseFloat(amplitudeInput.value);
let frequency = parseFloat(frequencyInput.value);
let phaseShift = parseFloat(phaseShiftInput.value);
let isPlaying = false;
let characterX = 50; // Start the character near the left side
let characterY = 0;
let score = 0;
let level = 1;
let obstacles = [];

document.addEventListener('keydown', moveCharacter);

function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the wave
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x < canvas.width; x++) {
        const y = amplitude * Math.sin(frequency * (x + phaseShift)) + canvas.height / 2;
        ctx.lineTo(x, y);
        if (x === Math.floor(characterX)) characterY = y;  // Update character Y position based on its X
    }
    ctx.strokeStyle = '#c3073f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw the character on the wave
    drawCharacter();

    // Draw obstacles
    drawObstacles();

    if (isPlaying) {
        phaseShift -= 2; // Move the wave to simulate motion
        score++;
        scoreDisplay.textContent = score;
        requestAnimationFrame(drawWave);
    }
}

function drawCharacter() {
    ctx.beginPath();
    ctx.arc(characterX, characterY, 10, 0, Math.PI * 2); // Draw the character as a circle
    ctx.fillStyle = '#00f';
    ctx.fill();
    ctx.closePath();
}

function moveCharacter(event) {
    const key = event.key;
    if (key === "ArrowRight" && characterX < canvas.width) {
        characterX += 10;
    } else if (key === "ArrowLeft" && characterX > 0) {
        characterX -= 10;
    }
}

function generateObstacle() {
    const obstacle = {
        x: Math.random() * canvas.width,
        y: 0,
        width: 10 + Math.random() * 30,
        height: 10 + Math.random() * 30,
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach((obstacle, index) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += 2; // Move obstacle down
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1); // Remove obstacle if it goes off screen
        }

        // Check for collision
        if (characterX < obstacle.x + obstacle.width &&
            characterX + 10 > obstacle.x &&
            characterY < obstacle.y + obstacle.height &&
            characterY + 10 > obstacle.y) {
            endGame();
        }
    });
}

function startGame() {
    isPlaying = true;
    obstacles = [];
    score = 0;
    characterX = 50; // Reset character to starting position
    drawWave();
    setInterval(generateObstacle, 2000); // Generate obstacles every 2 seconds
}

function endGame() {
    isPlaying = false;
    alert(`Game Over! Your score: ${score}`);
    startButton.textContent = "Restart Game";
}

function updateValues() {
    amplitude = parseFloat(amplitudeInput.value);
    frequency = parseFloat(frequencyInput.value);
    phaseShift = parseFloat(phaseShiftInput.value);

    amplitudeValue.textContent = amplitude;
    frequencyValue.textContent = frequency.toFixed(1);
    phaseShiftValue.textContent = phaseShift.toFixed(1);
}

amplitudeInput.addEventListener('input', updateValues);
frequencyInput.addEventListener('input', updateValues);
phaseShiftInput.addEventListener('input', updateValues);

startButton.addEventListener('click', () => {
    if (!isPlaying) {
        startGame();
        startButton.textContent = "Pause Game";
    } else {
        isPlaying = false;
        startButton.textContent = "Start Game";
    }
});

// Initialize game
updateValues();
