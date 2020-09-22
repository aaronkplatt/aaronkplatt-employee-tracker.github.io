const { doesNotMatch } = require('assert');
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
// const node = require('node');

//MY SQL SERVER CONNECTION
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "employee_tracker_db"
});
//CONNECTION
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

//THIS IS THE 1ST THING THAT WHILL HAPPEN WHEN THE APPLICATION IS RUN
initialQuestion();
function initialQuestion() {
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "list",
            name: "initialQuestion",
            message: "What would you like to do?",
            choices: ["View All Employees", /*"View All Employees By Department",*/ /*"View All Employees By Manager",*/ "Add Employee", /*"Remove Employee",*/ /*"Update Employee Role",*/ /*"Update Employee Manager"*/]
        }
    ])
    .then(function(answers) {
        const initialQuestion = answers.initialQuestion;
        if (initialQuestion === "View All Employees") {
            viewAllEmployees();
        }
        else if (initialQuestion === "View All Employees By Department") {
            viewAllEmployeesDepartment();
        }
        else if (initialQuestion === "View All Employees By Manager") {
            viewAllEmployeesManager();
        }  
        else if (initialQuestion === "Add Employee") {
            addEmployee();
        }  
        else if (initialQuestion === "Remove Employee") {
            removeEmployee();
        }  
        else if (initialQuestion === "Update Employee Role") {
            updateEmployeeRole();
        }  
        else if (initialQuestion === "Update Employee Manager") {
            updateEmployeeManager();
        } 
    });
}    

//VIEW ALL EMPLOYEES
function viewAllEmployees() {
    console.log("generating code... \n");
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, r.salary 
        FROM employee_tracker_db.employee AS E 
        JOIN employee_tracker_db.role AS R ON E.role_id = R.id;`,
        // 'SELECT * FROM employee',
        //connection.query(
         function(err, res) {
         if (err) throw err;
      // Log all results of the SELECT statement
        console.table(res);
        // console.table(['id', 'first_name', 'last_name', 'title', 'department', 'salary', 'manager'], res);
        connection.end();
    });
    //console.table makes the table in the command line and allEmployees is the array at the top of the page 
    //go back to inital
    initialQuestion();
} 

//VIEW ALL EMPLOYEES BY DEPARTMENT
function viewAllEmployeesDepartment() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//VIEW ALL EMPLOYEES BY MANAGER
function viewAllEmployeesManager() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//ADD EMPLOYEE
function addEmployee() {
    console.log("working");
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "input",
            name: "first_name",
            message: "What is this Employee's First Name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is this Employee's Last Name?"
        },
        {
            type: "list",
            name: "role_title",
            message: "What is this Employee's role?",
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"]
        },
        {
            type: "list",
            name: "employee_manager",
            message: "Which Employee do you want to set as Manager for the Employee?",
            choices: ["None", /*allEmployees.first_name*/]
        }
    ])
    .then(function(answers) {
        const first_name = answers.first_name;
        const last_name = answers.last_name;
        const role_title = answers.role_title;
        const employee_manager = answers.employee_manager;
        // console.log(answers);
        initialQuestion();
    });
    //go back to inital
}

//REMOVE EMPLOYEE
function removeEmployee() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//UPDATE EMPLOYEE MANAGER
function updateEmployeeManager() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

