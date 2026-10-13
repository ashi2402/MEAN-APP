
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


async function registerUser(email, password) {

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    const result = await user.save();

    return {
        _id: result._id,
        email: result.email,
        createdAt: result.createdAt,
    }
}

async function loginUser(email, password) {
    const userEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (!userEmail) {
        throw new Error('Invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(password, userEmail.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    userEmail.refreshTokenHash = refreshTokenHash;
    userEmail.refreshTokenExpiresAt = refreshTokenExpiresAt;

    await userEmail.save();
    const payload = {
        _id: userEmail._id,
        role: userEmail.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    return {
        userId: userEmail._id,
        token: token,
        refreshToken: refreshToken
    }
}

async function refreshAccessToken(refreshToken) {
    if(!refreshToken) {
        throw new Error('Refresh token is required');
    }

    const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

    const user = await User.findOne({
        refreshTokenHash,
        refreshTokenExpiresAt: { $gt: new Date() }
    });

    if(!user) {
        throw new Error('Invalid or expired refresh token');
    }

    const newToken = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const updatedRefreshToken = crypto.randomBytes(64).toString('hex');
     const updatedRefreshTokenHash = crypto
        .createHash('sha256')
        .update(updatedRefreshToken)
        .digest('hex');
    const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    user.refreshTokenHash = updatedRefreshTokenHash;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();

    return {
        token: newToken,
        refreshToken: updatedRefreshToken
    }

}

async function logoutUser(id) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    user.refreshTokenHash = undefined;
    user.refreshTokenExpiresAt = undefined;
    await user.save();
}

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };