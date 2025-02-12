const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const employeeRoute = require('./routes/employee');
const categoryRoute = require('./routes/category');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
const saleRoute = require('./routes/sale');
const dashboardRoute = require('./routes/dashboard');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/employee', employeeRoute);
app.use('/category', categoryRoute);
app.use('/customer', customerRoute);
app.use('/product', productRoute);
app.use('/sale', saleRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;
