import { test, expect, describe } from '@jest/globals';

import createPlayer from './Player.js';
import createGameboard from './Gameboard.js';

// test player created

describe('PLAYER CREATION', () => {
  let player1 = createPlayer('Player 1', false);
  let player2 = createPlayer('Computer', true);
  test('name assigned correctly', () => {
    expect(player1.getName()).toEqual('Player 1');
  });
  test('isComputer assigned correctly for player', () => {
    expect(player1.isComp()).toEqual(false);
  });
  test('isComputer assigned correctly for comp', () => {
    expect(player2.isComp()).toEqual(true);
  });
});

describe('ASSIGNING BOARD', () => {
  let player1 = createPlayer('Player 1', false);
  let playerBoard = createGameboard(8);
  player1.assignBoard(playerBoard);
  test('board assigned correctly', () => {
    expect(player1.getBoard()).toEqual(playerBoard);
  });
});

describe('ASSIGNING OPPONENT', () => {
  const computer = createPlayer('Computer', true);
  const player1 = createPlayer('Player 1', false);
  player1.assignOpponent(computer);
  test('opponent correctly assigned', () => {
    expect(player1.getOpponent()).toEqual(computer);
  });
});

describe('AUTOMATIC ATTACK SELECTION', () => {
  const computer = createPlayer('Computer', true);
  const player1 = createPlayer('Player 1', false);
  const playerBoard = createGameboard(8);
  player1.assignBoard(playerBoard);
  computer.assignOpponent(player1);
  const compOpponent = computer.getOpponent();
  const opponentBoard = compOpponent.getBoard();

  test('multiple attacks only targetted at previously unattacked locations', () => {
    for (let i = 0; i < 30; i++) {
      const { x, y } = player1.selectAttack(opponentBoard);
      expect(opponentBoard.getAttackedAtLoc(x, y)).toEqual(false);
      opponentBoard.addAttackedToLoc(x, y);
    }
  });
});

// test assigning opponent
