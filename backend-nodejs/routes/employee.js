const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/signup', (req, res) => {
    let employee = req.body;
    query = "select email, password, role, status from employee where email=?";
    connection.query(query, [employee.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into employee(employee_name, employee_phone, salary, join_year, email, password, status, role) values(?, ?, ?, ?, ?, ?,'false', 'employee')";
                connection.query(query, [employee.employee_name, employee.employee_phone, employee.salary, employee.join_date, employee.email, employee.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "successfully regestered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "email already exist" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req, res) => {
    const employee = req.body;
    query = "select email, password, role, status from employee where email=?";
    connection.query(query, [employee.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != employee.password) {
                return res.status(401).json({ message: "incorrect username or password" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "wait for admin approval" });
            }
            else if (results[0].password == employee.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "something went wrong, please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req, res) => {
    const employee = req.body;
    query = "select email, password from employee where email=?";
    connection.query(query, [employee.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "password sent successfully to your email" });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'password by Cloth Craft',
                    html: '<p><b>Your Login details for Cloth Craft</b><br><b>Email: </b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="http//localhost:4200">Click to Login!</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "password sent successfully to your email" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;