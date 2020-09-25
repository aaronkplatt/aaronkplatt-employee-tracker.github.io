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

//THIS IS THE 1ST THING THAT WILL HAPPEN WHEN THE APPLICATION IS STARTED (DONE)
initialQuestion();
function initialQuestion() {
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "list",
            name: "initialQuestion",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Add Department", "Add Role"]
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
        else if (initialQuestion === "Add Department") {
            addDepartment();
        } 
        else if (initialQuestion === "Add Role") {
            addRole();
        } 
    });
}    

//VIEW ALL EMPLOYEES (DONE)
function viewAllEmployees() {
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.department, r.salary, concat(m.first_name, ' ', m.last_name) AS manager 
        FROM employee_tracker_db.employee AS e 
		LEFT JOIN employee_tracker_db.employee AS m ON e.manager_id = m.id 
        JOIN employee_tracker_db.role AS r ON e.role_id = r.id
        JOIN employee_tracker_db.department AS d ON r.department_id = d.id;`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
            //console.table makes the table in the command line and allEmployees is the array at the top of the page 
            console.table(res);
            //go back to inital
            initialQuestion();
    });
} 

//VIEW ALL EMPLOYEES BY DEPARTMENT (DONE)
function viewAllEmployeesDepartment() {
    let importDepartmentArray = []; //MAKING IT 0 so they dont duplicate
    connection.query(`SELECT id, department FROM employee_tracker_db.department;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let departmentObject = {
                name: row.department,
                value: row.id
            }
            importDepartmentArray.push(departmentObject);
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
        .then(answers => {
            const viewAllEmployeesDepartment = answers.viewAllEmployeesDepartment;
            connection.query(
                `SELECT concat(e.first_name, ' ', e.last_name) AS name, d.department 
                FROM employee_tracker_db.employee AS e
                JOIN employee_tracker_db.role AS r ON e.role_id = r.id
                JOIN employee_tracker_db.department AS d ON r.department_id = d.id
                WHERE department_id = "${viewAllEmployeesDepartment}";`,
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

//VIEW ALL EMPLOYEES BY MANAGER (DONE)
function viewAllEmployeesManager() {
    // IMPORT MANAGER
    //Make an object for null and made the ID 0
    let importManagersArray = [{
        name: "null",
        value: 0
    }];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let managerObject = {
                name: row.NAME,
                value: row.id
            }
            importManagersArray.push(managerObject);
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
        .then(answers => {
            const viewAllEmployeesManager = answers.viewAllEmployeesManager
            console.log(viewAllEmployeesManager);
            connection.query(`SELECT e.first_name, e.last_name, concat(m.first_name, ' ', m.last_name) AS manager 
            FROM employee_tracker_db.employee AS e 
            LEFT JOIN employee_tracker_db.employee AS m ON e.manager_id = m.id 
            JOIN employee_tracker_db.role AS r ON e.role_id = r.id
            JOIN employee_tracker_db.department AS d ON r.department_id = d.id
            WHERE m.id = "${viewAllEmployeesManager}";`,
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

//ADD EMPLOYEE (DONE)
function addEmployee() {
    //IMPORT MANAGER
    //Make an object for null and made the ID 0
    let importManagersArray = [{ 
        name: "null", 
        value: 0
    }];
    connection.query(`SELECT e.id AS N_id, concat(e.first_name, ' ', e.last_name) AS NAME
    FROM employee_tracker_db.employee AS e`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let managerObject = { 
                name: row.NAME, 
                value: row.N_id
            }
            importManagersArray.push(managerObject)
        });
    //IMPORT ROLE
    let importRoleArray = [];
    connection.query(`SELECT r.title AS ROLE, r.id AS R_id
    FROM employee_tracker_db.role AS r`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let roleObject = { 
                name: row.ROLE, 
                value: row.R_id
            }
            importRoleArray.push(roleObject)
        });
        inquirer
        .prompt([ 
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
            VALUES ("${first_name}","${last_name}","${role_title}","${employee_manager}")`,
                function(err) {
                    if(err) throw err;
                    console.log("EMPLOYEE ADDED!")
                    initialQuestion();
                }
            );
        });
    });
    });
}

//REMOVE EMPLOYEE (DONE)
function removeEmployee() {
    console.log("\n");
    let importEmployeeArray = [];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let emp = {
                name: row.NAME,
                value: row.id
            };
            importEmployeeArray.push(emp);
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "removeEmployee",
                message: "Which Employee would you like to delete?",
                choices: importEmployeeArray
            }
        ])
        .then(answers => {
            const removeEmployee = answers.removeEmployee
            connection.query(
            `DELETE FROM employee_tracker_db.employee WHERE id = "${removeEmployee}";`,
         function(err, res) {
            if (err) throw err;
            console.log("\n");
            console.log("EMPLOYEE REMOVED!")
            //go back to inital
            initialQuestion();
        });
    });
    });
}

//UPDATE EMPLOYEE ROLE (WORKING)
function updateEmployeeRole() {
    console.log("working");
    // IMPORT Employee's
    let importEmployeeArray = [];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
       if(err) throw err;
       rows.forEach((row) => {
        let employeeObject = {
            name: row.NAME,
            value: row.id
        }
        importEmployeeArray.push(employeeObject);
       });
    //IMPORT ROLE
    let importRoleArray = [];
    connection.query(`SELECT r.title AS ROLE, r.id AS R_id
    FROM employee_tracker_db.role AS r`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let roleObject = {
                name: row.ROLE, 
                value: row.R_id
            }
            importRoleArray.push(roleObject)
        });
        inquirer
        .prompt([
           {
               type: "list",
               name: "viewAllEmployees",
               message: "Which Employee would you like to change the role of?",
               choices: importEmployeeArray
           },
           {
                type: "list",
                name: "role_title",
                message: "What Role would you like to put this Employee?",
                choices: importRoleArray
            }
       ])
       .then(answers => {
        const viewAllEmployees = answers.viewAllEmployees;
        const role_title = answers.role_title;
        connection.query(
            `UPDATE employee_tracker_db.employee SET role_id = "${role_title}" WHERE id = "${viewAllEmployees}"`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
                console.log("EMPLOYEE UPDATED!")
                //go back to inital
                initialQuestion();
            });
        });
    });
    });
}

//UPDATE EMPLOYEE MANAGER (DONE)
function updateEmployeeManager() {
    // IMPORT Employee's
    let importEmployeeArray = [];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
       if(err) throw err;
       rows.forEach((row) => {
        let employeeObject = {
            name: row.NAME,
            value: row.id
        }
        importEmployeeArray.push(employeeObject);
       });
    // IMPORT Manager's
    let importManagerArray = [{
        name: "null",
        value: 0
    }];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS NAME FROM employee_tracker_db.employee`, (err,rows) => {
       if(err) throw err;
       rows.forEach((row) => {
        let managerObject = {
            name: row.NAME,
            value: row.id
        }
        importManagerArray.push(managerObject);
       });
       inquirer
       .prompt([
           {
               type: "list",
               name: "viewAllEmployees",
               message: "Which Employee would you like to change the Manager of?",
               choices: importEmployeeArray
           },
           {
                type: "list",
                name: "managerChose",
                message: "Which Manager do you want to set to this Employee?",
                choices: importManagerArray
            }
       ])
       .then(answers => {
        const viewAllEmployees = answers.viewAllEmployees;
        const managerChose = answers.managerChose;
        //IF USER CHOOSES THE SAME NAME FOR BOTH QUESTIONS, SEND USER TO INITIAL
        if (viewAllEmployees == managerChose) {
            console.log("YOU CAN'T CHOSE THE SAME PERSON. SORRY TRY AGAIN!")
            //go back to inital
            initialQuestion();
        } 
        else {
            connection.query(
                `UPDATE employee_tracker_db.employee SET manager_id = "${managerChose}" WHERE id = "${viewAllEmployees}"`,
                function(err, res) {
                    if (err) throw err;
                    console.log("\n");
                    console.log("EMPLOYEE MANAGER UPDATED")
                    //go back to inital
                    initialQuestion();
                });
            }
        });
    });
    });
}

//ADD DEPARTMENTS (HAVENT STARTED)
function addDepartment() {
    console.log("working")
}

//ADD ROLES (HAVENT STARTED YET)
function addRole() {
   console.log("working")

}