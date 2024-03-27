const bcrypt = require('bcrypt');

async function hashString(input) {
  const hashedString = await bcrypt.hash(input, 10);
  return hashedString;
}
async function compareHash(input, hash) {
  const result = bcrypt.compare(input, hash);
  return result;
}
module.exports = { hashString, compareHash };
