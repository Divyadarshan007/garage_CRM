const fs = require('fs');
const buffer = fs.readFileSync('.env');
// Remove all 0x0D (\r) characters
const cleanedBuffer = buffer.filter(b => b !== 0x0D);
fs.writeFileSync('.env', cleanedBuffer);
console.log(".env file has been cleaned of carriage returns.");
