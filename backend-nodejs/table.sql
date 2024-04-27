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

CREATE TABLE product(
    product_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(50) NOT NULL,
    price integer,
    quantity integer,
    category_id integer NOT NULL,
    status varchar(20),
    primary key(product_id)
);

create table sale(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL
);

INSERT INTO sale (uuid, name, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES ('1234', 'John Doe', 'john@example.com', '123-456-7890', "cash", 100, '{"product": "Example Product"}', 'Admin');

DELIMITER $$
CREATE TRIGGER insert_customer_trigger
AFTER INSERT ON sale
FOR EACH ROW
BEGIN
    DECLARE customer_id_check INT;
    
    -- Check if the customer exists in the customer table
    SELECT customer_id INTO customer_id_check
    FROM customer
    WHERE name = NEW.name AND email = NEW.email AND contactNumber = NEW.contactNumber
    LIMIT 1;
    
    -- If no customer found with the same details, insert into customer table
    IF customer_id_check IS NULL THEN
        INSERT INTO customer (name, email, contactNumber)
        VALUES (NEW.name, NEW.email, NEW.contactNumber);
    END IF;
END$$
DELIMITER ;


"[{\"product_id\": 1, \"product_name\": \"green nike pant\", \"price\": 599, \"total\": 599, \"category_name\": \"pant\", \"quantity\": \"1\"}]"
