import { test, expect, describe } from '@jest/globals';

import createGameboard from './Gameboard.js';
import createShip from './Ship.js';

// test board created - when know what passing to it with regards players 1/2

describe('BOARD CREATION', () => {
  let board = createGameboard();
  let boardSize = board.getBoardSize();
  test('board initialised correctly', () => {
    expect(board.getBoardPositionInfo(0, 0)).toEqual({
      ship: null,
      attacked: false,
    });
    expect(board.getBoardPositionInfo(boardSize - 1, boardSize - 1)).toEqual({
      ship: null,
      attacked: false,
    });
  });
});

describe('SHIP POSITIONING', () => {
  let board = createGameboard();

  // add in tests for bad parameters for positionShip - each param type and missing params
  // add in tests for bad parameters for positionShip - number values for coords
  // add in tests for bad parameters for positionShip - specifics for direction 2 options

  test('direction argument not "horiz" or "vert" throws error', () => {
    let ship1 = createShip(4);
    const dirErrorMsg = 'ship direction must be "horiz" or "vert"';

    expect(() => board.positionShip(ship1, 6, 1, 'nothorizorvert')).toThrow(
      dirErrorMsg
    );
  });

  test('horizontal ship positioned correctly', () => {
    let ship = createShip(4);
    expect(board.positionShip(ship, 1, 1, 'horiz')).toEqual({
      shipPlaced: true,
      reason: null,
    });
    expect(board.getShipAtLoc(0, 1)).toEqual(null);
    expect(board.getShipAtLoc(1, 1)).toEqual(ship);
    expect(board.getShipAtLoc(2, 1)).toEqual(ship);
    expect(board.getShipAtLoc(3, 1)).toEqual(ship);
    expect(board.getShipAtLoc(4, 1)).toEqual(ship);
    expect(board.getShipAtLoc(5, 1)).toEqual(null);
  });

  test('vertical ship positioned correctly', () => {
    let ship = createShip(3);
    expect(board.positionShip(ship, 3, 3, 'vert')).toEqual({
      shipPlaced: true,
      reason: null,
    });
    expect(board.getShipAtLoc(3, 2)).toEqual(null);
    expect(board.getShipAtLoc(3, 3)).toEqual(ship);
    expect(board.getShipAtLoc(3, 4)).toEqual(ship);
    expect(board.getShipAtLoc(3, 5)).toEqual(ship);
    expect(board.getShipAtLoc(3, 6)).toEqual(null);
  });

  test('ship off board to right - ship not placed', () => {
    let ship1 = createShip(4);
    expect(board.positionShip(ship1, 6, 1, 'horiz')).toEqual({
      shipPlaced: false,
      reason: 'off board',
    });
  });

  test('ship off board to bottom - ship not placed', () => {
    let ship2 = createShip(5);
    expect(board.positionShip(ship2, 2, 5, 'vert')).toEqual({
      shipPlaced: false,
      reason: 'off board',
    });
  });
});

// test board info after positionShip:

// - boat would cross over existing placed boats

// describe('Created board', () => {});

// test board info after receiveAttack

// const ship = createShip(3);
// board.positionShip(ship, 1, 1, 'right');
