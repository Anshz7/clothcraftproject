CREATE TABLE employee (
    employee_id int primary key AUTO_INCREMENT,
    employee_name varchar(50),
    employee_phone varchar(10),
    salary varchar(10),
    join_year varchar(10),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into employee(employee_name, employee_phone, salary, join_year, email, password, status, role) values('Admin', '1234567890', '-', '-', 'clothkraft@gmail.com', 'ClothCraft123','true', 'admin');

CREATE TABLE category(
    category_id int NOT NULL AUTO_INCREMENT,
    category_name varchar(50) NOT NULL,
    PRIMARY KEY(category_id)
);

CREATE TABLE customer(
    customer_id int NOT NULL AUTO_INCREMENT,
    customer_name varchar(50) NOT NULL,
    customer_phone varchar(10) NOT NULL,
    PRIMARY KEY(customer_id)
);