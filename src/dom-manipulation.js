import { game } from './index.js';
import {
  battleshipSvg,
  carrierSvg,
  destroyerSvg,
  submarineSvg,
  cruiserSvg,
} from './svg-ships.js';

import { showDomElement } from './dom-general.js';

// PLAYER GAMEBOARD ELEMENTS

const generateBoardArea = (playerX, playerBoard) => {
  const playerGameboard = document.querySelector(`#${playerX}-gameboard`);
  playerGameboard.innerHTML = '';

  const titleArea = document.createElement('div');
  titleArea.setAttribute('id', `${playerX}-gameboard-title`);
  titleArea.setAttribute('class', 'player-gameboard-title');
  titleArea.textContent = playerX;

  const detailsArea = document.createElement('div');
  detailsArea.setAttribute('id', `${playerX}-gameboard-text`);
  detailsArea.setAttribute('class', 'player-gameboard-text');
  detailsArea.textContent = 'Useful text here';

  const boardArea = generateGrid(playerX, playerBoard);

  playerGameboard.appendChild(titleArea);
  playerGameboard.appendChild(detailsArea);
  playerGameboard.appendChild(boardArea);
};

const styleGridPosition = (boardGrid, x, y, playerBoard) => {
  if (playerBoard.getShipAtLoc(x, y))
    boardGrid.classList.add('class', 'with-ship');

  if (playerBoard.getAttackedAtLoc(x, y))
    boardGrid.classList.add('class', 'attacked');
};

const generateGrid = (playerX, playerBoard) => {
  const boardSize = playerBoard.getBoardSize();
  const boardArea = document.createElement('div');
  boardArea.setAttribute('id', `${playerX}-gameboard-board`);
  boardArea.setAttribute('class', 'player-gameboard-board');
  boardArea.innerHTML = '';
  boardArea.setAttribute(
    'style',
    `grid-template-rows: repeat(${boardSize},1fr); grid-template-columns: repeat(${boardSize},1fr)`
  );

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const boardGrid = document.createElement('div');

      boardGrid.setAttribute('class', 'board-cell');
      boardGrid.setAttribute(
        'style',
        `width: calc(${1 / (boardSize + 2)}*var(--player-window-width)); 
        height: calc(${1 / (boardSize + 2)}*var(--player-window-width))`
      );
      // boardGrid.textContent = x + '/' + y; // temporary

      // add what information is to be displayed for a cell through classes

      //ship = null or with ship
      // attacked is true or false

      styleGridPosition(boardGrid, x, y, playerBoard);

      // if (playerBoard.getShipAtLoc(x, y))
      //   boardGrid.classList.add('class', 'with-ship');

      // if (playerBoard.getAttackedAtLoc(x, y))
      //   boardGrid.classList.add('class', 'attacked');

      boardGrid.addEventListener('dragover', (event) => {
        event.preventDefault();
      });

      boardGrid.addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const length = Number(data.slice(0, data.indexOf('/')));
        const isHoriz = data.slice(data.indexOf('/') + 1) === 'true';
        if (playerBoard.shipPositionValid(x, y, length, isHoriz)) {
          game.addShipToBoard(x, y, length, isHoriz);

          // disable relevant ship from being selected again (remove listener?)
          // reset viewer
        }
      });

      boardArea.appendChild(boardGrid);
    }
  }
  return boardArea;
};

// SHIP SELECTOR ELEMENTS

const generateShipBoard = (boardSize) => {
  showDomElement('#ship-board');
  const container = document.querySelector(`#ship-board`);

  const shipBoardTitle = document.createElement('div');
  shipBoardTitle.setAttribute('class', 'ship-board-title');
  shipBoardTitle.textContent = 'Ship selection';

  const shipBoardText = document.createElement('div');
  shipBoardText.setAttribute('class', 'ship-board-text');
  shipBoardText.textContent = 'Select a ship, captain!';

  const shipBoardSelector = generateShipBoardSelector(boardSize);

  const shipBoardViewer = generateShipBoardViewer();

  container.appendChild(shipBoardTitle);
  container.appendChild(shipBoardText);
  container.appendChild(shipBoardSelector);
  container.appendChild(shipBoardViewer);
};

// generate selector area - view of the 5 selectable ships
const generateShipBoardSelector = (boardSize) => {
  const shipBoardSelector = document.createElement('div');
  shipBoardSelector.setAttribute('class', 'ship-board-selector');

  const battleship = generateShipSvg(boardSize, battleshipSvg);
  shipBoardSelector.appendChild(battleship);
  const carrier = generateShipSvg(boardSize, carrierSvg);
  shipBoardSelector.appendChild(carrier);
  const destroyer = generateShipSvg(boardSize, destroyerSvg);
  shipBoardSelector.appendChild(destroyer);
  const submarine = generateShipSvg(boardSize, submarineSvg);
  shipBoardSelector.appendChild(submarine);
  const cruiser = generateShipSvg(boardSize, cruiserSvg);
  shipBoardSelector.appendChild(cruiser);

  return shipBoardSelector;
};

