const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')

const productRoutes = require('./modules/Products/routes')
const adminRoutes = require('./modules/Admin/routes') 

/*
    1. middleware to enable CORS
    2. middleware for JSON request body parsing
*/
app.use(cors())
app.use(express.json())

/*
    Added route to serve image files
*/
app.use('/images', express.static('assets'))

app.get('/',(req,res) => {
    res.send('API is working')
})

app.use('/products', productRoutes)
app.use('/admin', adminRoutes)

app.listen(config.PORT,() => {
    console.log(`Server started on port ${config.PORT}`)
})