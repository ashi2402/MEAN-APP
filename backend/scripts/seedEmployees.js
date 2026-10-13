
require('dotenv').config({ path: 
    require('path').resolve(__dirname, '../.env')
 });

const connectDB = require('../src/config/db');
const Employee = require('../src/models/Employee');

async function seedEmployees() {
    try {
        await connectDB();


        const existingCount = await Employee.countDocuments();
        const recordsAdd = Math.max(0, 100 - existingCount);

        if (recordsAdd === 0) {
            console.log('No new employees to add. Database already has 100 or more employees.');
            return;
        }

        const departments = [
            'Engineering',
            'Medical',
            'Sales',
            'HR',
            'Finance'
        ];

        const roles = [
            'Developer',
            'Manager',
            'Analyst',
            'Tester',
            'Team Lead'
        ];

        const employees = Array.from(
            { length: recordsAdd },
            (_, index) => {
                return {
                    name: `Test Employee ${Date.now()}-${index}`,
                    email: `test.employee.${Date.now()}-${index}@example.com`,
                    department: departments[index % departments.length],
                    age: 22 + (index % 30),
                    role: roles[index % roles.length],
                    salary: 30000 + (index % 10) * 5000,
                    active: true
                };
            }
        );

        await Employee.insertMany(employees);
        const totalCount = await Employee.countDocuments();
        console.log(`Total employees in the database: ${totalCount}`);

    } catch (error) {
        console.error('Error seeding employees:', error);
        process.exit(1);
    } finally {
        await Employee.db.close();
    }
}

seedEmployees();