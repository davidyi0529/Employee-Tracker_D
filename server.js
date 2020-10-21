const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
require('console.table');

const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewAllDepartments: "View All Departments",
    viewByManager: "View All Employees By Manager",
    viewAllRoles: "View All Roles",
    addEmployee: "Add An Employee",
    addDepartment: "Add A Department",
    addRole: "Add A Role",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee Role",
    exit: "Exit"
};

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees'
});

connection.connect(err => {
    if (err) throw err;
    console.log(chalk.blueBright.bold(`=============================================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee - Tracker _ D')));
    console.log(``);
    console.log(`                                                          ` + chalk.blueBright.bold('Created By: David Yi'));
    console.log(``);
    console.log(chalk.blueBright.bold(`=============================================================================================================`));
    prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                promptMessages.viewAllEmployees,
                promptMessages.viewAllDepartments,
                promptMessages.viewByManager,
                promptMessages.viewAllRoles,
                promptMessages.addEmployee,
                promptMessages.addDepartment,
                promptMessages.addRole,
                promptMessages.removeEmployee,
                promptMessages.updateRole,
                promptMessages.exit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case promptMessages.viewAllDepartments:
                    viewAllDepartments();
                    break;

                case promptMessages.viewByManager:
                    viewByManager();
                    break;
                
                case promptMessages.viewAllRoles:
                    viewAllRoles();
                    break;

                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                case promptMessages.addDepartment:
                    addDepartment();
                    break;
               
                case promptMessages.addRole:
                    addRole();
                    break;

                case promptMessages.removeEmployee:
                    remove('delete');
                    break;

                case promptMessages.updateRole:
                    updateRole();
                    break;

                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employees:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        prompt();
    });
}

function viewAllDepartments() {
    const query = `SELECT * from department;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`All Departments:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        prompt();
    });
}

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Employees by Manager:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        prompt();
    });
}

function viewAllRoles() {
    const query = `SELECT * from role;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        prompt();
    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            // console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                    (err, res) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    console.log(`                              ` + chalk.green.bold(`Employee Successfully Added`));
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    prompt();

                }
            );
        });
    });

}

async function addDepartment() {

    await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?  "
        }
        ])
            .then(function (response) {
                addDepartment(response);
            })
        
            function addDepartment(data) {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: data.name
                },
                    (err, res) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    console.log(`                              ` + chalk.green.bold(`Department Successfully Added`));
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    prompt();
                }
            )}

};

async function addRole() {

    await inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the new employee role?  "
        },
        {
            name: "salary",
            type: "input",
            message: "How much is the salary of the new role?  "
        },
        {
            name: "id",
            type: "list",
            message: "In which department is the new role?  ",
            choices: showDepartments 
        }
        ])
            .then(function (response) {
                addRole(response);
            })
        
            function addRole(data) {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: data.title,
                    salary: data.salary,
                    department_id: data.id
                },
                    (err, res) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    console.log(`                              ` + chalk.green.bold(`Role Successfully Added`));
                    console.log(chalk.redBright.bold(`====================================================================================`));
                    prompt();
                }
            )}

};

function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateRole();
        else viewAllEmployees();

    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
            console.log(chalk.redBright.bold(`====================================================================================`));
            console.log(`                              ` + chalk.redBright.bold(`Employee Successfully Removed`));
            console.log(chalk.redBright.bold(`====================================================================================`));
            prompt();
        }
    )

};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee ID?:  "
        }
    ]);
}


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
                console.log(chalk.blueBright.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(chalk.blueBright.bold(`====================================================================================`));
            prompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}

var showDepartments;

connection.query('SELECT * from department', (err, res) => {
    showDepartments = res.map(dep => ({ name: dep.name, value: dep.id }));
});