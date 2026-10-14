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
app.use((req, res, next) => {
  const requestId = Date.now().toString(36);

  console.log('[REQUEST START]', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    contentType: req.headers['content-type']
  });

  res.setHeader('X-Debug-Request-Id', requestId);
  next();
});

app.use(express.json());
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    console.error('Malformed JSON:', {
      method: req.method,
      url: req.originalUrl,
      body: err.body
    });

    return res.status(400).json({
      message: 'Invalid JSON request body'
    });
  }

  next(err);
});
const employeeRoute = require('./routes/employee.route');
const authRoute = require('./routes/auth.route');

app.use('/api/employees', employeeRoute);
app.use('/api/auth', authRoute);

app.use(errorMiddleware);
module.exports = app;