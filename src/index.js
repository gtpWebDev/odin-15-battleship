import './styles.css';
import { generateBoardArea, generateShipBoard } from './dom-manipulation.js';
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

// initial onload actions - load any opening page dom
// - probably just a start game button to add here

// start game button
const createGame = () => {
  const boardSize = 8;

  const player1 = createPlayer('Player', false);
  const player1Board = createGameboard(boardSize);
  player1.assignBoard(player1Board);

  const player2 = createPlayer('Computer', true);
  const player2Board = createGameboard(boardSize);
  player2.assignBoard(player2Board);

  player1.assignOpponent(player2);
  player2.assignOpponent(player1);

  generateBoardArea('player-1', player1Board);
  generateShipBoard(boardSize);

  // on a ship being dropped successfully onto the board
  const addShipToBoard = (startX, startY, length, isHoriz) => {
    console.log('POSITIONING SHIP');
    const ship = createShip(length);
    player1Board.positionShip(ship, startX, startY, isHoriz);

    // redraw board
    generateBoardArea('player-1', player1Board);

    if (player1Board.getShipCount() >= 5) {
      // MOVE TO MAIN ATTACK STAGE
      // - replace ship selector with computer gameboard
      // update messaging, and ready to go
      console.log('PHASE 1 OVER');
    }
  };

  // on a click on the enemy board during player's turn
  const attackEnemy = () => {
    // check valid attack position
    // add attack to gameboard
    // check result, communicate miss, hit, sink
    // update computer board display
    // check whether player has sunk all ships = won = end game
    // - how to end? disable both boards, provide new game button?
    // - form which disables everything behind and has new game button?
  };

  return { addShipToBoard, attackEnemy };
};

// will be started through start game button
const game = createGame();

export { game };
