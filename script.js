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

    return { printBoard, setValue }
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

        player.switchPlayer();
        playRound();
         
    };

    playRound();

}

GameController();