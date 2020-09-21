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
            message: "What is this team-members role?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
        },
    ])
    .then(function(answers) {
        const initialQuestion = answers.initialQuestion;
        if (initialQuestion === "View All Employees") {
            viewAllEmployees();
        }
        else if (initialQuestion === "View All Employees By Department") {
            //View All Employees By Department
        }
        else if (initialQuestion === "View All Employees By Manager") {
            //View All Employees By Manager
        }  
        else if (initialQuestion === "Add Employee") {
            //Add Employee
        }  
        else if (initialQuestion === "Remove Employee") {
            //Remove Employee
        }  
        else if (initialQuestion === "Update Employee Role") {
            //Update Employee Role
        }  
        else if (initialQuestion === "Update Employee Manager") {
            //Update Employee Manager
        }  
    });
}    
function viewAllEmployees() {
    //console.table makes the table in the command line and allEmployees is the array at the top of the page 
    console.table(['id', 'first_name', 'last_name', 'title', 'department', 'salary', 'manager'], allEmployees);


} 

