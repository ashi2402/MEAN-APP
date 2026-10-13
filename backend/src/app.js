const express = require('express');
const errorMiddleware = require('./middleware/error.middleware');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());
const employeeRoute = require('./routes/employee.route');
const authRoute = require('./routes/auth.route');

app.use('/api/employees', employeeRoute);
app.use('/api/auth', authRoute);

app.use(errorMiddleware);
module.exports = app;