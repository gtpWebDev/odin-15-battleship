import './styles.css';
import DownCaret from './menu-down.svg';

console.log('TEST');

const element = document.querySelector('#caret-container');

const img = document.createElement('img');
img.setAttribute('src', DownCaret);
img.setAttribute('style', 'width:50px');
element.appendChild(img);
