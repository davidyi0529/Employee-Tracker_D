const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err)
      throw err;
      console.log(chalk.blueBright.bold(`=============================================================================================================`));
      console.log('');
      console.log(chalk.greenBright.bold(figlet.textSync('Employee - Tracker _ D')));
      console.log('');
      console.log(`                                                          ` + chalk.blueBright.bold('Created By: David Yi'));
      console.log('');
      console.log(chalk.blueBright.bold(`=============================================================================================================`));
    start();
  });

function start() { 
    inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "start",
      choices: ["View Employees","View Departments","View Roles","Add Employee","Add Department","Add Role","Update Employee Role","Remove Employee","Exit"]
    })
    .then(function(res) {
        switch (res.start) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Departments":
                viewDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Exit":
                connection.end();
                break;
        };
    });
};

function viewEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id ASC", 
    function(err,res) {
      if(err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employees:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        start();
    });
};

function viewDepartment() {
    connection.query(`SELECT * FROM  department`, function(err,res) {
      if(err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`All Departments:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        start();
    });
};


function viewRoles() {
    connection.query(`SELECT role.id, title, name, salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY id ASC`, function(err,res) {
      if(err) throw err;
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
        console.log(chalk.blueBright.bold(`====================================================================================`));
        console.table(res);
        console.log(chalk.blueBright.bold(`====================================================================================`));
        start();
    });
};

function addEmployee() {
    connection.query("SELECT * FROM employee", function(err, responseEmp) {
      if (err) throw err;
      connection.query("SELECT * FROM role", function(err, responseRole) {
      if (err) throw err;
      inquirer.prompt([{
        type: "input",
        message: "Enter the first name:",
        name: "firstname"
      }, {
        type: "input",
        message: "Enter the last name:",
        name: "lastname"
      }, {
        type: "list",
        message: "What is the employee role?",
        name: "roleID",
        choices: function() {
            var roleArray = [];
            for (var i = 0; i < responseRole.length; i++) {
             roleArray.push(responseRole[i].title);
            }
            return roleArray;
        }}, {
            type: "list",
            message: "Choose the employee Manager:",
            name: "managerID",
            choices: function() {
                var managers = [];
                for (var i=0; i < responseEmp.length; i++) {
                    if (responseEmp[i].manager_id === null) {
                    managers.push(`${responseEmp[i].first_name} ${responseEmp[i].last_name}`);
                }};
                    managers.push("None")
                    return managers;
            }}
        ])
            .then(function(res) {
                var chosenRole;
                for (var i = 0; i < responseRole.length; i++) {
                    if (responseRole[i].title === res.roleID) {
                    chosenRole = responseRole[i].id;
                    }
                }
                var chosenMngr;
                for (var i = 0; i < responseEmp.length; i++) {
                    if (`${responseEmp[i].first_name} ${responseEmp[i].last_name}` === res.managerID) {
                    chosenMngr = responseEmp[i].id;
                    } else if (res.managerID === "None") {
                        chosenMngr = null
                    }
                }
        connection.query("INSERT INTO employee SET ?", {
            first_name: res.firstname,
            last_name: res.lastname,
            role_id: chosenRole,
            manager_id: chosenMngr
          });
            console.log(chalk.redBright.bold(`====================================================================================`));
            console.log(`                              ` + chalk.green.bold(`Employee Successfully Added`));
            console.log(chalk.redBright.bold(`====================================================================================`));
            start();
        });
    });
    });
  };

function addDepartment() {
    inquirer.prompt({
      type: "input",
      message: "What is the name of the new department?",
      name: "newDepartment"
    })
    .then(function(res) {
        connection.query("INSERT INTO department SET ?", {
          name: res.newDepartment
        });
        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Department Successfully Added`));
        console.log(chalk.redBright.bold(`====================================================================================`));
  
        start();
      });
  };

function addRole() {
    connection.query("SELECT * FROM department", function(err, response) {
      if (err) throw err;
      inquirer.prompt([{
        type: "input",
        message: "What is the name of the new employee role?",
        name: "newTitle"
        }, {
        type: "input",
        message: "How much is the salary of the new role?",
        name: "newSalary"
        }, {
        type: "list",
        message: "In which department is the new role?",
        name: "dept",
        choices: function() {
          var deptArray = [];
          for (var i = 0; i < response.length; i++) {
            deptArray.push(response[i].name);
          }
          return deptArray;
        }}
    ])
    .then(function(res) {
       var chosenDept;
       for (var i = 0; i < response.length; i++) {
        if (response[i].name === res.dept) {
          chosenDept = response[i].id;
        }
      }
        connection.query("INSERT INTO role SET ?", {
          title: res.newTitle,
          salary: res.newSalary,
          department_id: chosenDept
        });
        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Role Successfully Added`));
        console.log(chalk.redBright.bold(`====================================================================================`));
        start();
      });
    });
  };

function updateEmployee() {
    connection.query("SELECT * FROM employee", function(err,responseEmp) {
      if (err) throw err;
      connection.query("SELECT * FROM role", function(err,responseRole) {
        if (err) throw err;
      inquirer.prompt([{
          type: "list",
          message: "Which employee would you like to update?",
          name: "chooseEmployee",
          choices: function() {
            var employeeArray = [];
            for (var i = 0; i < responseEmp.length; i++) {
              employeeArray.push(`${responseEmp[i].first_name} ${responseEmp[i].last_name}`);
            }
            return employeeArray;
          }}, {
            type: "list",
            message: "What is the new employee role?",
            name: "updateRole",
            choices: function() {
              var roleArray = [];
              for (var i = 0; i < responseRole.length; i++) {
                roleArray.push(responseRole[i].title);
              }
              return roleArray;
            }
          }
       ])
        .then(function(res) {
          let name = res.chooseEmployee.split(" ");
          let first = name[0];
          let last = name[1];
          var upRole;
            for (var i = 0; i < responseRole.length; i++) {
                if (responseRole[i].title === res.updateRole) {
                upRole = responseRole[i].id;
          }
        }
          connection.query("UPDATE employee SET ? WHERE ? AND ?", [ {
                role_id: upRole
              }, {
                first_name: first
              }, {
                last_name: last
              }],
            function (err, res) {
              if (err) throw err;
                console.log(chalk.blueBright.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(chalk.blueBright.bold(`====================================================================================`));
              start();
              return res;
            });
        });   
      });
    });
  };

function removeEmployee() {
    connection.query("SELECT * FROM employee;", 
        function (err,res) {
            if (err) throw err;
        inquirer.prompt([ {
            type: "list",
            message: "Choose the employee you want to remove?:",
            name: "chooseEmp",
            choices: function() {
                var employeeArray = [];
              for (var i = 0; i < res.length; i++) {
                employeeArray.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return employeeArray;
            }},
         ])
        .then(function(res) {
          let name = res.chooseEmp.split(" ");
          let first = name[0];
          let last = name[1];
    
          connection.query("DELETE FROM employee WHERE ? AND ?;", [ {
                first_name: first
              }, {
                last_name: last
              }],
            function (err, res) {
                if (err) throw err;
                console.log(chalk.redBright.bold(`====================================================================================`));
                console.log(`                              ` + chalk.redBright.bold(`Employee Successfully Removed`));
                console.log(chalk.redBright.bold(`====================================================================================`));
                start();
              return res;
            });
        }); 
      });
    };