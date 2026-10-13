const express = require('express');
const authorize = require('../middleware/authorized.middleware');
const {registerUserController, loginUserController, refreshAccessTokenController, logoutUserController} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const route = express.Router();

route.post('/register', registerUserController);
route.post('/login', loginUserController);
route.post('/refresh', refreshAccessTokenController);
route.post('/logout', authMiddleware, logoutUserController);

route.get('/admin-test', authMiddleware, authorize('admin'), (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
});

module.exports = route;