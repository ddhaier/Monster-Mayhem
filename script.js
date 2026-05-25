//Get elements from the HTML
const board = document.getElementById("board");
const gameMessage = document.getElementById("gameMessage");

// Board size
const rows = 10;
const columns = 10;

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

            rowElement.appendChild(hex);
        }

        board.appendChild(rowElement);

    }

    gameMessage.textContent = "The 10x10 hexagon board has been created.";

}

//Start the game board
createBoard();
