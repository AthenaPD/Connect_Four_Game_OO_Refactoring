const startGame = document.querySelector("#start");

startGame.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const board = document.getElementById("board");
    board.innerHTML = "";
    const player1Cl = evt.target[0].value ? evt.target[0].value : 'red';
    const player2Cl = evt.target[1].value ? evt.target[1].value : 'blue';
    new Game(6,7, player1Cl, player2Cl);
});

class Player {
    constructor(color) {
        this.color = color;
    }
};

class Game {
    constructor(height, width, player1Color, player2Color) {
        this.width = width;
        this.height = height;
        this.player1 = new Player(player1Color);
        this.player2 = new Player(player2Color);
        this.currPlayer = this.player1;
        this.handleClickFunc = this.handleClick.bind(this);
        this.boardArr = this.makeBoard();
        this.htmlBoard = this.makeHtmlBoard();
    }

    makeBoard() {
        const emptyBoard = [];
        for (let y = 0; y < this.height; y++) {
            emptyBoard.push(Array.from({length : this.width}));
        }
        return emptyBoard;
    }

    makeHtmlBoard() {
        const board = document.getElementById("board");

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement("tr");
        top.setAttribute("id", 'column-top');;
        top.addEventListener("click", this.handleClickFunc);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement("td");
            headCell.setAttribute("id", x);
            top.append(headCell);
        }

        board.append(top);

        // make main part of board
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement("tr");

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement("td");
                cell.setAttribute("id", `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.boardArr[y][x]) {
                return y;
            }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        // piece.classList.add(`p${this.currPlayer}`);
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: announce game end */
    endGame(msg) {
        alert(msg);
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleClickFunc);
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
          

                // find winner (only checking each win-possibility as needed)
                if (this.win(horiz) || this.win(vert) || this.win(diagDR) || this.win(diagDL)) {
                    return true;
                }
            }
        }
    }

    win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < this.height &&
                x >= 0 &&
                x < this.width &&
                this.boardArr[y][x] === this.currPlayer
        );
    }

    /** handleClick: handle click of column top to play piece */
    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, i.e. column is full, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.boardArr[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        // check for tie
        if (this.boardArr.every(row => row.every(cell => cell))) {
            return endGame("Tie!");
        }

        // switch players
        this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
    }
};
