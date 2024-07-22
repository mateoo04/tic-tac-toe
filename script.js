//manages board
function Gameboard() {
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
    const setValue = (row, column, player) => {
        if (row < 0 || row > 2 || column < 0 || column > 2) return -1;
        else if (board[row][column] !== 0) return board[row][column];

        board[row][column] = player.getActivePlayer().token;

    };

    //checks the board for a winning pattern
    const checkForWinner = (players) => {
        //variable storing if there is at least one empty cell
        let emptyCellAvailable = false;

        //checks by rows
        for (row of board) {

            if(row.some(cell => cell === 0)) emptyCellAvailable = true;

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

        if(!emptyCellAvailable){
            return 'its a tie';
        }

        return 'not over';
    }

    //clears all cells
    const restartBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }
    };

    return { printBoard, setValue, checkForWinner, restartBoard };
}

//manages game players
function Player() {

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
}

//controls game flow
function GameController() {

    let board = Gameboard();
    let player = Player();
    let display = DisplayContent();

    board.printBoard();

    //executed on click on the cell
    const playRound = (rowClicked, columnClicked) => {
        let settingValue = board.setValue(rowClicked, columnClicked, player);

        if (settingValue === 'X' || settingValue === 'O') {
            alert('Cell you chose already contains \'' + settingValue + '\'. Please choose a valid cell.');
        } else {
            board.printBoard();

            display.fillCell(rowClicked, columnClicked, player.getActivePlayer().token);

            let result = board.checkForWinner(player);
            if (result !== 'not over') {
                display.showEndDialog(result === true ? player.getActivePlayer().name : result);
                return 0;
            }

            player.switchPlayer();
            display.updateCurrentPlayersName(player.getActivePlayer().name);
        }
    };

    display.setBoardClickListeners(playRound);
    display.setRestartButtonOnClickLister(board);
    display.setStartFormListeners(player);
    display.setPlayAgainButtonListener(board);
}

//manages interface
function DisplayContent() {

    const startDialog = document.querySelector(".start-dialog");
    const form = document.querySelector('.start-dialog form');
    const namePlayerOneInput = document.querySelector('#player-1');
    const namePlayerTwoInput = document.querySelector('#player-2');
    const start = document.querySelector('.start');

    const currentPlayersName = document.querySelector('.current-players-name');

    const endDialog = document.querySelector('.end-dialog');
    const endMessage = document.querySelector('.message');
    const endMessageSpan = document.querySelector('.message span');

    //sets value into the item in DOM
    const fillCell = (row, column, value) => {
        document.querySelector(`.item-${row}-${column}`).textContent = value;
    };

    //sets cell click listeners
    const setBoardClickListeners = (playRound) => {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                document.querySelector(`.item-${i}-${j}`).addEventListener('click', () => {
                    playRound(i, j);
                });
            }
        }
    };

    //clears the board in interface
    const clearBoard = () => {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                fillCell(i, j, '');
            }
        }
    };

    //restart button click listener
    const setRestartButtonOnClickLister = (board) => {
        document.querySelector('.restart').addEventListener('click', () => {

            //resets JS board
            board.restartBoard(this);

            clearBoard();
        });
    };

    //sets start button and form for entering players' names click listeners
    const setStartFormListeners = (player) => {

        start.addEventListener('click', () => {
            startDialog.showModal();
        });

        form.addEventListener('submit', () => {
            player.setNames(namePlayerOneInput.value, namePlayerTwoInput.value);
            updateCurrentPlayersName(namePlayerOneInput.value);
        });
    };

    //updates text below the table which shows the active player
    const updateCurrentPlayersName = (name) => {
        currentPlayersName.textContent = `${name}\'s turn to play`;
    }

    //shows dialog at the end of the game
    const showEndDialog = (value) => {
        if (value === 'its a tie') {
            endMessage.textContent = 'It\'s a tie!';
        } else {
            endMessage.textContent = `Congratulations ${value}! You won this game!`;
        }
        endDialog.showModal();
    }

    const setPlayAgainButtonListener = (board) => {
        document.querySelector('.end-dialog button').addEventListener('click', () => {
            board.restartBoard();
            clearBoard();
            endDialog.close();
        });
    };

    return {
        fillCell, setBoardClickListeners, setRestartButtonOnClickLister,
        setStartFormListeners, updateCurrentPlayersName, showEndDialog, setPlayAgainButtonListener
    };
}

GameController();