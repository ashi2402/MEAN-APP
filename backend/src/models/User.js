const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        minlength: 6,
        
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
     refreshTokenHash: {
        type: String,
    },
    refreshTokenExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);