const discCodes = []
const orders = []
const N = 3

const generateCode = (req,res) => {
    let userOrders = orders.filter(o => o.userId === req.params.userId)
    console.log({userOrders})
    if ((userOrders.length + 1) % N === 0) {
        let randStr = '', chars = 'abcdefghijklmnopqrstuvwxyz';
        for (var i = 6; i > 0; --i) randStr += chars[Math.floor(Math.random() * chars.length)];
        discCodes.push({
            code: randStr, used: false
        })
        res.json({
            applicable: true,
            code: randStr
        })
    } else {
        res.json({
            applicable: false
        })
    }
}

const checkCode = (req,res) => {
    let userOrders = orders.filter(o => o.userId === req.params.userId)
    let check = discCodes.find(d => (d.code.toLowerCase() === req.params.code.toLowerCase()) && (d.used === false))
    // console.log({check})
    let message = 'Invalid code. Code doesn\'t exist.'
    if (check === undefined) {
        res.json({
            valid: false, message
        })
    } else {
        if ((userOrders.length + 1) % N != 0) {
            res.json({
                valid: false, message: 'You are not applicable for this code.'
            })
        } else {     
            res.json({
                valid: true, message: 'Code applied successfully.'
            })
        }
    }
}

const viewCodes = (req,res) => {
    res.json(discCodes)
}

const placeOrder = (req,res) => {
    let order = {...req.body}
    orders.push(order)
    if (order.discountApplied) {
        for (let i = 0; i < discCodes.length; i++) {
            if (discCodes[i].code.toLowerCase() === order.discCode.toLowerCase()) {
                discCodes[i].used = true
                break
            }                
        }
    }
    console.log({discCodes})
    console.log({orders})
    res.json({
        message: 'Order placed successfully'
    })
}

const viewOrders = (req,res) => {
    res.json(orders)
}

module.exports = {
    generateCode,
    checkCode,
    viewCodes,
    placeOrder,
    viewOrders,
}

