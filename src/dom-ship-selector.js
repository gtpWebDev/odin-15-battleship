import background2 from './assets/background2.jpg';

// DELETE WHEN CONFIDENT CAN

import {
  battleshipSvg,
  carrierSvg,
  destroyerSvg,
  submarineSvg,
  cruiserSvg,
} from './svg-ships.js';

import { showDomElement } from './dom-general.js';

// generate all elements of ship board
const generateShipBoard = () => {
  showDomElement('#ship-board');
  const container = document.querySelector(`#ship-board`);

  const titleArea = document.createElement('div');
  titleArea.setAttribute('class', 'ship-board-title');
  titleArea.textContent = 'Ship selection';

  const textArea = document.createElement('div');
  textArea.setAttribute('class', 'ship-board-text');
  textArea.textContent = 'Select a ship, captain!';

  const shipBoardSelector = generateShipBoardSelector();

  const shipBoardViewer = generateShipBoardViewer();

  container.appendChild(titleArea);
  container.appendChild(textArea);
  container.appendChild(shipBoardSelector);
  container.appendChild(shipBoardViewer);
};

// generate area from which ships are selected to be viewed in the viewer
const generateShipBoardSelector = () => {
  const shipBoardSelector = document.createElement('div');
  shipBoardSelector.setAttribute('class', 'ship-board-selector');

  const battleship = generateShipSvg(battleshipSvg);
  shipBoardSelector.appendChild(battleship);
  const carrier = generateShipSvg(carrierSvg);
  shipBoardSelector.appendChild(carrier);
  const destroyer = generateShipSvg(destroyerSvg);
  shipBoardSelector.appendChild(destroyer);
  const submarine = generateShipSvg(submarineSvg);
  shipBoardSelector.appendChild(submarine);
  const cruiser = generateShipSvg(cruiserSvg);
  shipBoardSelector.appendChild(cruiser);

  return shipBoardSelector;
};

// generates viewer which shows selected ships
const generateShipBoardViewer = () => {
  const shipBoardViewer = document.createElement('div');
  shipBoardViewer.setAttribute('class', 'ship-board-viewer');

  const shipBoardViewerBox = document.createElement('div');
  shipBoardViewerBox.setAttribute('id', 'ship-board-viewer-box');

  shipBoardViewer.appendChild(shipBoardViewerBox);
  return shipBoardViewer;
};

// Generate ship image with click event listener to move ship to viewer
const generateShipSvg = (svgDetails) => {
  // Note, svg requires an XML element, not an HTML element
  const ship = document.createElementNS(svgDetails.xmlns, `svg`);
  ship.setAttribute('id', `${svgDetails.name}-img-selector`);
  ship.setAttribute('viewBox', svgDetails.viewBox);
  ship.setAttribute('preserveAspectRatio', 'none');
  ship.innerHTML = svgDetails.path;
  ship.addEventListener('click', () => {
    generateDraggableShip(svgDetails, true);
  });
  return ship;
};

