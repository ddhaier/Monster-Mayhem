//Get elements from the HTML
const board = document.getElementById("board");
const gameMessage = document.getElementById("gameMessage");
const resetButton = document.getElementById("resetButton");
const monsterPositionText = document.getElementById("monsterPosition");

// Board size
const rows = 10;
const columns = 10;

let selectedHex = null;
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

function selectHexagon(hex) {
    const row = Number(hex.dataset.row);
    const column = Number(hex.dataset.column);

    if (row === monsterPosition.row && column === monsterPosition.column) {
        gameMessage.textContent = "The monster is already on this hexagon.";
        return;
    }

    if (!isNearbyHexagon(row, column)) {
        gameMessage.textContent = "The monster can only move to a nearby hexagon.";
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

