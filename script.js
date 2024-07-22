function Gameboard() {
    let board = []

    //board creation
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(0);
        }
    }

    const printBoard = () => {
        console.log(board);
    };

    const setValue = (row, column, player) => {
        if (row < 0 || row > 2 || column < 0 || column > 2) return -1;
        else if (board[row][column] !== 0) return board[row][column];

        board[row][column] = player.getActivePlayer().token;

    };

    const checkForWinner = (players) => {
        for (row of board) {
            if (row[0] != 0 && row.every(cell => cell === row[0])) {
                return row[0];
            }
        }

        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]
                && board[0][i] !== 0) {
                return board[0][0];
            }
        }

        if ((board[0][0] === board[1][1] && board[1][1] === board[2][2] || board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[1][1] !== 0) {
            return board[1][1];
        }

        return -1;
    }

    const restartBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }
    };

    return { printBoard, setValue, checkForWinner, restartBoard };
}

function Player() {

    const players = [
        { name: 'Player 1', token: 'X' },
        { name: 'Player 2', token: 'O' }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => { return activePlayer; };

    const setNames = (namePlayerOne, namePlayerTwo) => {
        players[0].name = namePlayerOne;
        players[1].name = namePlayerTwo;
    };

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { getActivePlayer, setNames, switchPlayer }
}

function GameController() {

    let board = Gameboard();
    let player = Player();
    let display = DisplayContent();

    board.printBoard();

    const playRound = (rowClicked, columnClicked) => {
        let settingValue = board.setValue(rowClicked, columnClicked, player);

        if (settingValue === 'X' || settingValue === 'O') {
            alert('Cell you chose already contains \'' + settingValue + '\'. Please choose a valid cell.');
        } else {
            board.printBoard();

            display.fillCell(rowClicked, columnClicked, player.getActivePlayer().token);

            let result = board.checkForWinner(player);
            if (result !== -1) {
                display.showEndDialog(player.getActivePlayer().name);
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

function DisplayContent() {

    const startDialog = document.querySelector(".start-dialog");
    const form = document.querySelector('.start-dialog form');
    const namePlayerOneInput = document.querySelector('#player-1');
    const namePlayerTwoInput = document.querySelector('#player-2');
    const start = document.querySelector('.start');

    const currentPlayersName = document.querySelector('.current-players-name');

    const endDialog = document.querySelector('.end-dialog');
    const endMessage = document.querySelector('.message');

    const fillCell = (row, column, value) => {
        document.querySelector(`.item-${row}-${column}`).textContent = value;
    };

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

    const setRestartButtonOnClickLister = (board) => {
        document.querySelector('.restart').addEventListener('click', () => {

            //resets JS board
            board.restartBoard(this);

            clearBoard();
        });
    };

    const setStartFormListeners = (player) => {

        start.addEventListener('click', () => {
            startDialog.showModal();
        });

        form.addEventListener('submit', () => {
            player.setNames(namePlayerOneInput.value, namePlayerTwoInput.value);
            updateCurrentPlayersName(namePlayerOneInput.value);
        });
    };

    const updateCurrentPlayersName = (name) => {
        currentPlayersName.textContent = `${name}\'s turn to play`;
    }

    const showEndDialog = (value) => {
        if (value === -1) {
            endMessage.textContent = 'It\'s a tie!';
        } else {
            endMessage.textContent = `Congratulations ${value}! You won this round!`;
            endDialog.showModal();
        }
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