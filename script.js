//Get elements from the HTML
const board = document.getElementById("board");
const gameMessage = document.getElementById("gameMessage");
const resetButton = document.getElementById("resetButton");

// Board size
const rows = 10;
const columns = 10;

let selectedHex = null;
const selectedHexText = document.getElementById("selectedHex");

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
    selectedHexText.textContent = row + ", " + column;
    gameMessage.textContent = "Selected hexagon: " + row + ", " + column;
    }

    function resetGame() {
        if (selectedHex !== null) {
        selectedHex.classList.remove("selected");
        }

    selectedHex = null;
    selectedHexText.textContent = "None";
    gameMessage.textContent = "Game reset. Select a hexagon to begin.";
    }

resetButton.addEventListener("click", resetGame);

//Start the game board
createBoard();
