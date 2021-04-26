USE employee_DB;
INSERT INTO department (name)
VALUES ("Sales"), ("Human Resources"), ("Finance"), ("Engineering"), ("Legal");
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 60000, 1), ("HR Manager", 80000, 2), ("Recruiter", 60000, 2), 
("Accounting Lead", 80000, 3), ("Accountant", 60000, 3), ("Lead Engineer", 120000, 4), ("Engineer", 90000, 4),
("Legal Lead", 150000, 5), ("Lawyer", 120000, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ash", "Williams", 1, null), ("Grogu", "Babyyoda", 2, 1), ("Jean-Luc", "Picard", 3, null), ("William", "Riker", 4, 3),
("Luke", "Skywalker", 5, null), ("Han", "Solo", 6, 5), ("Frodo", "Baggins", 7, null), ("Merry", "Brandybuck", 8, 7);