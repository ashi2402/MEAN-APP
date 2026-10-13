
const { registerUser, loginUser, refreshAccessToken, logoutUser } = require('../services/auth.service');

async function registerUserController(req, res, next) {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        await registerUser(email, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
}

async function loginUserController(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}


async function refreshAccessTokenController(req, res, next) {
    try{
        const { refreshToken } = req.body;
        if(!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        const result = await refreshAccessToken(refreshToken);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}


async function logoutUserController(req, res, next) {
    try {
            const user_id = req.user._id;
            await logoutUser(user_id);
            res.status(200).json({ message: 'User logged out successfully' });
        
    }catch(error) {
        next(error);
    }

}


module.exports = { registerUserController, loginUserController, refreshAccessTokenController, logoutUserController };