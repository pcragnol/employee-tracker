const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

const promptUser = () => {
  inquirer.prompt(
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'Add Department',
        'View All Roles',
        'Add Role',
        'View All Employees',
        'Add Employee',
        'Update Employee Role'
      ]
    }
  )
  .then(answer => {
    switch (answer.menu) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      default:
        process.exit();
    }
  });
};

const viewAllDepartments = () => {
  const sql = 'SELECT * FROM department;';
  db.query(sql, (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.table(result);
    promptUser();
  });
};

const addDepartment = () => {
  inquirer.prompt(
    {
      type: 'input',
      name: 'department',
      message: 'What department would you like to add?',
      validate: validateDepartment => {
        if (validateDepartment) {
          return true;
        } else {
          return 'Please enter the department you would like to add.'
        }
      }
    }
  )
  .then(answer => {
    const sql = 'INSERT INTO department (name) values (?)';
    db.query(sql, answer.department, (err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log(`Added ${answer.department} to departments.`);
      promptUser();
    });
  });
};

const viewAllRoles = () => {
  const sql = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;';
  db.query(sql, (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.table(result);
    promptUser();
  });
};

const addRole = () => {
  db.query('SELECT name, id AS value FROM department;', (err, result) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to add a role to?',
        choices: result
      },
      {
        type: 'input',
        name: 'role',
        message: 'What role would you like to add?',
        validate: validateRole => {
          if (validateRole) {
            return true;
          } else {
            return 'Please enter the role you would like to add.'
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for the new role?',
        validate: validateSalary => {
          if (typeof Number(validateSalary) === 'number' && validateSalary > 0) {
            return true;
          } else {
            return 'Please enter a salary greater than 0.'
          }
        }
      }
    ])
    .then(answers => {
      const sql = 'INSERT INTO role (title, salary, department_id) values (?, ?, ?)';
      db.query(sql, [answers.role, answers.salary, answers.department], (err, result) => {
        if (err) {
          return console.error(err);
        }
        console.log(`Added ${answers.role} to roles.`);
        promptUser();
      });
    });
  });
};

const viewAllEmployees = () => {
  const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;';
  db.query(sql, (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.table(result);
    promptUser();
  });
};

const addEmployee = () => {
  db.query('SELECT title, id AS value FROM role;', (err, result) => {
    // db.query('SELECT CONCAT(manager.first_name, " ", manager.last_name) AS manager, id as value FROM employee;', (err, result2) => {
    db.query('SELECT title, id AS value FROM role;', (err, result2) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the new employee's first name?",
          validate: validateFirstName => {
            if (validateFirstName) {
              return true;
            } else {
              return "Please enter the new employee's first name."
            }
          }
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the new employee's last name?",
          validate: validateLastName => {
            if (validateLastName) {
              return true;
            } else {
              return "Please enter the new employee's last name."
            }
          }
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the new employee's role?",
          choices: result
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the new employee's manager?",
          choices: result2
        }
      ])
      .then(answers => {
        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)';
        db.query(sql, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
          if (err) {
            return console.error(err);
          }
          console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
          promptUser();
        });
      });
    });
  });
};

const updateEmployeeRole = () => {
  
};

promptUser();
