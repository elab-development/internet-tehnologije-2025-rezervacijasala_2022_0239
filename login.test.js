const validateEmail = (email) => {
  return email.includes('@');
};

test('Proverava da li email sadrži @ znak', () => {
  expect(validateEmail("lukah@example.com")).toBe(true);
  expect(validateEmail("pogresan-email")).toBe(false);
});