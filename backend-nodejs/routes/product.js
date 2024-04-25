const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "insert into product(product_name, category_id, price, quantity, status) values (?, ?, ?, ?, 'true')";
    connection.query(query, [product.product_name, product.category_id, product.price, product.quantity], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product added Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select p.product_id, p.product_name, p.price, p.quantity, p.status, c.category_id as category_id, c.category_name as categoryName from product as p INNER JOIN category as c where p.category_id = c.category_id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategory/:category_id', auth.authenticateToken, (req, res, next) => {
    const category_id = req.params.category_id;
    var query = "SELECT product_id, product_name FROM product WHERE category_id = ? AND status = 'true'";
    connection.query(query, [category_id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});


router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT product_id, product_name, price, quantity FROM product WHERE product_id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                return res.status(200).json(results[0]);
            } else {
                return res.status(404).json({ message: "Product not found" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update product set product_name =?, category_id =?, price =?, quantity =? where product_id = ?";
    connection.query(query, [product.product_name, product.category_id, product.price, product.quantity, product.product_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID not found" });
            }
            return res.status(200).json({ message: "Product updated successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "delete from product where product_id =?";
    connection.query(query, [product.product_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID not found" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus',auth.authenticateToken, checkRole.checkRole, (req, res, next) =>{
    let product = req.body;
    var query = "update product set status =? where product_id =?";
    connection.query(query, [product.status, product.product_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID not found" });
            }
            return res.status(200).json({ message: "Product Status Changed!" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;