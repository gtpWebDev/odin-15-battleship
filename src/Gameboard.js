import createShip from './Ship.js';

/*
  
    Coordinates of gameboard:

    Top left [0][0]    ...   Top right [7][0]
    ...                ...   ...
    Bottom left [0][7] ...   Bottom right [7][7]

    Data stored in following structure:

  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  Access coordinate (x,y) using boardArra[x][y]

  each board position contains an object of form:
    {
      ship: null || Ship factory object,
      attacked: true || false
    }

*/

// gameboard relates to player 1 - with player 1 ships, and etc. player 2.
const createGameboard = () => {
  const boardSize = 8;

  const initialiseBoardArray = (n) => {
    let output = [];
    for (let y = 0; y < n; y++) {
      let horizArray = [];
      for (let x = 0; x < n; x++) {
        horizArray.push({
          ship: null,
          attacked: false,
        });
      }
      output.push(horizArray);
    }
    return output;
  };

  let boardArray = initialiseBoardArray(boardSize);

  const addShipToLoc = (x, y, ship) => (boardArray[x][y].ship = ship);
  const getShipAtLoc = (x, y) => boardArray[x][y].ship;

  const addAttackedToLoc = (x, y) => (boardArray[x][y].attacked = true);
  const getAttackedAtLoc = (x, y) => boardArray[x][y].attacked;

  // the get functions currently have no use other than in testing
  const getBoardPositionInfo = (x, y) => boardArray[x][y];
  const getBoardSize = () => boardSize; // not essential

  function generateShipCoords(startX, startY, shipLength, direction) {
    // calculate theoretical ship coordinates, ignoring board size or location of other ships

    let coordArray = [];
    if (direction === 'horiz') {
      for (let x = 0; x < shipLength; x++) {
        coordArray.push({ x: startX + x, y: startY });
      }
    } else if (direction === 'vert') {
      for (let y = 0; y < shipLength; y++) {
        coordArray.push({ x: startX, y: startY + y });
      }
    }
    return coordArray;
  }

  function checkShipCoords(shipCoords, boardSize, boardArray) {
    const shipOffBoard = shipCoords.some(
      (element) => element.x >= boardSize || element.y >= boardSize
    );
    if (shipOffBoard) return { shipValid: false, reason: 'off board' };

    let shipClash = false;
    shipCoords.forEach((element) => {
      const boardLoc = boardArray[element.x][element.y];
      if (boardLoc.ship !== null) shipClash = true;
    });
    if (shipClash) return { shipValid: false, reason: 'other ship' };

    return { shipValid: true, reason: null };
  }

  function addShipToBoard(ship, shipCoords) {
    shipCoords.forEach((element) => {
      addShipToLoc(element.x, element.y, ship);
    });
  }

  const positionShip = (ship, startX, startY, direction) => {
    // error checking on input arguments
    const dirErrorMsg = 'ship direction must be "horiz" or "vert"';
    if (direction !== 'horiz' && direction !== 'vert') {
      throw new Error(dirErrorMsg);
    }

    const shipCoords = generateShipCoords(
      startX,
      startY,
      ship.getLength(),
      direction
    );
    // console.log(shipCoords);

    const { shipValid, reason } = checkShipCoords(
      shipCoords,
      boardSize,
      boardArray
    );

    if (shipValid) {
      addShipToBoard(ship, shipCoords);
      return { shipPlaced: true, reason: reason };
    } else {
      return { shipPlaced: false, reason: reason };
    }
  };

  const receiveAttack = (xCoord, yCoord) => {
    // check if hit or not
    // tell ship it has been hit +1
    // record location on board as hit or miss
    // report whether the hit ship is sunk
    // report whether all ships are sunk
  };

  return {
    getBoardSize,
    getBoardPositionInfo,
    positionShip,
    receiveAttack,
    getShipAtLoc,
  };
};

export { createGameboard as default };
