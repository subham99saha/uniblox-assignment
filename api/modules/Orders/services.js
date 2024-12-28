const config = require('../../config')
/* 
    (In-memory store)
*/
let discCodes = []
let orders = []
const N = config.N

/*
    Function to generate discount code if user is eligible for a discount
*/
const generateCode = (req,res) => {
    let userOrders = orders.filter(o => o.userId === req.params.userId)
    // console.log({orders})
    if ((userOrders.length + 1) % N === 0) {
        let randStr = '', chars = 'abcdefghijklmnopqrstuvwxyz';
        for (var i = 6; i > 0; --i) randStr += chars[Math.floor(Math.random() * chars.length)];
        discCodes.push({
            code: randStr, used: false
        })
        res.json({
            eligible: true,
            code: randStr
        })
    } else {
        res.json({
            eligible: false
        })
    }
}

/*
    Function to check validity of discount code
    1. Code must exist, and be unused
    2. User must be eligible for a discount
*/
const checkCode = (req,res) => {
    // console.log({orders,discCodes})
    let userOrders = orders.filter(o => o.userId === req.params.userId)
    let check = discCodes.find(d => (d.code.toLowerCase() === req.params.code.toLowerCase()) && (d.used === false))
    let message = 'Invalid code. Code doesn\'t exist.'
    if (check === undefined) {
        res.json({
            valid: false, message
        })
    } else {
        if ((userOrders.length + 1) % N != 0) {
            res.json({
                valid: false, message: 'You are not eligible for this code.'
            })
        } else {     
            res.json({
                valid: true, message: 'Code applied successfully.'
            })
        }
    }
}

/*
    Function to list all discount codes
*/
const viewCodes = (req,res) => {
    res.json(discCodes)
}

/*
    Function to place new orders
*/
const placeOrder = (req,res) => {
    console.log({payload: req.body})
    let order = {...req.body}
    orders.push(order)
    let dscntMsg = ''
    if (order.discountApplied) {
        for (let i = 0; i < discCodes.length; i++) {
            if (discCodes[i].code.toLowerCase() === order.discCode.toLowerCase()) {
                discCodes[i].used = true
                dscntMsg = ' Discount added.'
                break
            }                
        }
    }
    res.json({
        message: 'Order placed successfully.' + dscntMsg
    })
}

/*
    Function to list all orders
*/
const viewOrders = (req,res) => {
    res.json(orders)
}

/*
    Functions to explicitly add values to in-memory variables
*/
const setOrders = (req,res) => {
    let dataArr = req.body.dataArr
    orders = [...dataArr]
    res.json({
        message: 'Data set successfully'
    })
}
const setDiscCode = (req,res) => {
    let dataArr = req.body.dataArr
    discCodes = [...dataArr]
    res.json({
        message: 'Data set successfully'
    })
}

module.exports = {
    generateCode,
    checkCode,
    viewCodes,
    placeOrder,
    viewOrders,
    setOrders,
    setDiscCode,
}

