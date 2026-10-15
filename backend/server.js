console.log('DEPLOY CHECK: server.js version 1734eba');

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const rawPort = process.env.PORT;

console.log('DEPLOY CHECK: raw PORT =', JSON.stringify(rawPort));
console.log('DEPLOY CHECK: PORT type =', typeof rawPort);

const PORT = rawPort || 3000;

console.log('DEPLOY CHECK: resolved PORT =', JSON.stringify(PORT));

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });