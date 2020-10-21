use employees;
INSERT INTO department 
        (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role 
        (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employee 
        (first_name, last_name, role_id, manager_id)
VALUES
    ("Donald","Duck",2,3),
    ("Mickey","Mouse",1,null),
    ("Minnie", "Mouse",1,2),
    ("Cheshire","Cat",2,3),
    ("Sheriff","Woody",4,6),
    ("Darth","Vader",3,null),
    ("Jack","Sparrow",4,6),
    ("Daisy","Duck",6,null),
    ("Buzz","Lightyear",5,10),
    ("Captain","Hook",5,10),
    ("Mad","Hatter",6,8),
    ("Jiminy","Cricket",7,null),
    ("Peter","Pan",8,12),
    ("March","Hare",8,12);