const express = require('express')
const cors = require('cors')
const connection = require('./connection');
const userRoute = require('./routes/user')
const app =  express();
const categoryRoute = require('./routes/category.js')
const productRoute = require('./routes/product')
const billRoute = require('./routes/bill')
const dashboardRoute = require('./routes/dashboard')


//middle ware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/user', userRoute)
app.use('/category', categoryRoute )
app.use('/product', productRoute )
app.use('/bill', billRoute )
app.use('/dashboard', dashboardRoute )


module.exports = app