import { test, expect, describe } from '@jest/globals';

import createGameboard from './Gameboard.js';
import createShip from './Ship.js';

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

  // chosen not to add in additional parameter tests - checking correct type

  test('direction argument not "horiz" or "vert" throws error', () => {
    let ship1 = createShip(4);
    const dirErrorMsg = 'ship direction must be "horiz" or "vert"';

    expect(() => board.positionShip(ship1, 6, 1, 'nothorizorvert')).toThrow(
      dirErrorMsg
    );
  });

  test('x and y coords off board throws error', () => {
    let ship1 = createShip(4);
    const coordErrorMsg = 'x and y coords must be on board';
    expect(() => board.positionShip(ship1, -1, 1, 'horiz')).toThrow(
      coordErrorMsg
    );
    expect(() => board.positionShip(ship1, 8, 1, 'horiz')).toThrow(
      coordErrorMsg
    );
    expect(() => board.positionShip(ship1, 1, -1, 'horiz')).toThrow(
      coordErrorMsg
    );
    expect(() => board.positionShip(ship1, 1, 8, 'horiz')).toThrow(
      coordErrorMsg
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

describe('RECEIVED ATTACK', () => {
  let board = createGameboard();

  // add in tests for bad parameters for receiveAttack

  test('board position attack set to true', () => {
    board.receiveAttack(6, 6);
    expect(board.getAttackedAtLoc(6, 6)).toEqual(true);
  });

  test('miss returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 3, 3, 'horiz');
    expect(board.receiveAttack(4, 4)).toEqual({ hit: false, sunk: false });
  });

  test('hit and not sunk returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 1, 1, 'horiz');
    expect(board.receiveAttack(1, 1)).toEqual({ hit: true, sunk: false });
  });

  test('hit and sunk returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 1, 1, 'horiz');
    board.receiveAttack(1, 1);
    expect(board.receiveAttack(2, 1)).toEqual({ hit: true, sunk: true });
  });
});
