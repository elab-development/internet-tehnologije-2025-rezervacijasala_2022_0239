export const validateEmail = (email: string) => {
  return email.includes('@') && email.includes('.'); // Malo jača provera
};

module.exports = { validateEmail };