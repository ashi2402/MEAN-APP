
const express = require('express');
const path = require('path');
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

app.use(express.json());

// Routes
const employeeRoute = require('./routes/employee.route');
const authRoute = require('./routes/auth.route');

app.use('/api/employees', employeeRoute);
app.use('/api/auth', authRoute);

// Serve Angular production build
const frontendPath = path.join(
  __dirname,
  '../../employee-management-ui/dist/employee-management-ui/browser'
);

const fs = require('fs');

console.log('[FRONTEND PATH]', frontendPath);
console.log('[FRONTEND EXISTS]', fs.existsSync(frontendPath));
console.log(
  '[INDEX EXISTS]',
  fs.existsSync(path.join(frontendPath, 'index.html'))
);

app.use(express.static(frontendPath));

// Angular SPA fallback.
// API requests must not receive index.html.
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

// General error middleware must remain last.
app.use(errorMiddleware);

module.exports = app;
