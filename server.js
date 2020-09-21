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

//Make allEmployees an array
let allEmployees = [
    [1, "Aaron", "Platt", "Web Developer", "Engineering", 100000, "Ken Platt"],
    [2, "Conner", "Platt", "Sales", "Finance", 80000, "Ken Platt"]
];


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
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
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
    //console.table makes the table in the command line and allEmployees is the array at the top of the page 
    console.table(['id', 'first_name', 'last_name', 'title', 'department', 'salary', 'manager'], allEmployees);
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
            message: "What is this Employee's First Name?",
        }
    ])
    .then(function(answers) {
        const first_name = answers.first_name;
        console.log(first_name);
    });
    //go back to inital
    // initialQuestion();
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

