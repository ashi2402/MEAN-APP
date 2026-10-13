const { default: mongoose } = require('mongoose');
const { createEmployeeService,
     getEmployeeService, 
     getEmployees,
      getEmployeesCursor,
       updateEmployeeService,
    deleteEmployeeService } = require('../services/employee.service');


async function createEmployeeController(req, res, next) {
    try {
        const employeeData = req.body;
        const result = await createEmployeeService(employeeData);
        res.status(201).json(result);

    } catch (error) {
        next(error)
    }
};

// async function getEmployeeController (req, res, next) {
//     try {
//         const result = await getEmployeeService();
//         res.status(200).json(result);
//     } catch (error) {
//         next(error)
//     }
// }

async function getEmployyeesControllerWithQuery(req, res, next) {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
    const department = req.query.department;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'asc';
    const allowedSortFields = [
        'name',
        'salary',
        'age',
        'department',
        'createdAt'
    ];

    if (!allowedSortFields.includes(sortBy)) {
        return res.status(400).json({
            error: 'Invalid sortBy parameter'
        });
    }

    if (!['asc', 'desc'].includes(order)) {
        return res.status(400).json({
            error: 'Invalid order parameter'
        });
    }
    if (limit > 100) {
        return res.status(400).json({
            error: "Limit cannot exceed 100"
        });
    }
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ error: "Invalid page parameter" });
    }
    if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({ error: "Invalid limit parameter" });
    }
    try {
        const result = await getEmployees(page, limit, department, search, sortBy, order);

        const totalPages = Math.ceil(result.totalRecords / limit);
        const hasPreviousPage = page > 1;
        const hasNextPage = page < totalPages;
        res.status(200).json(
            {
                currentPage: page,
                limit: limit,
                totalPages: totalPages,
                totalRecords: result.totalRecords,
                employees: result.employees,
                hasPreviousPage: hasPreviousPage,
                hasNextPage: hasNextPage
            });
    } catch (error) {
        next(error)
    }

}

async function getEmployeesCursorController(req, res, next)  {
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if(!Number.isInteger(limit) || limit < 1 || limit > 100){
        return res.status(400).json({ error: "Limit must be an integer between 1 and 100" });   
    }

    try {
        const result = await getEmployeesCursor(limit, req.query.after);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }

}

async function updateEmployeeController(req, res,next){
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({error: "Invalid employee ID"});
            return;
        }

        const result = await updateEmployeeService(id, req.body);
        res.status(200).json(result);
    }catch (error) {
        next(error)
    }
}

async function deleteEmployeeController(req, res, next){
    try {
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id)){
            res.status(400).json({
                 error: 'Invalid employee ID'
            })
        };

        const result = await deleteEmployeeService(id);

        if (!result) {
            return res.status(404).json({
                error: 'Employee not found'
            });
        }
        res.status(200).json({
             message: 'Employee deleted successfully',
            employee: result
        });

    }catch(error){
        next(error)
    }
}

module.exports = { createEmployeeController,
     getEmployyeesControllerWithQuery,
      getEmployeesCursorController,
       updateEmployeeController,
    deleteEmployeeController  };