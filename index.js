const express = require('express')
const cors = require('cors')
const connection = require('./connection');
const userRoute = require('./routes/user')
const app =  express();
const categoryRoute = require('./routes/category.js')
const productRoute = require('./routes/product')


//middle ware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/user', userRoute)
app.use('/category', categoryRoute )
app.use('/product', productRoute )


module.exports = app