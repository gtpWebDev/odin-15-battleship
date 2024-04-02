const createShip = (len = 0) => {
  let length = len;
  let hitsTaken = 0;
  let sunk = false;

  const hit = () => {
    hitsTaken++;
    hitsTaken >= length ? (sunk = true) : (sunk = false);
  };

  const isSunk = () => sunk;

  return { hit, isSunk };
};

export { createShip as default };
