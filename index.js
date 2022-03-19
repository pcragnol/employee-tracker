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
  return inquirer.prompt(
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
  .then((answer) => {
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
    }
  });
};

// const viewAllDepartments = () => {
//   const sql = 'SELECT * FROM department;';
//   db.query(sql, (err, result) => {
//     console.table(result);
//     promptUser();
//   });
// };

const viewAllDepartments = () => {
  db.query('SELECT * FROM department;');
};

const addDepartment = () => {
  return inquirer.prompt(
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
  .then((answer) => {
    const sql = 'INSERT INTO department SET ?';
    db.query(sql, answer.department, (err, result) => {
      console.log(`Added ${answer.department} to departments.`);
      promptUser();
    })
  })
};

const viewAllRoles = () => {
  const sql = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;';
  db.query(sql, (err, result) => {
    console.table(result);
    promptUser();
  });
};

const addRole = () => {
  
};

const viewAllEmployees = () => {
  const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;';
  db.query(sql, (err, result) => {
    console.table(result);
    promptUser();
  });
};

const addEmployee = () => {
  
};

const updateEmployeeRole = () => {
  
};

promptUser();
