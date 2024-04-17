import { test, expect, describe } from '@jest/globals';

import createGameboard from './Gameboard.js';
import createShip from './Ship.js';
import createPlayer from './Player.js';

describe('BOARD CREATION', () => {
  let board = createGameboard(8);
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

// This relates to shipPositionValid, which does not attempt to place the ship
describe('CHECK SHIP POSITIONING ONLY', () => {
  let board = createGameboard(8);

  // chosen not to add in additional parameter tests - checking correct type

  test('isHoriz argument not boolean throws error', () => {
    let shipLength = 4;
    const dirErrorMsg = 'ship isHoriz must be true/false';

    expect(() =>
      board.shipPositionValid(6, 1, shipLength, 'notboolean')
    ).toThrow(dirErrorMsg);
  });

  test('x and y coords off board returns false', () => {
    let shipLength = 4;
    expect(board.shipPositionValid(-1, 1, shipLength, true)).toEqual(false);
    expect(board.shipPositionValid(8, 1, shipLength, true)).toEqual(false);
    expect(board.shipPositionValid(1, -1, shipLength, true)).toEqual(false);
    expect(board.shipPositionValid(1, 8, shipLength, true)).toEqual(false);
  });

  test('ship off board to right returns false', () => {
    let shipLength = 4;
    expect(board.shipPositionValid(6, 1, shipLength, true)).toEqual(false);
  });
  test('ship off board to bottom returns false', () => {
    let shipLength = 5;
    expect(board.shipPositionValid(2, 5, shipLength, false)).toEqual(false);
  });

  test('ship on top of existing ship returns false', () => {
    let ship = createShip(5);
    board.positionShip(ship, 1, 1, true);
    let secondShipLength = 5;
    expect(board.shipPositionValid(3, 0, secondShipLength, false)).toEqual(
      false
    );
  });

  test('valid ship location returns true', () => {
    let shipLength = 3;
    expect(board.shipPositionValid(1, 2, shipLength, false)).toEqual(true);
    expect(board.shipPositionValid(2, 2, shipLength, false)).toEqual(true);
    expect(board.shipPositionValid(3, 2, shipLength, false)).toEqual(true);
  });
});

// This relates to positionShip, which attempts to place the ship
describe('SHIP POSITIONING', () => {
  let board = createGameboard(8);

  // chosen not to add in additional parameter tests - checking correct type

  test('isHoriz argument not boolean throws error', () => {
    let ship1 = createShip(4);
    const dirErrorMsg = 'ship isHoriz must be true/false';

    expect(() => board.positionShip(ship1, 6, 1, 'notboolean')).toThrow(
      dirErrorMsg
    );
  });

  test('x and y coords off board throws error', () => {
    let ship1 = createShip(4);
    const coordErrorMsg = 'x and y coords must be on board';
    expect(() => board.positionShip(ship1, -1, 1, true)).toThrow(coordErrorMsg);
    expect(() => board.positionShip(ship1, 8, 1, true)).toThrow(coordErrorMsg);
    expect(() => board.positionShip(ship1, 1, -1, true)).toThrow(coordErrorMsg);
    expect(() => board.positionShip(ship1, 1, 8, true)).toThrow(coordErrorMsg);
  });

  test('horizontal ship positioned correctly', () => {
    let ship = createShip(4);
    expect(board.positionShip(ship, 1, 1, true)).toEqual({
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
    expect(board.positionShip(ship, 3, 3, false)).toEqual({
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
    expect(board.positionShip(ship1, 6, 1, true)).toEqual({
      shipPlaced: false,
      reason: 'off board',
    });
  });

  test('ship off board to bottom - ship not placed', () => {
    let ship2 = createShip(5);
    expect(board.positionShip(ship2, 2, 5, false)).toEqual({
      shipPlaced: false,
      reason: 'off board',
    });
  });

  // clashes with vertical ship at 3/3 form above
  test('ship on top of existing ship - ship not placed', () => {
    let ship = createShip(5);
    expect(board.positionShip(ship, 2, 4, true)).toEqual({
      shipPlaced: false,
      reason: 'other ship',
    });
  });
});

describe('RECEIVED ATTACK', () => {
  let board = createGameboard(8);

  // add in tests for bad parameters for receiveAttack

  test('board position attack set to true', () => {
    board.receiveAttack(6, 6);
    expect(board.getAttackedAtLoc(6, 6)).toEqual(true);
  });

  test('miss returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 3, 3, true);
    expect(board.receiveAttack(4, 4)).toEqual({ hit: false, sunk: false });
  });

  test('hit and not sunk returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 1, 1, true);
    expect(board.receiveAttack(1, 1)).toEqual({ hit: true, sunk: false });
  });

  test('hit and sunk returns correct result', () => {
    let ship = createShip(2);
    board.positionShip(ship, 1, 1, true);
    board.receiveAttack(1, 1);
    expect(board.receiveAttack(2, 1)).toEqual({ hit: true, sunk: true });
  });
});

describe('ALL SUNK CHECK', () => {
  const player1 = createPlayer('Player 1', false);
  const player2 = createPlayer('Computer', true);
  const player2Board = createGameboard(8);
  player2.assignBoard(player2Board);
  player1.assignOpponent(player2);
  const ship1 = createShip(2);
  player2Board.positionShip(ship1, 1, 1, true);
  player2Board.receiveAttack(1, 1);

  test('all ships not sunk identified correctly', () => {
    expect(player2Board.allSunk()).toEqual(false);
  });
  test('all ships sunk identified correctly', () => {
    player2Board.receiveAttack(2, 1);
    expect(player2Board.allSunk()).toEqual(true);
  });
});
