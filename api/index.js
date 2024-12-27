const express = require('express')
const cors = require('cors')
const app = express();

const productRoutes = require('./modules/Products/routes'); 
const adminRoutes = require('./modules/Admin/routes'); 

app.use(cors())
app.use(express.json());
app.use('/images', express.static('assets'));

app.get('/',(req,res) => {
    res.send('Hello World')
})

app.use('/products', productRoutes);
app.use('/admin', adminRoutes);

app.listen(5000,() => {
    console.log('Server started')
})