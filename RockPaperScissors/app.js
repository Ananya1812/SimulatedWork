const computerChoiceDisplay = document.getElementById("computer-choice");
const userChoiceDisplay = document.getElementById("user-choice");
const resultDisplay = document.getElementById("result");
const possibleChoices = document.querySelectorAll("button");
const winsDisplay = document.getElementById("wins");
const lossesDisplay = document.getElementById("losses");
const drawsDisplay = document.getElementById("draws");

let userChoice;
let computerChoice;
let result;
let wins = 0;
let losses = 0;
let draws = 0;

const winSound = new Audio("win.mp3");
const loseSound = new Audio("lose.mp3");
const drawSound = new Audio("draw.mp3");

possibleChoices.forEach((possibleChoice) =>
  possibleChoice.addEventListener("click", (e) => {
    userChoice = e.target.id;
    userChoiceDisplay.innerHTML = userChoice;
    animateChoice(e.target); // Add animation
    generateComputerChoice();
    getResult();
  })
);

function generateComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3);

  if (randomNumber === 0) {
    computerChoice = "rock";
  } else if (randomNumber === 1) {
    computerChoice = "scissors";
  } else if (randomNumber === 2) {
    computerChoice = "paper";
  }
  computerChoiceDisplay.innerHTML = computerChoice;
}

function getResult() {
  if (computerChoice === userChoice) {
    result = `It's a draw! You both chose ${userChoice}.`;
    drawSound.play();
    draws++;
    drawsDisplay.innerHTML = draws;
  } else if (
    (computerChoice === "rock" && userChoice === "paper") ||
    (computerChoice === "scissors" && userChoice === "rock") ||
    (computerChoice === "paper" && userChoice === "scissors")
  ) {
    result = `You win! ${userChoice} beats ${computerChoice}.`;
    winSound.play();
    wins++;
    winsDisplay.innerHTML = wins;
  } else {
    result = `You lose! ${computerChoice} beats ${userChoice}.`;
    loseSound.play();
    losses++;
    lossesDisplay.innerHTML = losses;
  }
  resultDisplay.innerHTML = result;
}

function animateChoice(button) {
  button.style.transform = "scale(1.3)";
  setTimeout(() => {
    button.style.transform = "scale(1)";
  }, 200);
}
