//manages board
const Gameboard = (() => {
    //board creation
    let board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(0);
        }
    }

    //prints board to the console
    const printBoard = () => {
        console.log(board);
    };

    //sets value of the cell
    const setValue = (row, column) => {
        if (row < 0 || row > 2 || column < 0 || column > 2) return -1;
        else if (board[row][column] !== 0) return board[row][column];

        board[row][column] = Player.getActivePlayer().token;

    };

    //checks the board for a winning pattern
    const checkForWinner = () => {
        //variable storing if there is at least one empty cell
        let emptyCellAvailable = false;

        //checks by rows
        for (row of board) {

            if (row.some(cell => cell === 0)) emptyCellAvailable = true;

            if (row[0] != 0 && row.every(cell => cell === row[0])) {
                return true;
            }
        }

        //checks by columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]
                && board[0][i] !== 0) {
                return true;
            }
        }

        //checks diagonally
        if ((board[0][0] === board[1][1] && board[1][1] === board[2][2] || board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[1][1] !== 0) {
            return true;
        }

        if (!emptyCellAvailable) {
            return 'its a tie';
        }

        return 'not over';
    }

    //clears all cells
    const restartBoard = () => {
        board = board.map((row) => row.map(() => 0));
    };

    return { printBoard, setValue, checkForWinner, restartBoard };
})();

//manages game players
const Player = (() => {

    const players = [
        { name: 'Player 1', token: 'X' },
        { name: 'Player 2', token: 'O' }
    ];

    let activePlayer = players[0];

    //returns currently active player whose turn it is
    const getActivePlayer = () => { return activePlayer; };

    //sets names of the players
    const setNames = (namePlayerOne, namePlayerTwo) => {
        players[0].name = namePlayerOne;
        players[1].name = namePlayerTwo;
    };

    //sets a different player to be the active one
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { getActivePlayer, setNames, switchPlayer }
})();

//manages interface
const ScreenController = (() => {

    const startDialog = (() => {
        const dialog = document.querySelector(".start-dialog");
        const form = document.querySelector('.start-dialog form');
        const namePlayerOneInput = document.querySelector('#player-1');
        const namePlayerTwoInput = document.querySelector('#player-2');
        const button = document.querySelector('.start');
        return { dialog, form, namePlayerOneInput, namePlayerTwoInput, button }
    })();

    const currentPlayersName = document.querySelector('.current-players-name');

    const endDialog = (() => {
        const dialog = document.querySelector('.end-dialog');
        const message = document.querySelector('.message');
        return { dialog, message }
    })();

    //sets value into the item in DOM
    const fillCell = (row, column, value) => {
        document.querySelector(`.item-${row}-${column}`).textContent = value;
    };

    //sets cell click listeners
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            document.querySelector(`.item-${i}-${j}`).addEventListener('click', () => {
                GameController.playRound(i, j);
            });
        }
    };

    //clears the board in interface
    const clearBoard = () => {
        document.querySelectorAll('.item').forEach((item)=>{
            item.textContent = '';
        })
    };

    //restart button click listener
    document.querySelector('.restart').addEventListener('click', () => {
        //resets JS board
        Gameboard.restartBoard();
        //clears the board visually
        clearBoard();
    });

    startDialog.button.addEventListener('click', () => {
        startDialog.dialog.showModal();
    });

    startDialog.form.addEventListener('submit', () => {
        Player.setNames(startDialog.namePlayerOneInput.value, startDialog.namePlayerTwoInput.value);
        updateCurrentPlayersName(startDialog.namePlayerOneInput.value);

        //resets JS board
        Gameboard.restartBoard();
        //clears the board visually
        clearBoard();
    });

    //updates text below the table which shows the active player
    const updateCurrentPlayersName = (name) => {
        currentPlayersName.textContent = `${name}\'s turn to play`;
    }

    //shows dialog at the end of the game
    const showEndDialog = (value) => {
        if (value === 'its a tie') {
            endDialog.message.textContent = 'It\'s a tie!';
        } else {
            endDialog.message.textContent = `Congratulations ${value}! You won this game!`;
        }
        endDialog.dialog.showModal();
    }

    //sets click listener on a button in the dialog that pops up at the end of the game
    document.querySelector('.end-dialog button').addEventListener('click', () => {
        Gameboard.restartBoard();
        clearBoard();
        endDialog.dialog.close();
    });

    return { fillCell, updateCurrentPlayersName, showEndDialog };
})();

//controls game flow
const GameController = (() => {

    Gameboard.printBoard();

    //executed on click on the cell
    const playRound = (rowClicked, columnClicked) => {
        let settingValue = Gameboard.setValue(rowClicked, columnClicked);

        if (settingValue === 'X' || settingValue === 'O') {
            alert('Cell you chose already contains \'' + settingValue + '\'. Please choose a valid cell.');
        } else {
            Gameboard.printBoard();

            ScreenController.fillCell(rowClicked, columnClicked, Player.getActivePlayer().token);

            let result = Gameboard.checkForWinner();
            if (result !== 'not over') {
                ScreenController.showEndDialog(result === true ? Player.getActivePlayer().name : result);
                return 0;
            }

            Player.switchPlayer();
            ScreenController.updateCurrentPlayersName(Player.getActivePlayer().name);
        }
    };

    return { playRound };
})();