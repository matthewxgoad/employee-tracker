require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS,
});



const start = async () => {
    await inquirer
        .prompt({
            name: 'initialPrompt',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Add an employee.', 'Add a role.', 'Add a department.', 'View employees.', 
                    'View roles.', 'View departments.', 'Update employee role.', 'EXIT'],
        })
        .then( async (selection) => {
            switch (selection.initialPrompt) {
                case 'Add an employee.':
                    await addEmployee();
                    break;
                case 'Add a role.':
                    await addRole();
                    break;
                case 'Add a department.':
                    await addDepartment();
                    break; 
                case 'View employees.':
                    await viewEmployees();
                    break;
                case 'View roles.':
                    await viewRoles();
                    break;
                case 'View departments.':
                    await viewDepartments();
                    break; 
                case 'Update employee role.':
                    await updateEmployeeRole();
                    break;
                case 'EXIT':
                    console.log('Goodbye!');
                    connection.end();
            }
        })
};






connection.connect((err) => {
    if(err) throw err;
    console.log("Connected at " + connection.threadId + "\n");
    start();
});