// generate viewer area - from where ship can be click-rotated or dragged
const generateShipBoardViewer = () => {
  const shipBoardViewer = document.createElement('div');
  shipBoardViewer.setAttribute('class', 'ship-board-viewer');

  const shipBoardViewerBox = document.createElement('div');
  shipBoardViewerBox.setAttribute('id', 'ship-board-viewer-box');

  shipBoardViewer.appendChild(shipBoardViewerBox);
  return shipBoardViewer;
};

// generate ship image from svg path, with event listener
const generateShipSvg = (boardSize, svgDetails) => {
  // Note, svg requires an XML element, not an HTML element
  const ship = document.createElementNS(svgDetails.xmlns, `svg`);
  ship.setAttribute('id', `${svgDetails.name}-img-selector`);
  ship.setAttribute('viewBox', svgDetails.viewBox);
  ship.setAttribute('preserveAspectRatio', 'none');
  ship.innerHTML = svgDetails.path;
  ship.addEventListener('click', () => {
    generateDraggableShip(boardSize, svgDetails);
  });
  return ship;
};

const rotateShip = (boardSize, container, length) => {
  // use data attribute is-horiz

  var isHoriz = container.dataset.isHoriz === 'true';

  console.log('current isHoriz', isHoriz);

  const newIsHoriz = !isHoriz;

  // define grid cols/rows
  container.style.removeProperty('grid-template-rows');
  container.style.removeProperty('grid-template-columns');
  const gridStructureText = newIsHoriz
    ? `grid-template-columns: repeat(${length}, 1fr)`
    : `grid-template-rows: repeat(${length}, 1fr)`;
  container.setAttribute('style', gridStructureText);

  // inner html cler
  container.innerHTML = '';

  // draw actual grid
  let thinFactor = 1;
  let widthScalar = 1;
  let heightScalar = 1;
  newIsHoriz ? (heightScalar = thinFactor) : (widthScalar = thinFactor);

  for (let x = 0; x < length; x++) {
    const boardGrid = document.createElement('div');
    boardGrid.setAttribute('class', 'board-cell');
    boardGrid.setAttribute(
      'style',
      `width: calc(${widthScalar}*${1 / (boardSize + 2)}*var(--player-window-width));
      height: calc(${heightScalar}*${1 / (boardSize + 2)}*var(--player-window-width))`
    );
    // boardGrid.textContent = x; // temporary
    container.appendChild(boardGrid);
  }

  // data attribute update to not isHoriz
  container.setAttribute('data-is-horiz', newIsHoriz);
  console.log('changing isHoriz to', newIsHoriz);

  // narrow the box width / height to help placement
};

// generate simplified view of selected ship in viewer for rotation and dragging
const generateDraggableShip = (boardSize, svgDetails) => {
  const boxArea = document.querySelector(`#ship-board-viewer-box`);
  boxArea.innerHTML = '';

  const draggableContainer = document.createElement('div');
  // draggableContainer.setAttribute('class', 'draggable-container');
  draggableContainer.setAttribute('id', 'draggable-container');
  draggableContainer.setAttribute('data-is-horiz', true);
  draggableContainer.setAttribute('draggable', `true`);
  draggableContainer.setAttribute(
    'style',
    `grid-template-columns: repeat(${svgDetails.length}, 1fr)`
  );

  let thinFactor = 1;
  let widthScalar = 1;
  let heightScalar = 1;
  heightScalar = thinFactor;

  for (let x = 0; x < svgDetails.length; x++) {
    const boardGrid = document.createElement('div');
    boardGrid.classList.add('board-cell');

    boardGrid.setAttribute(
      'style',
      `width: calc(${widthScalar}*${1 / (boardSize + 2)}*var(--player-window-width));
      height: calc(${heightScalar}*${1 / (boardSize + 2)}*var(--player-window-width))`
    );
    // boardGrid.textContent = x; // temporary
    draggableContainer.appendChild(boardGrid);
  }

  // rotate and drag functionality
  draggableContainer.addEventListener('click', () => {
    rotateShip(boardSize, draggableContainer, svgDetails.length);
  });

  draggableContainer.addEventListener('dragstart', (event) => {
    // bit messy but adding length and isHoriz info into plain text drag data transfer
    const constructedDragData =
      svgDetails.length + '/' + draggableContainer.dataset.isHoriz;
    console.log('drag data', constructedDragData);
    event.dataTransfer.setData('text/plain', constructedDragData);
    event.dataTransfer.setDragImage(draggableContainer, 30, 10);
  });

  boxArea.appendChild(draggableContainer);
};

export { generateBoardArea, generateShipBoard };
