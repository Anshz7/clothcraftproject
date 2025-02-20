const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    // Start a database transaction
    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json(err);
        }

        var query = "INSERT INTO sale (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
            if (err) {
                return connection.rollback(() => res.status(500).json(err));
            }

            // Reduce product stock after inserting the sale
            let updateStockPromises = productDetailsReport.map((product) => {
                return new Promise((resolve, reject) => {
                    let updateQuery = "UPDATE product SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?";
                    
                    connection.query(updateQuery, [product.quantity, product.product_id, product.quantity], (err, result) => {
                        if (err) return reject(err);
                        if (result.affectedRows === 0) {
                            return reject(`Not enough stock for product ID: ${product.product_id}`);
                        }
                        resolve();
                    });
                });
            });

            // Execute all stock updates
            Promise.all(updateStockPromises)
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => res.status(500).json(err));
                        }

                        // Generate PDF after stock update
                        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { 
                            productDetails: productDetailsReport, 
                            name: orderDetails.name, 
                            email: orderDetails.email, 
                            contactNumber: orderDetails.contactNumber, 
                            paymentMethod: orderDetails.paymentMethod, 
                            totalAmount: orderDetails.totalAmount 
                        }, (err, results) => {
                            if (err) {
                                return res.status(500).json(err);
                            } else {
                                pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json(err);
                                    } else {
                                        return res.status(200).json({ uuid: generatedUuid });
                                    }
                                });
                            }
                        });
                    });
                })
                .catch((error) => {
                    connection.rollback(() => res.status(400).json({ error }));
                });
        });
    });
});

router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                });
            }
        });
    }
})

router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    var query = "select * from sale order by id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from sale where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Sale Id not Found"});
            }
            else{
                return res.status(200).json({message:"Sale Deleted Successfully"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;