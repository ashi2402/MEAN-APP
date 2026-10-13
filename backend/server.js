require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('server is running on port 3000');
    });
}).catch((error) => {
    console.log("Error in connection", error);
});





