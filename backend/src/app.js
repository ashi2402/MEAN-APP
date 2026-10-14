const express = require('express');
const errorMiddleware = require('./middleware/error.middleware');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  'http://localhost:4200',
  'https://resplendent-daffodil-a41343.netlify.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(
    `[REQUEST] ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin || 'none'}`
  );
  next();
});

app.use(express.json());
const employeeRoute = require('./routes/employee.route');
const authRoute = require('./routes/auth.route');

app.use('/api/employees', employeeRoute);
app.use('/api/auth', authRoute);

app.use(errorMiddleware);
module.exports = app;