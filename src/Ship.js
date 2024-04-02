const createShip = (len) => {
  const noLengthMsg = 'ship length must be a number';
  const incorrectLenMsg = 'ship length must be min 1, max 5';

  if (typeof len !== 'number') {
    throw new Error(noLengthMsg);
  } else if (len <= 0 || len > 5) {
    throw new Error(incorrectLenMsg);
  }

  let length = len;
  let hitsTaken = 0;
  let sunk = false;

  const getHitsTaken = () => hitsTaken;

  const hit = () => {
    hitsTaken++;
    hitsTaken >= length ? (sunk = true) : (sunk = false);
  };

  const isSunk = () => sunk;

  return { getHitsTaken, hit, isSunk };
};

export { createShip as default };
