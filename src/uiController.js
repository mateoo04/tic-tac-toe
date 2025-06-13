const boardElement = document.querySelector('.game__board');
const statusElement = document.querySelector('.game__status');
const winningLineElement = document.querySelector('.game__winning-line');
const endDialog = document.querySelector('.dialog');
const endDialogMessage = document.querySelector('.dialog__message');

function renderBoard(board) {
  boardElement.querySelectorAll('.game__cell').forEach((cell) => {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const token = board[row][col];
    cell.textContent = token;

    cell.classList.remove(
      'game__cell--filled',
      'game__cell--x',
      'game__cell--o'
    );
    if (token) {
      cell.classList.add(
        'game__cell--filled',
        `game__cell--${token.toLowerCase()}`
      );
    }
  });
}

function updateStatus(message) {
  statusElement.textContent = message;
}

function showWinner(winInfo) {
  updateStatus(`${winInfo.winner.name} wins!`);
  drawWinningLine(winInfo.lineClass);
  setTimeout(() => {
    endDialogMessage.textContent = `${winInfo.winner.name} is the winner!`;
    endDialog.showModal();
  }, 1000);
}

function showTie() {
  updateStatus("It's a draw!");
  setTimeout(() => {
    endDialogMessage.textContent = "It's a tie!";
    endDialog.showModal();
  }, 500);
}

function drawWinningLine(lineClass) {
  winningLineElement.className = 'game__winning-line';
  winningLineElement.classList.add(lineClass, 'game__winning-line--visible');
}

function hideWinningLine() {
  winningLineElement.className = 'game__winning-line';
}

function showInvalidMove(cell) {
  cell.classList.add('game__cell--invalid');
  setTimeout(() => cell.classList.remove('game__cell--invalid'), 400);
}

export {
  renderBoard,
  updateStatus,
  showWinner,
  showTie,
  hideWinningLine,
  showInvalidMove,
  boardElement,
  endDialog,
};
