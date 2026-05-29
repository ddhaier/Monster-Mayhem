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

    gameMessage.textContent = "The 10x10 hexagon board has been created.";
    placeMonster();
}

function showTemporaryMessage(message) {
    const currentMonsterHex = getHexagon(monsterPosition.row, monsterPosition.column);
    if (!currentMonsterHex) return;

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
        gameMessage.textContent = "The monster is already on this hexagon.";
        return;
    }

    if (!isNearbyHexagon(row, column)) {
        showTemporaryMessage("Move one step");
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
    gameMessage.textContent = "Monster moved one step to hexagon: " + (row + 1) + ", " + (column + 1);
    playJumpSound();

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
            monster.textContent = "👾";
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

function playJumpSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Square wave gives the classic 8-bit videogame tone
    oscillator.type = "square";

    const now = audioCtx.currentTime;
    // Start low and ramp up quickly to create the Mario-style boing
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.12);

    // Start at moderate volume and fade out sharply
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
}

function playErrorSound() {
    // Mario death jingle - sequence of notes matching the classic tune
    const notes = [
        { freq: 494, time: 0.00, duration: 0.10 },
        { freq: 392, time: 0.14, duration: 0.10 },
        { freq: 196, time: 0.28, duration: 0.12 },
        { freq: 220, time: 0.44, duration: 0.12 },
        { freq: 247, time: 0.60, duration: 0.12 },
        { freq: 196, time: 0.80, duration: 0.20 },
        { freq: 147, time: 1.10, duration: 0.40 }
    ];

    notes.forEach(function(note) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Square wave for the classic NES/8-bit sound
        oscillator.type = "square";

        const now = audioCtx.currentTime + note.time;
        oscillator.frequency.setValueAtTime(note.freq, now);

        // Short attack, hold, then cut off cleanly
        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
        gainNode.gain.setValueAtTime(0.25, now + note.duration - 0.01);
        gainNode.gain.linearRampToValueAtTime(0.0, now + note.duration);

        oscillator.start(now);
        oscillator.stop(now + note.duration);
    });
}
// --- END AUDIO ---