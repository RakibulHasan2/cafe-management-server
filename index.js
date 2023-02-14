const express = require('express')
const cors = require('cors')
const connection = require('./connection');
const userRoute = require('./routes/user')
const app =  express();


//middle ware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/user', userRoute)


module.exports = app