//Get elements from the HTML
const board = document.getElementById("board");
const gameMessage = document.getElementById("gameMessage");
const resetButton = document.getElementById("resetButton");
const monsterPositionText = document.getElementById("monsterPosition");

// Board size
const rows = 10;
const columns = 10;

let selectedHex = null;
let messageTimeout;

const selectedHexText = document.getElementById("selectedHex");

let monsterPosition = {
    row: 0,
    column: 0
};

//This function creates the full board
function createBoard() {
    for (let row = 0; row < rows; row++) {
        const rowElement = document.createElement("div");
        rowElement.classList.add("hex-row");

        for (let column = 0; column < columns; column++) {
            const hex = document.createElement("div");
            hex.classList.add("hex");

            hex.dataset.row = row;
            hex.dataset.column = column;

            hex.addEventListener("click", function () {
                selectHexagon(hex);
            });

            rowElement.appendChild(hex);
        }

        board.appendChild(rowElement);

    }
    placeMonster();
}

function showTemporaryMessage(message) {
    const currentMonsterHex = getHexagon(monsterPosition.row, monsterPosition.column);
    if (!currentMonsterHex) 
    return;

    const oldCloudMessage = document.querySelector(".cloud-message");
    if (oldCloudMessage !== null) {
        oldCloudMessage.remove();
    }

    const cloudMessage = document.createElement("div");
    cloudMessage.classList.add("cloud-message");
    cloudMessage.textContent = message;

    const rect = currentMonsterHex.getBoundingClientRect();
    cloudMessage.style.left = (rect.left + rect.width / 2) + "px";
    cloudMessage.style.top = (rect.top - 10) + "px";

    document.body.appendChild(cloudMessage);

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(function() {
        cloudMessage.remove();
    }, 2000);
}

function selectHexagon(hex) {
    const row = Number(hex.dataset.row);
    const column = Number(hex.dataset.column);

    if (row === monsterPosition.row && column === monsterPosition.column) {
        gameMessage.textContent = "The Ghost is already on this hexagon.";
        return;
    }

    if (!isNearbyHexagon(row, column)) {
        showTemporaryMessage("Too far! The ghost can only move one hexagon at a time.");
        playErrorSound();
        return;
}

    
    if (selectedHex !== null) {
        selectedHex.classList.remove("selected");
    }

    const previousMonsterHex = getHexagon(monsterPosition.row, monsterPosition.column);

    selectedHex = hex;
    selectedHex.classList.add("selected");
    selectedHexText.textContent = (row + 1) + ", " + (column + 1);
    gameMessage.textContent = `Ghost moved to hexagon ${row + 1}, ${column + 1}!`;
    playGhostMoveSound()

    moveMonster(row, column, previousMonsterHex);
}

    function isNearbyHexagon(row, column) {
    const rowDifference = Math.abs(row - monsterPosition.row);
    const columnDifference = Math.abs(column - monsterPosition.column);

    return rowDifference <= 1 && columnDifference <= 1;
}

    function getHexagon(row, column) {
        return document.querySelector(
        '.hex[data-row="' + row + '"][data-column="' + column + '"]'
    );
}

    function moveMonster(row, column, previousMonsterHex) {
    monsterPosition.row = row;
    monsterPosition.column = column;

        if (previousMonsterHex !== null) {
        previousMonsterHex.classList.remove("trail");
        void previousMonsterHex.offsetWidth;
        previousMonsterHex.classList.add("trail");
    }
     
    placeMonster();
}

    function placeMonster() {
    const allHexagons = document.querySelectorAll(".hex");

    allHexagons.forEach(function (hex) {
        hex.innerHTML = "";

        const row = Number(hex.dataset.row);
        const column = Number(hex.dataset.column);

        if (row === monsterPosition.row && column === monsterPosition.column) {
            const monster = document.createElement("span");
            monster.classList.add("monster");
            monster.textContent = "👻";
            hex.appendChild(monster);
        }
    });

    monsterPositionText.textContent = (monsterPosition.row + 1) + ", " + (monsterPosition.column + 1);
}

    function resetGame() {
    if (selectedHex !== null) {
        selectedHex.classList.remove("selected");
    }

    document.querySelectorAll(".hex").forEach(function(hex) {
        hex.classList.remove("trail");
    });

    selectedHex = null;
    monsterPosition.row = 0;
    monsterPosition.column = 0;

    selectedHexText.textContent = "None";
    monsterPositionText.textContent = "1, 1";
    gameMessage.textContent = "Select a hexagon to begin.";

    placeMonster();
}

resetButton.addEventListener("click", resetGame);

//Start the game board
createBoard();

// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playGhostMoveSound() {
    // Creates a short ghost sound when the player makes a valid move
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Connects the sound generator to the volume control and then to the speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Uses a sine wave to make the sound softer and more ghost-like
    oscillator.type = "sine";

    const now = audioCtx.currentTime;

    // Changes the pitch during the sound to create a "woo" effect
    oscillator.frequency.setValueAtTime(380, now);
    oscillator.frequency.exponentialRampToValueAtTime(520, now + 0.18);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.40);

    // Controls the volume so the sound fades in and fades out smoothly
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.16, now + 0.04);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.28);
    gainNode.gain.linearRampToValueAtTime(0.0, now + 0.45);

    // Starts and stops the sound
    oscillator.start(now);
    oscillator.stop(now + 0.45);
}

function playErrorSound() {
    // Creates a longer ghost sound when the player tries to move too far
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Connects the sound generator to the volume control and then to the speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Uses a sine wave to keep the sound smooth and ghost-like
    oscillator.type = "sine";

    const now = audioCtx.currentTime;

    // Drops the pitch to create the feeling of the ghost flying away
    oscillator.frequency.setValueAtTime(650, now);
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.20);
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.65);
    oscillator.frequency.exponentialRampToValueAtTime(90, now + 1.00);

    // Controls the volume so the sound starts softly and fades out
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.45);
    gainNode.gain.linearRampToValueAtTime(0.0, now + 1.05);

    // Starts and stops the sound
    oscillator.start(now);
    oscillator.stop(now + 1.05);
}
