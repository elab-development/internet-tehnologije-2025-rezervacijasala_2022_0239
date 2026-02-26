const { isCapacityValid } = require("./lib/util");

test('Proverava da li je kapacitet sale u dozvoljenom opsegu (1-500)', () => {
  expect(isCapacityValid(50)).toBe(true);   // Normalna sala
  expect(isCapacityValid(0)).toBe(false);    // Sala bez mesta - greška
  expect(isCapacityValid(-5)).toBe(false);   // Negativan broj - greška
  expect(isCapacityValid(600)).toBe(false);  // Prevelika sala - greška
});