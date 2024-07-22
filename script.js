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
        if (board[row][column] !== 0) return -1;

        board[row][column] = player.getActivePlayer().token;
    };

    const checkForWinner = (players) => {
        for (row of board) {
            if (row[0] != 0 && row.every(cell => cell === row[0])) {
                return row[0];
            }
        }

        for (let i = 0; i < 3; i++) {
            if (board[0][0] === board[0][1] && board[0][1] === board[0][2] && board[0][0] !== 0) {
                return board[0][0];
            }
        }

        if(board[0][0] === board[1][1] && board[1][1] === board[2][2] || board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[1][1] !== 0){
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

    board.printBoard();

    const playRound = () => {
        let rowOfMove = prompt(`${player.getActivePlayer().name}, please type in the row in which you want to make your move:`);
        let colOfMove = prompt(`${player.getActivePlayer().name}, please type in the column in which you want to make your move:`);

        board.setValue(rowOfMove, colOfMove, player);
        board.printBoard();
        let result = board.checkForWinner(player);
        if (result !== -1) {
            alert(`Congratulations ${player.getActivePlayer().name}! You won!`);
            return 0;
        }

        player.switchPlayer();
        playRound();

    };

    playRound();

}

GameController();