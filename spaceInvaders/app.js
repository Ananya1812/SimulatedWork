const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

let bossIndex = null // Boss will be null initially
let bossDirection = 1 // Movement direction of the boss (1 for right, -1 for left)
let bossMovementInterval = null // To store the boss movement interval

function draw() {
    // Draw regular invaders
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }

    // Draw boss if exists
    if (bossIndex !== null) {
        squares[bossIndex].classList.add("boss")
    }
}

draw()

squares[currentShooterIndex].classList.add("shooter")

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
    if (bossIndex !== null) {
        squares[bossIndex].classList.remove("boss")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")

    switch (e.key) {
        case "ArrowLeft":
            // Prevent moving off the left edge
            if (currentShooterIndex % width !== 0) {
                currentShooterIndex -= 1
            }
            break
        case "ArrowRight":
            // Prevent moving off the right edge
            if (currentShooterIndex % width < width - 1) {
                currentShooterIndex += 1
            }
            break
    }

    // Re-add the shooter at the new position
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
        clearInterval(bossMovementInterval)
    }

    if (aliensRemoved.length === alienInvaders.length) {
        // Spawn Boss when all regular invaders are removed
        if (bossIndex === null) {
            bossIndex = 50 // Set boss position (can change to any index)
            draw()
            startBossMovement() // Start boss movement when it appears
        } else {
            resultDisplay.innerHTML = "YOU WIN"
            clearInterval(invadersId)
            clearInterval(bossMovementInterval)
        }
    }
}

invadersId = setInterval(moveInvaders, 600)

function startBossMovement() {
    // Set up an interval for the boss to move left and right
    bossMovementInterval = setInterval(() => {
        if (bossIndex !== null) {
            // Move boss based on its direction
            squares[bossIndex].classList.remove("boss") // Remove current boss position
            bossIndex += bossDirection

            // Check if boss hits the left or right edge
            if (bossIndex % width === 0 || bossIndex % width === width - 1) {
                bossDirection *= -1 // Change direction when the boss hits the edge
            }

            squares[bossIndex].classList.add("boss") // Add boss to the new position
        }
    }, 600) // Set interval for boss movement (every 600ms)
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }

        // Check if laser hits boss
        if (currentLaserIndex === bossIndex) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("boss")
            squares[currentLaserIndex].classList.add("boom")
            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            bossIndex = null // Boss defeated
            results += 10
            resultDisplay.innerHTML = results
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)
