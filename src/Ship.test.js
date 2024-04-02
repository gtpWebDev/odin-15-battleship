import { test, expect, describe, beforeAll } from '@jest/globals';

import createShip from './Ship.js';

test('Created ship with length not a number throws an error', () => {
  expect(() => createShip()).toThrow('ship length must be a number');
  expect(() => createShip(true)).toThrow('ship length must be a number');
  expect(() => createShip('')).toThrow('ship length must be a number');
  expect(() => createShip(null)).toThrow('ship length must be a number');
  expect(() => createShip(undefined)).toThrow('ship length must be a number');
});

test('Created ship with length outside accepted range throws an error', () => {
  expect(() => createShip(0)).toThrow('ship length must be min 1, max 5');
  expect(() => createShip(6)).toThrow('ship length must be min 1, max 5');
});

describe('Created ship', () => {
  const ship = createShip(3);
  test('starts with hits taken zero', () => {
    expect(ship.getHitsTaken()).toEqual(0);
  });
  test('starts not sunk', () => {
    expect(ship.isSunk()).toEqual(false);
  });
});

describe('Created ship of size 2 gets hit', () => {
  const ship = createShip(2);
  ship.hit();
  test('has hitsTaken of 1', () => {
    expect(ship.getHitsTaken()).toEqual(1);
  });
  test('but is not sunk', () => {
    expect(ship.isSunk()).toEqual(false);
  });
});

describe('Created ship of size 2 gets twice', () => {
  const ship = createShip(2);
  ship.hit();
  ship.hit();
  test('has hitsTaken of 2', () => {
    expect(ship.getHitsTaken()).toEqual(2);
  });
  test('and is sunk', () => {
    expect(ship.isSunk()).toEqual(true);
  });
});
