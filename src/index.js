import './styles.css';

import createShip from './Ship.js';

// let ship = createShip(3);
// console.log(ship.getLength());

import DownCaret from './menu-down.svg';

const element = document.querySelector('#caret-container');

const img = document.createElement('img');
img.setAttribute('src', DownCaret);
img.setAttribute('style', 'width:50px');
element.appendChild(img);
