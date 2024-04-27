const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.get('/details', auth.authenticateToken, (req, res, next) => {
    var categoryCount;
    var customerCount;
    var productCount;
    var saleCount;
    var queryCategory = "select count(category_id) as categoryCount from category";
    connection.query(queryCategory, (err, results) => {
        if (!err) {
            categoryCount = results[0].categoryCount;
        }
        else {
            return res.status(500).json(err);
        }
    })

    var queryProduct = "select count(product_id) as productCount from product";
    connection.query(queryProduct, (err, results) => {
        if (!err) {
            productCount = results[0].productCount;
        }
        else {
            return res.status(500).json(err);
        }
    })

    var queryCustomer = "select count(customer_id) as customerCount from customer";
    connection.query(queryCustomer, (err, results) => {
        if (!err) {
            customerCount = results[0].customerCount;
        }
        else {
            return res.status(500).json(err);
        }
    })

    var querySale = "select count(id) as saleCount from sale";
    connection.query(querySale, (err, results) => {
        if (!err) {
            saleCount = results[0].saleCount;
            var data = {
                categoryCount: categoryCount,
                product: productCount,
                customer: customerCount,
                sale: saleCount
            }
            return res.status(200).json(data);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;