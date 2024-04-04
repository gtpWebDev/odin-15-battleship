const createPlayer = (playerName, isComputer = false) => {
  let board = null; // gameboard will be assigned
  let opponent = null;

  const getName = () => playerName;
  const isComp = () => isComputer;

  const assignBoard = (gameboard) => (board = gameboard);

  const assignOpponent = (opp) => (opponent = opp);
  const getOpponent = () => opponent;

  const getBoard = () => board;

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const selectAttack = (opponentBoard) => {
    // option to add improved logic, attacking adjacent to recent hits

    let x;
    let y;

    if (opponentBoard) {
      const boardSize = opponentBoard.getBoardSize();

      let attackValid = false;
      do {
        x = getRandomInt(0, boardSize - 1);
        y = getRandomInt(0, boardSize - 1);
        if (!opponentBoard.getAttackedAtLoc(x, y)) attackValid = true;
      } while (attackValid === false);
    } else {
      throw new Error('Board not assigned to player yet');
    }
    console.log(`comp choice: ${x}, ${y}`);
    return { x, y };
  };

  return {
    getName,
    isComp,
    assignBoard,
    assignOpponent,
    getBoard,
    getOpponent,
    selectAttack,
  };
};

export { createPlayer as default };
