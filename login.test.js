import { validateEmail } from "./lib/util";

test('Proverava da li email sadrži @ znak', () => {
  expect(validateEmail("lukah@example.com")).toBe(true);
  expect(validateEmail("pogresan-email")).toBe(false);
});