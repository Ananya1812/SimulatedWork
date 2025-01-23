const squares = document.querySelectorAll(".square");
const timeLeft = document.querySelector("#time-left");
const score = document.querySelector("#score");

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let speed = 1000; // Initial speed in milliseconds

// Function to randomly assign moles to squares
function randomSquare() {
  squares.forEach((square) => {
    square.classList.remove("mole", "bonus-mole");
  });

  const randomSquare = squares[Math.floor(Math.random() * 9)];
  const isBonus = Math.random() < 0.2; // 20% chance for a bonus mole

  if (isBonus) {
    randomSquare.classList.add("bonus-mole");
    hitPosition = "bonus-" + randomSquare.id;
  } else {
    randomSquare.classList.add("mole");
    hitPosition = randomSquare.id;
  }
}

// Event listener for hitting the mole
squares.forEach((square) => {
  square.addEventListener("mousedown", () => {
    if (square.id === hitPosition) {
      result += square.classList.contains("bonus-mole") ? 5 : 1; // Bonus moles give extra points
      score.textContent = result;
      hitPosition = null;

      // Make the game harder by reducing the interval as score increases
      if (result % 10 === 0 && speed > 400) {
        clearInterval(timerId);
        speed -= 100;
        timerId = setInterval(randomSquare, speed);
      }
    }
  });
});

// Function to move moles at intervals
function moveMole() {
  timerId = setInterval(randomSquare, speed);
}

// Countdown timer
function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert("GAME OVER! Your final score is " + result);
  }
}

moveMole();
let countDownTimerId = setInterval(countDown, 1000);
