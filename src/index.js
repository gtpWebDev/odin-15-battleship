import './styles.css';

import createGameboard from './Gameboard.js';
import createShip from './Ship.js';

let board = createGameboard('Glen', 8);

let ship = createShip(3);
// console.log(ship.getLength());
board.positionShip(ship, 1, 1, 'right');

// import DownCaret from './menu-down.svg';

// const element = document.querySelector('#caret-container');

// const img = document.createElement('img');
// img.setAttribute('src', DownCaret);
// img.setAttribute('style', 'width:50px');
// element.appendChild(img);
