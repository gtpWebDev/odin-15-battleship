import './styles.css';
import {
  hideDomElement,
  updateMessage,
  generateBoardArea,
  generateShipBoard,
} from './dom-manipulation.js';
// import { generateShipBoard } from './dom-ship-selector.js';
import createGameboard from './Gameboard.js';
import createShip from './Ship.js';
import createPlayer from './Player.js';

/* To do:
  - finish off media queries to vertically center but only when not mobile width
  - boardSize set in startGame and flowing down many functions feels bad, review for better approach
  - generateDraggableShip and rotateShip not programmed well, improve
  - show whether ship is droppable during drag - drag dataTransfer doesn't allow for this, would need a more global variable
*/

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomBoolean = () => {
  return Math.random() < 0.5 ? true : false;
};

// start game button
const createGame = () => {
  const boardSize = 8;
  const numberOfShips = 5;
  const shipLengthArray = [5, 4, 3, 3, 2];

  let enableAttacks = false;

  const player1 = createPlayer('player-1', false);
  const player1Board = createGameboard(boardSize);
  player1.assignBoard(player1Board);

  const player2 = createPlayer('computer', true);
  const player2Board = createGameboard(boardSize);
  player2.assignBoard(player2Board);

  // initial DOM setup with player board and ship selection
  generateBoardArea(player1, player1Board, enableAttacks);
  hideDomElement('#computer-gameboard');
  generateShipBoard(boardSize);
  updateMessage('Place your ships captain!');

  const newGameButton = document.querySelector('#new-game-button');
  newGameButton.textContent = 'Reset game';

  const generateCompShipPositions = () => {
    do {
      // randomize computer ship location and direction
      const ship = createShip(shipLengthArray[player2Board.getShipCount()]);
      player2Board.positionShip(
        ship,
        getRandomInt(0, boardSize - 1),
        getRandomInt(0, boardSize - 1),
        getRandomBoolean()
      );
    } while (player2Board.getShipCount() < numberOfShips);
  };

  const generateCompAttack = () => {
    let validAttack = false;
    let x;
    let y;
    do {
      x = getRandomInt(0, boardSize - 1);
      y = getRandomInt(0, boardSize - 1);
      if (!player1Board.getAttackedAtLoc(x, y)) validAttack = true;
    } while (!validAttack);
    return { x, y };
  };

  // on a ship being dropped successfully onto the board
  const addShipToBoard = (playerBoard, startX, startY, length, isHoriz) => {
    console.log('isHoriz', isHoriz);
    playerBoard.positionShip(createShip(length), startX, startY, isHoriz);
    // redraw board
    generateBoardArea(player1, playerBoard, enableAttacks);

    // all ships placed
    if (playerBoard.getShipCount() >= numberOfShips) {
      generateCompShipPositions();
      hideDomElement('#ship-board');
      enableAttacks = true;
      generateBoardArea(player2, player2Board, enableAttacks);

      updateMessage('Commence your attacks!');
    }
  };

  const processValidAttack = (player, playerBoard, x, y) => {
    const isPlayer = !player.isComp();

    enableAttacks = false;
    const attackResult = playerBoard.receiveAttack(x, y);
    console.log('attackResult', attackResult);

    if (attackResult.ship) {
      attackResult.sunk
        ? updateMessage(
            `${isPlayer ? 'You have' : 'The computer has'} sunk a ship!`
          )
        : updateMessage(`${isPlayer ? "That's a hit!" : 'The computer hit!'}`);
    } else {
      updateMessage(`${isPlayer ? "That's a miss!" : 'The computer missed!'}`);
    }
  };

  // on player click on enemy board
  const attackEnemy = async (playerBoard, x, y) => {
    if (playerBoard.getAttackedAtLoc(x, y)) {
      updateMessage('You already attacked that location.');
    } else {
      processValidAttack(player1, playerBoard, x, y);
      generateBoardArea(player2, player2Board, enableAttacks);

      // check for player win
      if (playerBoard.allSunk()) endGame(true);

      await delay(2000);

      // computer turn
      const compAttackLoc = generateCompAttack();
      processValidAttack(
        player2,
        player1Board,
        compAttackLoc.x,
        compAttackLoc.y
      );
      generateBoardArea(player1, player1Board, false);

      // check for computer win
      if (player1Board.allSunk()) endGame(false);

      enableAttacks = true;
      generateBoardArea(player2, playerBoard, enableAttacks);
    }
  };

  const endGame = (isWin) => {
    if (isWin) {
      updateMessage('Congratulations captain, you won!');
    } else {
      updateMessage('Commiserations captain, you lost!');
    }
    // create a form that only has the result of the game, and a new game button
  };

  return { addShipToBoard, attackEnemy };
};

// OPTIONS PANEL - NEW GAME, RESET GAME

let newGame;

const generateStartGameButton = () => {
  const newGameButton = document.querySelector('#new-game-button');
  // newGameButton.textContent = 'Start new game';
  newGameButton.addEventListener('click', () => {
    newGame = createGame();
  });
};

generateStartGameButton();

// create game factory and start game button

export { newGame };
