import * as Game from './gameController.js';
import * as UI from './uiController.js';

function handleCellClick(e) {
  const cell = e.target.closest('.game__cell');
  if (!cell) return;

  const { row, col } = cell.dataset;
  const gameState = Game.playTurn(parseInt(row), parseInt(col));

  if (!gameState) {
    UI.showInvalidMove(cell);
    return;
  }

  UI.renderBoard(gameState.board);

  if (gameState.isGameOver) {
    if (gameState.winInfo) {
      UI.showWinner(gameState.winInfo);
    } else if (gameState.isTie) {
      UI.showTie();
    }
  } else {
    UI.updateStatus(`It's ${gameState.currentPlayer.name}'s turn`);
  }
}

function restartGame() {
  Game.start();
  UI.renderBoard(Game.getBoard());
  UI.updateStatus(`It's ${Game.getCurrentPlayer().name}'s turn`);
  UI.hideWinningLine();

  if (UI.endDialog.open) {
    UI.endDialog.close();
  }
}

function init() {
  UI.boardElement.addEventListener('click', handleCellClick);
  document
    .querySelector('.game__button')
    .addEventListener('click', restartGame);
  document
    .querySelector('.dialog__button')
    .addEventListener('click', restartGame);

  restartGame();
}

init();
