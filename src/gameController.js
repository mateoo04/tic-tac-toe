const players = [
  { name: 'Player X', token: 'X' },
  { name: 'Player O', token: 'O' },
];

const winningCombos = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

let board;
let currentPlayer;
let isGameOver;

function start() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  currentPlayer = players[0];
  isGameOver = false;
}

function playTurn(row, col) {
  if (isGameOver || board[row][col] !== '') {
    return null;
  }
  board[row][col] = currentPlayer.token;

  const winInfo = checkForWinner();
  const isTie = !winInfo && board.flat().every((cell) => cell !== '');

  if (winInfo || isTie) {
    isGameOver = true;
  } else {
    switchPlayer();
  }

  return {
    board,
    currentPlayer: getCurrentPlayer(),
    isGameOver,
    winInfo,
    isTie,
  };
}

function switchPlayer() {
  currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
}

function checkForWinner() {
  for (let i = 0; i < winningCombos.length; i++) {
    const combo = winningCombos[i];
    const [a, b, c] = combo;

    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      let lineClass = '';
      if (i < 3) lineClass = `win-row-${i}`; // 3 vertical combinations
      else if (i < 6)
        lineClass = `win-col-${i - 3}`; // 3 horizontal combinations
      else lineClass = `win-diag-${i - 6}`; // 2 diagonal combinations

      return { winner: currentPlayer, lineClass };
    }
  }
  return null;
}

const getCurrentPlayer = () => currentPlayer;
const getBoard = () => board;

export { start, playTurn, getCurrentPlayer, getBoard };
