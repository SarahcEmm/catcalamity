const gameContainer = document.getElementById('game-container');
const cat = document.querySelector('.cat');
const scoreDisplay = document.getElementById('score');

let score = 0;
let isGameOver = false;
let catPosition = 50; // Horizontal position (percentage)
let balance = 0; // Tracks balance state
let yarns = []; // Array of yarn objects

// Move the cat with arrow keys
window.addEventListener('keydown', (e) => {
  if (isGameOver) return;

  if (e.key === 'ArrowLeft' && catPosition > 5) {
    catPosition -= 5;
    balance -= 1; // Shift balance
  } else if (e.key === 'ArrowRight' && catPosition < 95) {
    catPosition += 5;
    balance += 1; // Shift balance
  }

  // Update cat position
  cat.style.left = `${catPosition}%`;

  // Check if balance is too far off
  if (Math.abs(balance) > 5) {
    gameOver();
  }
});

// Add falling yarn balls
function spawnYarn() {
  const yarn = document.createElement('div');
  yarn.classList.add('yarn');
  yarn.style.left = `${Math.random() * 90}%`;
  yarn.style.top = '-50px';
  gameContainer.appendChild(yarn);
  yarns.push(yarn);
}

// Move yarn and check for collisions
function moveYarn() {
  yarns.forEach((yarn, index) => {
    const top = parseInt(window.getComputedStyle(yarn).top);
    if (top > 550) {
      yarn.remove(); // Remove off-screen yarn
      yarns.splice(index, 1);
    } else {
      yarn.style.top = `${top + 5}px`;
      checkCollision(yarn, index);
    }
  });
}

// Check for collision with the cat
function checkCollision(yarn, index) {
  const yarnRect = yarn.getBoundingClientRect();
  const catRect = cat.getBoundingClientRect();

  if (
    yarnRect.left < catRect.right &&
    yarnRect.right > catRect.left &&
    yarnRect.top < catRect.bottom &&
    yarnRect.bottom > catRect.top
  ) {
    // Collision detected
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    yarn.remove();
    yarns.splice(index, 1);
  }
}

// Game over logic
function gameOver() {
  isGameOver = true;
  alert('Game Over! You fell off the fence!');
  window.location.reload(); // Reload the game
}

// Main game loop
function gameLoop() {
  if (!isGameOver) {
    moveYarn();

    // Randomly spawn yarn
    if (Math.random() < 0.02) {
      spawnYarn();
    }

    requestAnimationFrame(gameLoop);
  }
}

// Start the game
gameLoop();
