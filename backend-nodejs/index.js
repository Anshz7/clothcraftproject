const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const employeeRoute = require('./routes/employee');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/employee', employeeRoute);

module.exports = app;