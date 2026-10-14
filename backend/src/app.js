
const express = require('express');
const errorMiddleware = require('./middleware/error.middleware');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://resplendent-daffodil-a41343.netlify.app'
];

// 1. CORS must run before the routes and JSON parser.
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('[RESPONSE]', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      origin: req.headers.origin,
      allowOrigin: res.getHeader('Access-Control-Allow-Origin')
    });
  });

  next();
});

// 2. Log request metadata and assign a request ID.
app.use((req, res, next) => {
  const requestId = Date.now().toString(36);

  req.requestId = requestId;
  res.setHeader('X-Debug-Request-Id', requestId);

  console.log('[REQUEST START]', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length']
  });

  next();
});

// 3. Temporarily log the raw body before JSON parsing.
app.use(express.json({
  verify: (req, res, buffer) => {
    console.log('[RAW BODY]', {
      requestId: req.requestId,
      body: buffer.toString('utf8')
    });
  }
}));

// 4. Handle malformed JSON.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    console.error('[MALFORMED JSON]', {
      requestId: req.requestId,
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

// 5. Routes.
const employeeRoute = require('./routes/employee.route');
const authRoute = require('./routes/auth.route');

app.use('/api/employees', employeeRoute);
app.use('/api/auth', authRoute);

// 6. General error middleware.
app.use(errorMiddleware);

module.exports = app;
