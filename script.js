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

    return { printBoard, setValue, checkForWinner }
}

function Player() {

    const players = [
        { name: 'Player 1', token: 'X' },
        { name: 'Player 2', token: 'O' }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => { return activePlayer; };

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { getActivePlayer, switchPlayer }
}

function GameController() {

    let board = Gameboard();
    let player = Player();
    let display = DisplayContent();

    board.printBoard();

    // const playRoundPrompt = () => {
    //     let rowOfMove = prompt(`${player.getActivePlayer().name}, please type in the row in which you want to make your move:`);
    //     let colOfMove = prompt(`${player.getActivePlayer().name}, please type in the column in which you want to make your move:`);

    //     let settingValue = board.setValue(rowOfMove, colOfMove, player);

    //     if (settingValue === 'X' || settingValue === 'O') {
    //         alert('Cell you chose already contains \'' + settingValue + '\'. Please choose a valid cell.');
    //     } else if (settingValue === -1) {
    //         alert('Please enter a valid cell.');
    //     } else {
    //         board.printBoard();

    //         display.fillCell(rowOfMove, colOfMove, player);

    //         let result = board.checkForWinner(player);
    //         if (result !== -1) {
    //             alert(`Congratulations ${player.getActivePlayer().name}! You won!`);
    //             return 0;
    //         }

    //         player.switchPlayer();
    //     }

    //     playRoundPrompt();

    // };

    // playRoundPrompt();

    const playRound = (rowClicked, columnClicked) => {
        let settingValue = board.setValue(rowClicked, columnClicked, player);

        if (settingValue === 'X' || settingValue === 'O') {
            alert('Cell you chose already contains \'' + settingValue + '\'. Please choose a valid cell.');
        } else {
            board.printBoard();

            display.fillCell(rowClicked, columnClicked, player);

            let result = board.checkForWinner(player);
            if (result !== -1) {
                alert(`Congratulations ${player.getActivePlayer().name}! You won!`);
                return 0;
            }

            player.switchPlayer();
        }
    };

    display.setBoardClickListeners(playRound);
}

function DisplayContent() {
    const fillCell = (row, column, player) => {
        document.querySelector(`.item-${row}-${column}`).textContent = player.getActivePlayer().token;
    };

    const setBoardClickListeners = (playRound) => {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                document.querySelector(`.item-${i}-${j}`).addEventListener('click', () => {
                    playRound(i,j);
                });
            }
        }
    };

    return { fillCell, setBoardClickListeners };
}

GameController();