// generate the duplicate ship in a draggable container (dragging SVGs directly seems problematic)
const generateDraggableShip = (svgDetails, isHoriz) => {
  const boxArea = document.querySelector(`#ship-board-viewer-box`);
  boxArea.innerHTML = '';

  const draggableContainer = document.createElement('div');
  draggableContainer.setAttribute('class', 'draggable-container');
  draggableContainer.setAttribute('id', 'draggable-container');
  draggableContainer.setAttribute('draggable', `true`);

  isHoriz
    ? draggableContainer.setAttribute('class', 'horizontal-ship')
    : draggableContainer.setAttribute('class', 'vertical-ship');

  // const gridOrientation = isHoriz
  //   ? `grid-template-columns: repeat(${length},1fr);`
  //   : `grid-template-rows: repeat(${length},1fr);`;
  // draggableContainer.setAttribute('style', gridOrientation);

  // COLLECT THIS PROPERLY!
  const boardSize = 8;

  // narrow the box width / height to help placement

  let thinFactor = 0.6;
  let widthScalar = 1;
  let heightScalar = 1;
  isHoriz ? (heightScalar = thinFactor) : (widthScalar = thinFactor);

  for (let x = 0; x < svgDetails.length; x++) {
    const boardGrid = document.createElement('div');
    boardGrid.setAttribute('class', 'board-cell');
    boardGrid.setAttribute(
      'style',
      `width: calc(${widthScalar}*${1 / (boardSize + 2)}*var(--player-window-width)); 
      height: calc(${heightScalar}*${1 / (boardSize + 2)}*var(--player-window-width))`
    );
    // boardGrid.textContent = x; // temporary
    draggableContainer.appendChild(boardGrid);
  }

  // rotate functionality
  draggableContainer.addEventListener('click', () => {
    draggableContainer.classList.toggle('horizontal-ship');
    draggableContainer.classList.toggle('vertical-ship');
    // would need to change grid dimensions
  });

  // DO OFFSET RIGHT
  draggableContainer.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    console.log('DRAGGING');
    event.dataTransfer.setDragImage(
      draggableContainer,
      300 / svgDetails.length - 30,
      10
    );
  });

  // const draggableContainer = document.createElement('div');
  // draggableContainer.setAttribute('class', 'draggable-container');
  // draggableContainer.setAttribute('id', 'draggable-container');
  // draggableContainer.setAttribute('draggable', `true`);

  // draggableContainer.addEventListener('click', () => {
  //   if (
  //     draggableContainer.classList.contains('rotated-0-deg') ||
  //     draggableContainer.classList.contains('rotated-90-deg')
  //   ) {
  //     draggableContainer.classList.toggle('rotated-90-deg');
  //     draggableContainer.classList.toggle('rotated-0-deg');
  //   } else {
  //     draggableContainer.classList.add('rotated-90-deg');
  //   }
  // });

  // const ship = document.createElementNS(svgDetails.xmlns, 'svg');
  // ship.setAttribute('class', 'draggable-ship');
  // ship.setAttribute('id', 'draggable-ship-viewer');
  // ship.setAttribute('viewBox', svgDetails.viewBox);
  // ship.setAttribute('preserveAspectRatio', 'none');
  // ship.setAttribute(
  //   'style',
  //   `width: calc(${svgDetails.length} * var(--grid-dimension)); height: calc(var(--grid-dimension))`
  // );
  // ship.innerHTML = svgDetails.path;

  // draggableContainer.addEventListener('mousedown', (event) => {
  //   // change content from svg image of ship to a representative rectangle
  // });

  // draggableContainer.addEventListener('dragstart', (event) => {
  //   draggableContainer.innerHTML = '';
  //   const dragImg = createDragRectangle();
  //   draggableContainer.appendChild(dragImg);

  //   event.dataTransfer.setData('text/plain', event.target.id);
  //   console.log('DRAGGING');

  //   // const dragImg = new Image();
  //   // dragImg.src = background2;

  //   // event.dataTransfer.setDragImage(
  //   //   dragImg,
  //   //   svgDetails.drag_x_offset,
  //   //   svgDetails.drag_y_offset
  //   // );
  //   // event.dataTransfer.effectAllowed = "copy"; // not clear on this yet, control which are possible, not which happens!
  // });

  // If I need to id the path, otherwise delete this
  // const viewerPath = draggableShip.querySelector(
  //   '#draggable-ship-viewer > path'
  // );
  // viewerPath.setAttribute('id', 'draggable-ship-viewer-path');

  // draggableContainer.appendChild(ship);
  boxArea.appendChild(draggableContainer);
};

const createDragRectangle = () => {
  const nameSpace = 'http://www.w3.org/2000/svg';
  let svg = document.createElementNS(nameSpace, 'svg');
  svg.setAttribute('width', '50px');
  svg.setAttribute('height', '20px');
  svg.style.backgroundColor = 'red';
  // document.body.appendChild(svg);

  //   newImage = `
  //     <svg xmlns="http://www.w3.org/2000/svg"
  //     viewBox="0 0 30 20">
  //       <rect x="0" y="0" width="30" height="20" fill="#fafafa"/>
  //       <rect x="4" y="5" width="8" height="10" fill="#007bff"/>
  //       <rect x="18" y="5" width="8" height="10"   fill="#888"/>
  //     </svg>
  // `;
  return svg;
};

export { generateShipBoard };
