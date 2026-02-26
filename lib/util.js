// lib/util.js
const validateEmail = (email) => {
  if (!email) return false;
  return email.includes('@') && email.includes('.');
};

module.exports = { validateEmail };