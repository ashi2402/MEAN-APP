const Employee = require('../models/Employee')
const mongoose = require('mongoose');

async function createEmployeeService(employeeData) {
    return await Employee.create(employeeData);
}

async function getEmployeeService() {
    return await Employee.find()
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getEmployees(page, limit, department, search, sortBy, order) {
    const skip = (page - 1) * limit;
    const filter = {};
    const sortOrder = order === 'desc' ? -1 : 1;
    if (department) {
        filter.department = department;
    }

    if (search) {
        filter.name = { $regex: escapeRegex(search), $options: "i" };
    }

    const [employees, totalRecords] = await Promise.all([
        Employee.find(filter).sort({ [sortBy]: sortOrder, _id: 1 }).skip(skip).limit(limit),
        Employee.countDocuments(filter)
    ])
    return { employees, totalRecords };
}

async function getEmployeesCursor(limit, after) {
    const filter = {};
    if (after) {
        if (!mongoose.isValidObjectId(after)) {
            const error = new Error('Invalid cursor value');
            error.status = 400;
            throw error;
        }
        filter._id = { $gt: new mongoose.Types.ObjectId(after) };
    }
    const employees = await Employee.find(filter)
        .sort({ _id: 1 })
        .limit(limit + 1); // Fetch one extra record to determine if there's a next page

    const hasNextPage = employees.length > limit;
    if (hasNextPage) {
        employees.pop(); // Remove the extra record
    }

    const nextCursor = hasNextPage && employees.length ? employees[employees.length - 1]._id.toString() : null;

    return { employees, hasNextPage, nextCursor };
}

async function updateEmployeeService(id, employeeData) {
    return await Employee.findByIdAndUpdate(id, employeeData, { new: true, runValidators: true });
} 

async function deleteEmployeeService(id) {
    return await Employee.findByIdAndDelete(id);
}


module.exports = { createEmployeeService,
     getEmployeeService, getEmployees, 
     getEmployeesCursor, updateEmployeeService,
      deleteEmployeeService };