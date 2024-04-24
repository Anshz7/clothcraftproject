const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const employeeRoute = require('./routes/employee');
const categoryRoute = require('./routes/category');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/employee', employeeRoute);
app.use('/category', categoryRoute);

module.exports = app;