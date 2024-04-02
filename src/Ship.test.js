import { test, expect, describe } from '@jest/globals';

import createShip from './Ship.js';

/*
Tests:
  Test the ship methods first
  Then at the end, when sure of the ship structure, test createShip
*/

describe('ship.isSunk', () => {
  const ship1 = createShip(3);
  const ship2 = createShip(1);
  test('createShip - isSunk', () => {
    ship1.hit();
    expect(ship1.isSunk()).toEqual(false);
    ship1.hit();
    expect(ship1.isSunk()).toEqual(false);
    ship1.hit();
    expect(ship1.isSunk()).toEqual(true);
  });
  test('createShip - isSunk', () => {
    expect(ship2.isSunk()).toEqual(false);
    ship2.hit();
    expect(ship2.isSunk()).toEqual(true);
  });
});
