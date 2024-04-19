import shipSvg from './assets/images/ship.svg';

import activeGame from './Game.js';

import {
  battleshipSvg,
  carrierSvg,
  destroyerSvg,
  submarineSvg,
  cruiserSvg,
} from './svg-ships.js';

const showDomElement = (domElement) => {
  document.querySelector(domElement).classList.add('display-grid');
  document.querySelector(domElement).classList.remove('display-none');
};

const hideDomElement = (domElement) => {
  document.querySelector(domElement).classList.add('display-none');
  document.querySelector(domElement).classList.remove('display-grid');
};

// INITIAL DOM SETUP

const initialDomSetup = () => {
  const messagesPanel = document.querySelector('#messages');

  const newGameButton = document.createElement('button');
  newGameButton.setAttribute('id', 'new-game-button');
  newGameButton.textContent = 'Start new game';
  newGameButton.addEventListener('click', () => {
    activeGame.startGame();
    gameStartDomSetup();
  });

  messagesPanel.appendChild(newGameButton);
};

const gameStartDomSetup = () => {
  const realPlayer = activeGame.getRealPlayer();
  const isAttackEnabled = false;
  refreshBoardArea(realPlayer, isAttackEnabled);
  hideDomElement('#computer-gameboard');
  generateShipBoard(activeGame.getBoardSize());
  updateMessage('Place your ships captain!');
};

const setupAttackPhaseDom = () => {
  hideDomElement('#ship-board');
  const isAttackEnabled = true;
  refreshBoardArea(activeGame.getComputer(), isAttackEnabled);
  updateMessage('Commence your attacks!');
};

// MESSAGES WINDOW
const updateMessage = (text) => {
  const messageDOM = document.querySelector('#messages');
  messageDOM.innerHTML = '';
  messageDOM.textContent = text;
};

// PLAYER GAMEBOARD ELEMENTS

const refreshBoardArea = (player, enableAttacks) => {
  const playerBoard = player.getBoard();
  const playerGameboard = document.querySelector(
    `#${player.getName()}-gameboard`
  );
  showDomElement(`#${player.getName()}-gameboard`);
  playerGameboard.innerHTML = '';

  const titleArea = document.createElement('div');
  titleArea.setAttribute('id', `${player.getName()}-gameboard-title`);
  titleArea.setAttribute('class', 'player-gameboard-title');
  titleArea.textContent = player.getName();

  const boardArea = generateGrid(player, playerBoard, enableAttacks);
  if (enableAttacks) boardArea.classList.add('crosshairs');

  playerGameboard.appendChild(titleArea);
  playerGameboard.appendChild(boardArea);
};

const styleGridPosition = (player, boardGrid, boardData) => {
  const shipInLocation = boardData.ship;
  const locationAttacked = boardData.attacked;

  if (locationAttacked) {
    if (shipInLocation) {
      shipInLocation.isSunk()
        ? boardGrid.classList.add('class', 'sunk')
        : boardGrid.classList.add('class', 'hit');
    } else {
      boardGrid.classList.add('class', 'miss');
    }
  } else {
    if (!player.isComp() && shipInLocation) {
      boardGrid.classList.add('class', 'with-ship');
    } else {
      boardGrid.classList.add('class', 'no-ship');
    }
  }
};

const generateGrid = (player, playerBoard, enableAttacks) => {
  const boardSize = playerBoard.getBoardSize();
  const boardArea = document.createElement('div');
  boardArea.setAttribute('id', `${player.getName()}-gameboard-board`);
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

      // add styles to display ship, miss, hit and sunk
      styleGridPosition(
        player,
        boardGrid,
        playerBoard.getBoardPositionInfo(x, y)
      );
      // styleGridPosition(boardGrid, x, y, playerBoard);

      if (enableAttacks) {
        boardGrid.addEventListener('click', () => {
          activeGame.attackRound(x, y);
        });
      }

      boardGrid.addEventListener('dragover', (event) => {
        event.preventDefault();
      });

      boardGrid.addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const shipName = data.slice(0, data.indexOf('-'));
        const length = Number(
          data.slice(data.indexOf('-') + 1, data.indexOf('/'))
        );
        const isHoriz = data.slice(data.indexOf('/') + 1) === 'true';

        if (playerBoard.shipPositionValid(x, y, length, isHoriz)) {
          activeGame.addShipToBoard(x, y, length, isHoriz);
          // disable image of positioned ship, and empty viewer
          const shipImg = document.querySelector(`#${shipName}-img-selector`);
          shipImg.setAttribute('style', 'opacity:0.2; pointer-events:none');
          const shipViewer = document.querySelector(`#ship-board-viewer-box`);
          shipViewer.innerHTML = '';

          const shipBoardText = document.querySelector(`.ship-board-text`);
          shipBoardText.textContent = 'Select a ship, captain';
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
  container.innerHTML = '';

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
    boardGrid.classList.add('with-ship');
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

  // narrow the box width / height to help placement
};

// generate simplified view of selected ship in viewer for rotation and dragging
const generateDraggableShip = (boardSize, svgDetails) => {
  const shipBoardText = document.querySelector(`.ship-board-text`);
  shipBoardText.textContent = 'Click-rotate or drag the ship';

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
    boardGrid.classList.add('with-ship');
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
      svgDetails.name +
      '-' +
      svgDetails.length +
      '/' +
      draggableContainer.dataset.isHoriz;
    event.dataTransfer.setData('text/plain', constructedDragData);
    // offsets need to react to page scale
    event.dataTransfer.setDragImage(draggableContainer, 20, 20);
  });

  boxArea.appendChild(draggableContainer);
};

// END GAME DIALOG

const generateEndGameDialog = (resultText) => {
  const endGameDialog = document.querySelector('#end-game-dialog');
  endGameDialog.setAttribute('class', 'end-game-dialog-display');

  updateMessage('');

  const dialogEndGameText = document.createElement('div');
  dialogEndGameText.setAttribute('id', 'dialog-end-game-text');
  dialogEndGameText.textContent = resultText;

  const dialogNewGameButton = document.createElement('button');
  dialogNewGameButton.setAttribute('id', 'dialog-new-game-button');
  dialogNewGameButton.textContent = 'START NEW GAME';
  dialogNewGameButton.addEventListener('click', () => {
    endGameDialog.setAttribute('class', 'end-game-dialog-no-display');
    endGameDialog.close();
    activeGame.startGame();
    gameStartDomSetup();
  });

  endGameDialog.appendChild(dialogEndGameText);
  endGameDialog.appendChild(dialogNewGameButton);
  endGameDialog.classList.remove('end-game-dialog-no-display');
};

export {
  initialDomSetup,
  gameStartDomSetup,
  setupAttackPhaseDom,
  showDomElement,
  hideDomElement,
  updateMessage,
  refreshBoardArea,
  generateShipBoard,
  generateEndGameDialog,
};
