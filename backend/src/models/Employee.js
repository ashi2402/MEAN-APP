
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    role: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

employeeSchema.index({ department: 1 });
employeeSchema.index({ salary: 1 });
employeeSchema.index({ department: 1, salary: 1 });
module.exports = mongoose.model('Employee', employeeSchema);