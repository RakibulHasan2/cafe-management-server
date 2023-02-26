const { json } = require('express');
const express = require('express')
const connection = require('../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRole')


// ---------------------signup new user-----------------
router.post('/signup', (req, res) => {
    let user = req.body;
    connection.query('SELECT * FROM user WHERE email = ?', [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber, email, password, status, role) values(?,?,?,?,'false', 'user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "successfully registered" })
                    } else {
                        return res.status(500).json(err);

                    }
                })
            } else {
                return res.status(400).json({ message: "Email Already Exist" })
            }

        } else {
            return res.status(500).json(err)
        }
    });
})

//------------------ user login-------------------------
router.post('/login', (req, res) => {
    let user = req.body;
    connection.query('SELECT * FROM user WHERE email = ?', [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect User name and password" })
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin approval" });
            }
            else if (results[0].password === user.password) {
                const response = {
                    email: results[0].email,
                    role: results[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong" })
            }
        }
        else {
            return res.status(500).json(err)
        }
    });

})

//checking role of the user
router.get('/get',auth.authenticateToken,checkRole.checkRole,(req, res) =>{
    const query =  "SELECT * FROM user WHERE role = 'user'"
    connection.query(query, (err, results) =>{
        if(!err){
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err)
        }
    })
})

//updating the user status
router.patch('/update',auth.authenticateToken,checkRole.checkRole, (res, req)=>{
    let user =  req.body
    var query = "UPDATE user set status=? where id=?";
    
    connection.query(query, [user.status, user.id],(err, results) =>{
        if(!err){
           if(results.affectedRows == 0){
            return res.status(404).json({message: "user id doesn't exist"})
           }
           return res.status(200).json({message: "user updated successfully"})
        }else{
            
            return res.status(500).json(err)
        }
    })
})


//checking jwt token
router.get('/checkToken', auth.authenticateToken,checkRole.checkRole,(res, req)=>{
    return res.status(200).json({message: "true"})
})

module.exports = router;