import createGameboard from './Gameboard.js';
import createPlayer from './Player.js';
import createShip from './Ship.js';

import {
  refreshBoardArea,
  setupAttackPhaseDom,
  generateEndGameDialog,
  updateMessage,
} from './dom-manipulation.js';
import { delay, getRandomInt, getRandomBoolean } from './utility.js';

// Using factory function in module as an IIFE equivalent
// declaring a single instance of the createGame factory and exporting it

const createGame = function () {
  /*
  Setup as an IIFE
  The game consists of:
  - some game constants
  - 2 players - player and computer
  */

  const boardSize = 8;
  const numberOfShips = 5;
  const shipLengthArray = [5, 4, 3, 3, 2];
  const turnDelayInMs = 1500;

  const human = createPlayer('player-1', false);
  const computer = createPlayer('computer', true);

  human.assignOpponent(computer);
  computer.assignOpponent(human);

  const getRealPlayer = () => human;
  const getComputer = () => computer;
  const getBoardSize = () => boardSize;
  const getNumberOfShips = () => numberOfShips;
  const getShipLengthArray = () => shipLengthArray;

  function generateCompShipPositions() {
    const compBoard = computer.getBoard();
    do {
      // randomize computer ship location and direction

      const ship = createShip(shipLengthArray[compBoard.getShipCount()]);
      compBoard.positionShip(
        ship,
        getRandomInt(0, boardSize - 1),
        getRandomInt(0, boardSize - 1),
        getRandomBoolean()
      );
    } while (compBoard.getShipCount() < numberOfShips);
  }

  const startGame = () => {
    let playerBoard = createGameboard(boardSize);
    human.assignBoard(playerBoard);
    const compBoard = createGameboard(boardSize);
    computer.assignBoard(compBoard);
  };

  // ship added to board, initiated by being dragged into player board
  const addShipToBoard = (startX, startY, length, isHoriz) => {
    const playerBoard = human.getBoard();
    playerBoard.positionShip(createShip(length), startX, startY, isHoriz);
    refreshBoardArea(human, false);

    if (playerBoard.getShipCount() >= numberOfShips) {
      generateCompShipPositions();
      setupAttackPhaseDom();
    }
  };

  // process attack by player at location x, y
  function processAttack(player, x, y) {
    const targetBoard = player.getOpponent().getBoard();

    const attackResult = targetBoard.receiveAttack(x, y);

    if (attackResult.ship) {
      attackResult.sunk
        ? updateMessage(
            `${player.isComp() ? 'The computer has' : 'You have'} sunk a ship!`
          )
        : updateMessage(
            `${player.isComp() ? 'The computer hit!' : "That's a hit!"}`
          );
    } else {
      updateMessage(
        `${player.isComp() ? 'The computer missed!' : "That's a miss!"}`
      );
    }
  }

  // note, designed into the game mechanics that this will succeed, but not ideal
  const genCompAttackCoords = () => {
    const playerBoard = human.getBoard();
    let validAttack = false;
    do {
      const x = getRandomInt(0, boardSize - 1);
      const y = getRandomInt(0, boardSize - 1);
      if (!playerBoard.getAttackedAtLoc(x, y)) return { x, y };
    } while (!validAttack);
  };

  // full round of game, initiated by attack on computer board
  const attackRound = async (x, y) => {
    const compBoard = computer.getBoard();
    const playerBoard = human.getBoard();

    if (compBoard.getAttackedAtLoc(x, y)) {
      updateMessage('You already attacked that location.');
    } else {
      // process player attack
      processAttack(human, x, y);
      refreshBoardArea(computer, false);

      if (compBoard.allSunk()) {
        endGame(true);
      } else {
        // computer turn
        await delay(turnDelayInMs);
        const coords = genCompAttackCoords();
        processAttack(computer, coords.x, coords.y);
        refreshBoardArea(human, false);

        if (playerBoard.allSunk()) endGame(false);

        // enable attacks on computer board
        refreshBoardArea(computer, true);
      }
    }
  };

  const endGame = (isWin) => {
    let endGameMessage;
    isWin
      ? (endGameMessage = 'Congratulations captain, you won!')
      : (endGameMessage = 'Commiserations captain, you lost!');
    generateEndGameDialog(endGameMessage);
  };

  return {
    startGame,
    addShipToBoard,
    attackRound,
    getRealPlayer,
    getComputer,
    getBoardSize,
    getNumberOfShips,
    getShipLengthArray,
  };
};

const activeGame = createGame();

export { activeGame as default };
