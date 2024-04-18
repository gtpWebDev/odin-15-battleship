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

  Access coordinate (x,y) using boardArray[x][y]

  each board position contains an object of form:
    {
      ship: null || Ship factory object,
      attacked: true || false
    }

*/

const createGameboard = (boardSize) => {
  let shipCount = 0;

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

  const getBoardArray = () => boardArray;

  const addShipToLoc = (x, y, ship) => (boardArray[x][y].ship = ship);
  const getShipAtLoc = (x, y) => boardArray[x][y].ship;

  const addAttackedToLoc = (x, y) => (boardArray[x][y].attacked = true);
  const getAttackedAtLoc = (x, y) => boardArray[x][y].attacked;

  // the get functions currently have no use other than in testing
  const getBoardPositionInfo = (x, y) => boardArray[x][y];
  const getBoardSize = () => boardSize; // not essential

  const addToShipCount = () => shipCount++;
  const getShipCount = () => shipCount;

  function generateShipCoords(startX, startY, shipLength, isHoriz) {
    // calculate potential ship coordinates

    let coordArray = [];
    if (isHoriz) {
      for (let x = 0; x < shipLength; x++) {
        coordArray.push({ x: startX + x, y: startY });
      }
    } else {
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

  // Allows live update of board on drag over based on location, ship length and direction
  const shipPositionValid = (startX, startY, length, isHoriz) => {
    // error checking on input arguments
    const dirErrorMsg = 'ship isHoriz must be true/false';
    if (typeof isHoriz !== 'boolean') {
      throw new Error(dirErrorMsg);
    }

    if (startX < 0 || startX >= boardSize || startY < 0 || startY >= boardSize)
      return false;

    const shipCoords = generateShipCoords(startX, startY, length, isHoriz);
    // console.log(shipCoords);

    const { shipValid } = checkShipCoords(shipCoords, boardSize, boardArray);

    return shipValid;
  };

  const positionShip = (ship, startX, startY, isHoriz) => {
    // error checking on input arguments
    const dirErrorMsg = 'ship isHoriz must be true/false';
    if (typeof isHoriz !== 'boolean') {
      throw new Error(dirErrorMsg);
    }

    const coordErrorMsg = 'x and y coords must be on board';
    if (startX < 0 || startX >= boardSize) throw new Error(coordErrorMsg);
    if (startY < 0 || startY >= boardSize) throw new Error(coordErrorMsg);

    const shipCoords = generateShipCoords(
      startX,
      startY,
      ship.getLength(),
      isHoriz
    );
    // console.log(shipCoords);

    const { shipValid, reason } = checkShipCoords(
      shipCoords,
      boardSize,
      boardArray
    );

    if (shipValid) {
      addShipToBoard(ship, shipCoords);
      addToShipCount();
      return { shipPlaced: true, reason: reason };
    } else {
      return { shipPlaced: false, reason: reason };
    }
  };

  const receiveAttack = (x, y) => {
    const boardPosInfo = getBoardPositionInfo(x, y);
    const shipAtLoc = boardPosInfo.ship;
    const shipHit = shipAtLoc ? true : false;
    if (shipHit) shipAtLoc.hit();
    const shipSunk = shipHit ? shipAtLoc.isSunk() : false;

    addAttackedToLoc(x, y);

    return {
      hit: shipHit,
      sunk: shipSunk,
      ship: shipAtLoc,
    };
  };

  const allSunk = () => {
    const flatArray = boardArray.flat();
    const shipsFloating = flatArray.some(
      (element) => element.ship !== null && element.attacked === false
    );
    return !shipsFloating;
  };

  // print to console functions for dev only
  const printAttacks = () => {
    console.log('________________________');
    for (let y = 0; y < boardSize; y++) {
      let horizLineString = `row ${y}: `;
      for (let x = 0; x < boardSize; x++) {
        const attacked = boardArray[x][y].attacked ? 'Y' : 'N';
        horizLineString += `${attacked} | `;
      }
      console.log(horizLineString);
    }
    console.log('________________________');
  };
  const printShips = () => {
    console.log('________________________');
    for (let y = 0; y < boardSize; y++) {
      let horizLineString = `row ${y}: `;
      for (let x = 0; x < boardSize; x++) {
        const ship = boardArray[x][y].ship ? 'S' : '_';
        horizLineString += `${ship} | `;
      }
      console.log(horizLineString);
    }
    console.log('________________________');
  };

  return {
    getBoardArray,
    getBoardSize,
    getBoardPositionInfo,
    shipPositionValid,
    positionShip,
    receiveAttack,
    getShipAtLoc,
    getShipCount,
    addAttackedToLoc,
    getAttackedAtLoc,
    printAttacks,
    printShips,
    allSunk,
  };
};

export { createGameboard as default };
