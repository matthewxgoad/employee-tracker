require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS,
    database: 'employee_db'
});

const start = async () => {
    await inquirer
        .prompt({
            name: 'initialPrompt',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Add an employee.', 'Add a role.', 'Add a department.', 'View employees.',
                'View employees by role.', 'View employees by department.', 'Update employee role.', 'EXIT'],
        })
        .then(async (selection) => {
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
                case 'View employees by role.':
                    await viewRoles();
                    break;
                case 'View employees by department.':
                    await viewDepartments();
                    break;
                case 'Update employee role.':
                    await updateEmployeeRole();
                    break;
                case 'EXIT':
                    console.log('\nGoodbye!\n');
                    connection.end();
            }
        })
};

// HELPER FUNCTIONS

const getDepartmentNames = async () => {
    return new Promise(async (resolve, reject) => {
        let array = [];
        connection.query('SELECT name FROM department;', (err, res) => {
            if (err) throw err;
            array = res.map(({name}) => name);
            resolve(array)
        })
    })
};
const getRoleNames = async () => {
    return new Promise(async (resolve, reject) => {
        let array = [];
        connection.query('SELECT title FROM role;', (err, res) => {
            if (err) throw err;
            array = res.map(({title}) => title);
            resolve(array)
        })
    })
};
const getRoleId = async (role) => {
    return new Promise(async (resolve, reject) => {
        connection.query(`SELECT id FROM role WHERE title = "${role.title}";`, (err, res) => {
            if (err) throw err;
            resolve(res[0].id);
        })
    })
}
const getDepartmentId = async (title) => {
    return new Promise(async (resolve, reject) => {
        connection.query(`SELECT id FROM department WHERE name = "${title.departmentId}"`, (err, res) => {
            if (err) throw err;
            resolve(res[0].id);
        })
    })
};
const getEmployeeId = async (employee) => {
    return new Promise(async (resolve, reject) => {
        let employeeName = employee.employeeName.split(" ");
        connection.query(`SELECT id FROM employee WHERE first_name = "${employeeName[0]}" AND last_name = "${employeeName[1]}";`, (err, res) => {
            if (err) throw err;
            resolve(res[0].id);
        })
    })
};
const getEmployeeNames = async () => {
    return new Promise(async (resolve, reject) => {
        let array = [];
        connection.query(`SELECT CONCAT (first_name, " ", last_name) AS employee FROM employee ;`, (err, res) => {
            if(err) throw err;
            array = res.map(({employee}) => employee);
            resolve (array)
        })
    })
};

// ADD ENTRIES

const addEmployee = async () => {
    new Promise(async (resolve, reject) => {
        let managersArray = await getEmployeeNames();
        managersArray.push("Does not report to anyone");
        let rolesArray = await getRoleNames();
        inquirer
            .prompt([{
                    name: 'employeeFirstName',
                    type: 'input',
                    message: 'What is the employee first name?',
                },
                {
                    name: 'employeeLastName',
                    type: 'input',
                    message: 'What is the last name?',
                },
                {
                    name: 'title',
                    type: 'list',
                    message: 'What is the employee title?',
                    choices: rolesArray
                },
                {
                    name: 'employeeName',
                    type: 'list',
                    message: 'Who do they report to?',
                    choices: managersArray
                }
            ])
            .then(async (input) => {
                input.title = await getRoleId(input);
                if(input.employeeName = "Does not report to anyone") {
                    input.employeeName = null;
                }else{
                    input.employeeName = await getEmployeeId(input)
                };
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ("${input.employeeFirstName}", "${input.employeeLastName}", ${input.title}, ${input.employeeName});`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    let results = console.log(`\n${input.employeeFirstName} ${input.employeeLastName} has been added!\n`);
                    resolve(results);
                });
                start();
            })    
    })
};

const addDepartment = async () => 
    new Promise(async (resolve, reject) => {
        inquirer
            .prompt({
                name: 'departmentName',
                type: 'input',
                message: 'What is the name of the department?',
            })
            .then(async(input) => {
                connection.query(`INSERT INTO department (name) VALUE ("${input.departmentName}");`, (err,res) => {
                    if(err) throw err;
                    let results = console.log(`\n${input.departmentName} has been added!\n`);
                    resolve (results);
                });
                await start();
            })
    });

const addRole = async () => {
    new Promise(async (resolve, reject) => {
        let departmentsArray = await getDepartmentNames();
        inquirer
            .prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'What is the role title?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?'
                },
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Which department does this role report to?',
                    choices: departmentsArray
                }
            ])
            .then(async (input) => {
                input.departmentId = await getDepartmentId(input);
                const query = `INSERT INTO role (title, salary, department_id) VALUES ("${input.title}", ${input.salary}, ${input.departmentId});`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    let results = console.log(`\n${input.title} has been added!\n`);
                    resolve(results)
                });
                start();
            })
    })
};

// VIEW ELEMENTS

const viewDepartments = async () =>
    new Promise(async (resolve, reject) => {
        let departmentsArray = await getDepartmentNames();
        inquirer
            .prompt({
                name: 'departmentPrompt',
                type: 'list',
                message: 'Which department would you like to see?',
                choices: departmentsArray,
            })
            .then((selection) => {
                const query = `SELECT role.title, CONCAT (employee.first_name, " ", employee.last_name) AS employee
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON department_id = department.id 
                WHERE department.name = "${selection.departmentPrompt}"`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.log('\nDone!\n');
                    const table = console.table(res);
                    resolve(table)
                });
                start();
            })
            
    });

const viewRoles = async () =>
    new Promise(async (resolve, reject) => {
        let rolesArray = await getRoleNames();
        inquirer
            .prompt({
                name: 'rolePrompt',
                type: 'list',
                message: 'Which role would you like to see?',
                choices: rolesArray,
            })
            .then(async(selection) => {
                const query = `SELECT CONCAT (employee.first_name, " ", employee.last_name) AS employee, 
                department.name AS department, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON department_id = department.id 
                LEFT JOIN employee manager on employee.manager_id = manager.id
                WHERE role.title = "${selection.rolePrompt}"`
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.log('\nDone!\n');
                    const table = console.table(res);
                    resolve(table)
                });
                await start();
            })

    });

const viewEmployees = async () =>
    new Promise(async(resolve, reject) => {
        connection.query(`SELECT CONCAT (employee.first_name, " ", employee.last_name) AS employee, 
        role.title, role.salary,department.name AS department, 
        CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
        LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department_id = department.id 
        LEFT JOIN employee manager on employee.manager_id = manager.id`, (err, res) => {
            if (err) throw err;
            console.log('\nDone!\n');
            const table = console.table(res);
            resolve(table)
        });
        start();
    });

// UPDATE ENTRIES

const updateEmployeeRole = async() =>
    new Promise(async(resolve, reject) => {
        let employeesArray = await getEmployeeNames();
        let rolesArray = await getRoleNames();
        inquirer
            .prompt([{
                    name: 'employeeName',
                    type: 'list',
                    message: 'Which employee woud you like to update?',
                    choices: employeesArray
                },
                {
                    name: 'title',
                    type: 'list',
                    message: 'What is their new title?',
                    choices: rolesArray
                }
            ])
            .then(async(input) => {
                input.employeeName = await getEmployeeId(input);
                input.newRole = await getRoleId(input);
                const query = `UPDATE employee SET role_id = ${input.newRole} WHERE id = ${input.employeeName};`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    const results = console.log(`Employee has been updated!\n`);
                    resolve(results)
                });
                start();
            });
    });

// CONNECTION

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected at " + connection.threadId + "\n");
    start();
});