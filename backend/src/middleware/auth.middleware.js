

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];  // Extract the token from the header

    try {
        const tokenVerificaion = jwt.verify(token, process.env.JWT_SECRET);
        req.user = tokenVerificaion;
        next();
    }catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

module.exports = authMiddleware;