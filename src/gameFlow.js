// import './styles.css';

// import createGameboard from './Gameboard.js';
// import createShip from './Ship.js';
// import createPlayer from './Player.js';

// // SETUP

// // setup players:
// // - this will be adjusted according to demo start or normal start
// // - and will take name from interface, maybe

// // const setupGame = () => {
// const player1 = createPlayer('Player 1', false);
// const player1Board = createGameboard();
// player1.assignBoard(player1Board);

// const player2 = createPlayer('Computer', true);
// const player2Board = createGameboard();
// player2.assignBoard(player2Board);

// // assign opponents
// player1.assignOpponent(player2);
// player2.assignOpponent(player1);
// // };

// const positionShips = () => {
//   // player ship positioning (demo would run auto twice)

//   const playerBoard = player1.getBoard();

//   const ship1 = createShip(2);
//   playerBoard.positionShip(ship1, 1, 1, 'horiz');
//   const ship2 = createShip(2);
//   playerBoard.positionShip(ship2, 3, 3, 'vert');

//   // playerBoard.printAttacks();
//   // playerBoard.printShips();

//   // computer ship positioning
//   const compBoard = player2.getBoard();
//   for (let i = 0; i < 2; i++) {
//     const shipLength = 2; // 5 - i;
//     const autoShip = createShip(shipLength);
//     for (let l = 0; l < shipLength; l++) {
//       compBoard.positionShip(autoShip, l + 1 + i, i, 'horiz');
//     }
//   }

//   // compBoard.printAttacks();
//   // compBoard.printShips();
// };

// const playerTurn = (player, x, y) => {
//   const opponent = player.getOpponent();
//   const opponentBoard = opponent.getBoard();
//   // player clicks attack choice 4,4
//   const result = opponentBoard.receiveAttack(x, y);
//   console.log(`${player.getName()}'s turn - x: ${x}, y: ${y}`);
//   console.log(`hit: ${result.hit}, sunk: ${result.sunk}`);
//   console.log(`Board for ${opponent.getName()}`);
//   // opponentBoard.printAttacks();
//   // opponentBoard.printShips();
//   console.log('All ships sunk?', opponentBoard.allSunk());
// };

// const unleashHell = () => {
//   playerTurn(player1, 0, 0); //miss
//   playerTurn(player2, 1, 1); //hit
//   playerTurn(player1, 1, 0); //hit
//   playerTurn(player2, 2, 1); //hit and sunk
//   playerTurn(player1, 7, 7); //miss
//   playerTurn(player2, 3, 3); //hit
//   playerTurn(player1, 6, 6); //miss
//   playerTurn(player2, 3, 4); //hit, sunk, game over
// };

// const startGame = () => {
//   positionShips();
//   unleashHell();
// };

// // associate with button
// // setupGame();
// startGame();

// const printBoard = (board) => {
//   console.log(board);
// };
