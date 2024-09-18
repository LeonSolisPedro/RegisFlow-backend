CREATE DATABASE IF NOT EXISTS regisflow;

USE regisflow;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    lastlogin DATETIME,
    registrationdate DATETIME NOT NULL,
    status ENUM('active', 'blocked') NOT NULL
);