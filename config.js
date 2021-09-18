module.exports = {
  // 1. MongoDB
  DB_CONNECTION: process.env.DB_CONNECTION,
  //   || 'mongodb://localhost/', move this up if needed

  // 2. JWT
  TOKEN_SECRET:
    process.env.TOKEN_SECRET ||
    '003B041434642E3F9532B1B0C6EC7B943E463FFDC81C13F9BDAC4B3D4A799E8B',

  // 3. Express Server Port
  PORT: process.env.PORT || 3000,
};
