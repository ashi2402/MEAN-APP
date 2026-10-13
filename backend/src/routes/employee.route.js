
const express = require('express');

const {
  createEmployeeController,
  getEmployyeesControllerWithQuery,
  getEmployeesCursorController,
  updateEmployeeController,
  deleteEmployeeController
} = require('../controllers/employee.controller');

const route = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

route.post('/', authMiddleware, createEmployeeController);
route.get('/', authMiddleware, getEmployyeesControllerWithQuery);
route.get('/cursor', authMiddleware, getEmployeesCursorController);
route.put('/:id', authMiddleware, updateEmployeeController);
route.delete('/:id', authMiddleware, deleteEmployeeController);

module.exports = route;