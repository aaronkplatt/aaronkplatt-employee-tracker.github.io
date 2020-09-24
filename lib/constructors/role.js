class role {
    constructor(title, salary){
        this.title = title;
        this.salary = salary;
    }
    getTitle = () => this.title;

    getSalary = () => this.salary;

}
module.exports = role;