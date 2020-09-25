const express = require('express');
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

//Express connection
const app = express();
const PORT = 3306;

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

//EMPTY OBJECTS with ID's
let employeeListArray = {}; // havent used yet
let managerListArray = {}; //havent used yet
let roleListArray = {}; // havent used yet
let departmentListArray = {}; // havent used yet

//EMPTY ARRAYS
let importEmployeeArray = []; //havent used yet
let importManagersArray = ["Null"]; //NULL IF NO MANAGER
let importRoleArray = [] //havent used yet
let importDepartmentArray = []; //havent used yet


//THIS IS THE 1ST THING THAT WILL HAPPEN WHEN THE APPLICATION IS STARTED (NOT FULLY WORKING)
initialQuestion();
function initialQuestion() {
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "list",
            name: "initialQuestion",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", /*"Remove Employee",*/ /*"Update Employee Role",*/ /*"Update Employee Manager"*/]
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
        //go back to inital
        initialQuestion();
    });
} 

//VIEW ALL EMPLOYEES BY DEPARTMENT (WORKING)
function viewAllEmployeesDepartment() {
    let importDepartmentArray = []; //MAKING IT 0 so they dont duplicate
    connection.query(`SELECT department FROM employee_tracker_db.department;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            importDepartmentArray.push(`${row.department}`)
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "viewAllEmployeesDepartment",
                message: "From which department would you like to see the Employees?",
                choices: importDepartmentArray
            }
        ])
        .then(function(answers) {
            const viewAllEmployeesDepartment = answers.viewAllEmployeesDepartment;
            connection.query(
                `SELECT concat(e.first_name, ' ', e.last_name) AS name, d.department 
                FROM employee_tracker_db.employee AS e
                JOIN employee_tracker_db.role AS r ON e.role_id = r.id
                JOIN employee_tracker_db.department AS d ON r.department_id = d.id
                WHERE department = "${viewAllEmployeesDepartment}"`,
                function(err, res) {
                    if (err) throw err;
                    console.log("\n");
                    // Log all results of the SELECT statement
                    console.table(res);
                    //go back to inital
                    initialQuestion();
                });
            });
        });
}

//VIEW ALL EMPLOYEES BY MANAGER (WORKING)
function viewAllEmployeesManager() {
    // IMPORT MANAGER
    let importManagersArray = ["Null"];
    connection.query(`SELECT concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            importManagersArray.push(`${row.NAME}`)
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "viewAllEmployeesManager",
                message: "Which Manager would you like to view?",
                choices: importManagersArray
            }
        ])
        .then(function(answers) {
            const viewAllEmployeesManager = answers.viewAllEmployeesManager
            console.log(viewAllEmployeesManager);
            connection.query(`SELECT e.first_name, e.last_name, concat(m.first_name, ' ', m.last_name) AS manager 
            FROM employee_tracker_db.employee AS e 
            LEFT JOIN employee_tracker_db.employee AS m ON e.manager_id = m.id 
            JOIN employee_tracker_db.role AS r ON e.role_id = r.id
            JOIN employee_tracker_db.department AS d ON r.department_id = d.id
            WHERE concat(m.first_name, ' ', m.last_name) = "${viewAllEmployeesManager}";`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
                // Log all results of the SELECT statement
                console.table(res);
                //go back to inital
                initialQuestion();
            });
            //go back to inital
        });
    });
}

//ADD EMPLOYEE (NOT WORKING)
function addEmployee() {
    let importManagersArray = ["Null"];
    let importRoleArray = [];
    connection.query(`SELECT concat(first_name, ' ', last_name) AS NAME, r.title AS ROLE
    FROM employee_tracker_db.employee AS e
    JOIN employee_tracker_db.role AS r ON e.role_id = r.id`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            importManagersArray.push(`${row.NAME}`)
            importRoleArray.push(`${row.ROLE}`)
        });
        inquirer
        .prompt([
            //WHAT WOULD YOU LIKE TO DO? (initialQuestion) //import role!, 
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
                choices: importRoleArray
            },
            {
                type: "list",
                name: "employee_manager",
                message: "Which Manager do you want to set for the Employee? (Null if No manager)",
                choices: importManagersArray 
            }
        ])
        .then(function(answers) {
            first_name = answers.first_name,
            last_name = answers.last_name,
            role_title = answers.role_title,
            employee_manager = answers.employee_manager,
            connection.query(`INSERT INTO employee_tracker_db.employee (first_name,last_name,role_id,manager_id)
            VALUES ("${first_name}","${last_name}",3,4)`,//DAD WILL HELP 
            
                function(err) {
                    if(err) throw err;
                    
                    console.log("EMPLOYEE ADDED!")
                    initialQuestion();
                }
            );
        });
    });
}

//REMOVE EMPLOYEE (havent started)
function removeEmployee() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//UPDATE EMPLOYEE ROLE (havent started)
function updateEmployeeRole() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

//UPDATE EMPLOYEE MANAGER (havent started)
function updateEmployeeManager() {
    console.log("working");
    //go back to inital
    initialQuestion();
}

