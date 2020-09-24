const express = require('express');
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

//Express connection
const app = express();
const PORT = 8080;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

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

//VIEW ALL EMPLOYEES (WORKING)
function viewAllEmployees() {
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.department, r.salary, concat(m.first_name, ' ', m.last_name) AS manager 
        FROM employee_tracker_db.employee AS e 
		LEFT JOIN employee_tracker_db.employee AS m ON e.manager_id = m.id 
        JOIN employee_tracker_db.role AS r ON e.role_id = r.id
        JOIN employee_tracker_db.department AS d ON r.department_id = d.id;`,
            function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log("\n");
        //console.table makes the table in the command line and allEmployees is the array at the top of the page 
        console.table(res);
        
        connection.end();
        //go back to inital
        initialQuestion();
    });
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
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"]
        }
    ])
    .then(function(answers) {
        const first_name = answers.first_name;
        const last_name = answers.last_name;
        const role_title = answers.role_title;
        // console.log(answers);

        //IMPORTANT This is going to thow you into another inquirer function to ask for the Managers in MYSQL
        importManagers();
    });
}
// THIS IS PART OF ADD EMPLOYEE, NEED to get managers from mysql (NOT WORKING)
function importManagers() {
    connection.query(`SELECT concat(m.first_name, ' ', m.last_name) 
    FROM employee_tracker_db.employee AS e 
    JOIN employee_tracker_db.employee AS m ON e.manager_id = m.id `, function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
        });
        inquirer
        .prompt([
            {
        type: "list",
        name: "employee_manager",
        message: "Which Manager do you want to set for the Employee? (Null if No manager)" ,
        choices: ["Null", function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].employee);
            }
            return choiceArray;
            }]
        }
])
    .then(function(answers) {
        const employee_manager = answers.employee_manager;
        // console.log(answers);
        //go back to inital
        initialQuestion();
    })
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

