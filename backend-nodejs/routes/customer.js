const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select * from customer order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let customer = req.body
    var query = "delete from customer where customer_id =?";
    connection.query(query, [customer.customer_id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "customer ID not found" });
            }
            return res.status(200).json({ message: "customer deleted successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;