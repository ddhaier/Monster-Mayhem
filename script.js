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

    if (selectedHex === hex) {
        hex.classList.remove("selected");
        selectedHex = null;
        selectedHexText.textContent = "None";
        gameMessage.textContent = "Hexagon deselected.";
        return;
    }

    if (selectedHex !== null) {
        selectedHex.classList.remove("selected");
    }

    selectedHex = hex;
    selectedHex.classList.add("selected");
    selectedHexText.textContent = (row + 1) + ", " + (column + 1);
    gameMessage.textContent = "Selected hexagon: " + (row + 1) + ", " + (column + 1);
    moveMonster(row, column);
    }

    function moveMonster(row, column) {
    monsterPosition.row = row;
    monsterPosition.column = column;

    placeMonster();
    }

    function resetGame() {
        if (selectedHex !== null) {
        selectedHex.classList.remove("selected");
        }

        selectedHex = null;
        selectedHexText.textContent = "None";

        monsterPosition.row = 0;
        monsterPosition.column = 0;
        placeMonster();
        
        gameMessage.textContent = "Game reset. Select a hexagon to begin.";
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

resetButton.addEventListener("click", resetGame);

//Start the game board
createBoard();

