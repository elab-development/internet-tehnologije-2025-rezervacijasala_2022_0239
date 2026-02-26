const validateEmail = (email) => {
  if (!email) return false;
  return email.includes('@') && email.includes('.');
};

const validateRoomCapacity = (capacity) => {
  const cap = parseInt(capacity);
  return !isNaN(cap) && cap > 0 && cap <= 100; // Primer: od 1 do 100 mesta
};

module.exports = { validateEmail, validateRoomCapacity };