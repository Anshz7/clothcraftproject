const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    query = "insert into category(category_name) values (?)";
    connection.query(query, [category.category_name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "category added successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select * from category order by category_name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body
    var query = "update category set category_name =? where category_id = ?";
    connection.query(query, [product.category_name, product.category_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Category ID not found" });
            }
            return res.status(200).json({ message: "category updated successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body
    var query = "delete from category where category_id =?";
    connection.query(query, [product.category_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Category ID not found" });
            }
            return res.status(200).json({ message: "category deleted successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;