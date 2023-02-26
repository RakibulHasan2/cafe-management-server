const { query } = require('express');
const express = require('express')
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication')

//---------adding product to the product table--------------
router.post('/add', auth.authenticateToken, (req, res, next) => {
    let product = req.body;
    var query = "insert into product (name, categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query, [product.name,product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product added successfully" })
        }
        else {
            return res.status(500).json(err)
        }
    })
})


//-----------getting all the product details API----------------
router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "SELECT p.id, p.name, p.description, p.price,p.status, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results)
        }
        else {
            return res.status(500).json(err)
        }
    })
})

//----------getting product by categoryID---------------
router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id, name from product where categoryId =? and status ='true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results)
        }
        else {
            return res.status(500).json(err)
        }
    })
})

//------------------- getting product by its id-----------------
router.get('/getByID/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id, name, description, price from product where id =?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0])
        }
        else {
            return res.status(500).json(err)
        }
    })
})


//-------------------updating product details-----------------
router.patch('/update', auth.authenticateToken, (req, res, next) => {
    let product = req.body;
    var query = 'update product set name =?, categoryId=?,description=? ,price=? where id=?'
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "product id does not found" })
            }
            return res.status(200).json({ message: "Product updated successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
})


//-----------------deleting product items------------
router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id
    var query = 'delete from product where id=?';

    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "product id does not found" })
            }
            return res.status(200).json({ message: "Product Deleted successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
})


//---------------updating product status------------------
router.patch('/updateStatus', auth.authenticateToken, (req, res, next) => {
    let user = req.body
    var query = 'update product set status=? where id=?';
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "product id does not found" })
            }
            return res.status(200).json({ message: "Product status updated successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
})
module.exports = router