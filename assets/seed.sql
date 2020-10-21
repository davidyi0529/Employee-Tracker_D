use employees;
INSERT INTO department 
        (name)
VALUES
    ("Human Resources"),
    ("IT"),
    ("Sales"),
    ("Accounting"),
    ("Logistics"),
    ("Customer Service"),
    ("Recruiting"),
    ("Upper Management"),
    ("Payroll");

INSERT INTO role 
        (title, salary, department_id)
VALUES
    ("Receptionist", 40000, 6),
    ("IT Manager",65000,2),
    ("Database Admin",65000,2),
    ("Recruitment Specialist",60000,7),
    ("Work Force Coordinator",50000,5),
    ("CSR",45000,6),
    ("Payroll Administrator",55000,9),
    ("Office Culture Manager",65000,1),
    ("Fulfillment Director", 70000, 3),
    ("President of Sales",115000,3),
    ("Accounts Receivable Analyst",60000,4),
    ("Accounts Payable Analyst",60000,4),
    ("Project Accountant",80000,4),
    ("Senior Accountant",90000,4),
    ("Product Specialist", 66000,2),
    ("Dispatcher",55000,5),
    ("Full Stack Developer",90000, 2),
    ("CEO", 200000, 8),
    ("COO",190000,8),
    ("CTO",185000,8); 

INSERT INTO employee 
        (first_name, last_name, role_id, manager_id)
VALUES
    ("Donald","Duck",20,null),
    ("Mickey","Mouse",18,null),
    ("Minnie", "Mouse",19,null),
    ("Cheshire","Cat",17,11),
    ("Sheriff","Woody",3,11),
    ("Darth","Vader",1,12),
    ("Jack","Sparrow",8,null),
    ("Daisy","Duck",7,12),
    ("Buzz","Lightyear",16,null),
    ("Captain","Hook",1,2),
    ("Mad","Hatter",2,3),
    ("Jiminy","Cricket",14,1),
    ("Peter","Pan",13,12),
    ("March","Hare",15,3);