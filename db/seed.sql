USE employee_DB;
INSERT INTO department (name)
VALUES ("Production"), ("Accounting"), ("Executive"), ("Security"), ("Legal");
INSERT INTO role (title, salary, department_id)
VALUES ("Line Producer", 150000, 1), ("Production Manager", 75000, 1), ("Head Accountant", 90000, 2), ("Accountant", 65000, 2), 
("Executive Producer", 180000, 3), ("Production Coordinator", 55000, 1), ("Head of Security", 80000, 4), ("Security Guard", 45000, 4),
("Clearance Coordinator", 80000, 5), ("Attorney", 120000, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Edda", "Mame", 1, null), ("Pa", "Ptart", 2, 1), ("Carl", "Junior", 3, null), ("Grabba", "Snickers", 4, 3),
("Meat", "Loaf", 5, null), ("Smash", "Mouth", 6, 5), ("Jaw", "Breaker", 7, null), ("Gandalf", "Dumbledore", 8, 7);