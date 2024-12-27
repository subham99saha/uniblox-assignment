import axios from 'axios'
import { useState, useEffect } from 'react'

const Home = () => {
    const URL = 'http://localhost:5000'
    const [userId,setUserId] = useState('')

    const [products,setProducts] = useState([])
    const [cart,setCart] = useState([])
    const [total,setTotal] = useState(0)
    const [discCode,setDiscCode] = useState('')
    const [isCodeValid,setIsCodeValid] = useState(false)
    const [codeMsg,setCodeMsg] = useState('')
    const [orderMsg,setOrderMsg] = useState('')

    useEffect(() => {
        axios({
            method: 'get',
            url: `${URL}/products`
        }).then(response => {
            console.log({response})
            setProducts(response.data)
        }).catch(error => {
            console.log({error})
        });

        if (localStorage.getItem('userId')) {
            setUserId(localStorage.getItem('userId'))
        } else {
            let randStr = '', chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (var i = 10; i > 0; --i) randStr += chars[Math.floor(Math.random() * chars.length)];
            localStorage.setItem('userId',randStr)
            setUserId(randStr)
        }
    },[])

    useEffect(() => {
        let sum = 0
        cart.map(c => {
            sum += c.qty * c.price
        })
        setTotal(sum)
    },[cart])

    const addToCart = (i) => {
        let check = cart.find(c => c.id === products[i].id)
        if (check === undefined) {
            setCart([...cart, {
                ...products[i],
                qty: 1
            }])
        }
    }
    const remFromCart = (i) => {
        let newCart = [...cart]
        newCart.splice(i,1)
        setCart(newCart)
    }
    const handleQty = (i,add=true) => {
        let newCart = [...cart]
        if (add) {
            newCart[i].qty += 1 
        } else {
            if (newCart[i].qty > 1)
                newCart[i].qty -= 1
        }
        setCart(newCart)
    }

    const checkCode = () => {
        axios({
            method: 'get',
            url: `${URL}/admin/check-code/${discCode}`
        }).then(response => {
            console.log({response})
            setIsCodeValid(response.data.valid)
            if (response.data.valid) {
                setCodeMsg('Code applied')
            } else {
                setCodeMsg('Invalid code')
            }
            setTimeout(() => {
                setCodeMsg('')
            },2000)
        }).catch(error => {
            console.log({error})
        });
    }

    const placeOrder = () => {
        axios({
            method: 'post',
            url: `${URL}/admin/`,
            headers: { 
                'Content-Type': 'application/json', 
            },
            data: {
                items: cart,
                discountApplied: isCodeValid,
                discCode,
                userId
            }
        }).then(response => {
            console.log({response})
            setOrderMsg(response.data.message)
            setTimeout(() => {
                setOrderMsg('')
            },5000)
        }).catch(error => {
            console.log({error})
        });
        setIsCodeValid(false)
        setDiscCode('')
        setTotal(0)
        setCart([])
    }

    return <>
        <div className="container mx-auto p-20 min-h-screen grid grid-cols-3">
            <div className='col-span-2'>
                <div className="font-semibold mb-5 px-5">
                    <h1 className="mb-1 text-xs font-semibold"><i>USER</i> - {userId}</h1>
                    <h1 className="text-5xl heading"><i>Trending</i> Items</h1>
                </div>
                <div className='grid grid-cols-3'>
                    {products.map((p,i) => {
                        return <div key={i} className='p-5'>
                            <div className='shadow-xl overflow-hidden' style={{ borderRadius: '30px'}}>
                                <div className='' style={{backgroundImage: `url('${URL}/images/${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '200px'}}></div>
                                <div className='p-5'>
                                    <div className='font-semibold text-lg'>{p.title}</div>
                                    <div className='font-semibold'>₹ <span className='text-3xl'>{p.price}.00</span></div>
                                    <div className='text-xs font-light mt-3 text-gray-500'>{p.description}</div>
                                </div>                                
                                <button onClick={() => addToCart(i)} className='bg-gray-800 text-white text-xs m-5 px-5 py-2' style={{borderRadius: '30px'}}>
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    })}
                </div>
            </div>

            <div className=''>
                <div className="font-semibold mb-5 px-5">
                    <h1 className="text-3xl heading">Checkout</h1>
                </div>
                <div>
                    {cart.length != 0 ? cart.map((c,i) => {
                        return <div key={i} className='grid grid-cols-4 m-5 overflow-hidden shadow-lg' style={{borderRadius: '20px'}}>
                            <div className='' style={{backgroundImage: `url('${URL}/images/${c.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', minHeight: '125px'}}></div>
                            <div className='col-span-3 px-3 py-2'>
                                <div className='grid grid-cols-4'>
                                    <div>
                                        <div className='font-semibold text-sm'>{c.title}</div>
                                        <div className='font-light text-sm'>₹ <span className=''>{c.price}.00</span></div>
                                    </div>
                                    <div>
                                        <div className='font-semibold text-sm'>Qty</div>
                                        <div className='font-light text-sm'>{c.qty}</div>
                                    </div>
                                    <div className='col-span-2 flex justify-end'>
                                        <button className='px-3' onClick={() => handleQty(i)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
                                        <button className='px-3' onClick={() => handleQty(i,false)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus"><path d="M5 12h14"/></svg></button>
                                        <button className='px-3' onClick={() => remFromCart(i)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                                    </div>
                                </div>
                                <div className='text-xs font-light mt-3 text-gray-500'>{c.description}</div>
                            </div>
                        </div>
                    }) : 
                    <p className='m-5 font-light text-xs'>Your cart is empty</p>
                    }
                </div>
                <div className="mb-5 text-sm px-5 flex justify-between items-center">
                    <div>
                        <h1 className="">Total MRP</h1>
                        <h1 className="">Discount</h1>
                        <h1 className="mt-1 font-semibold text-xl">Total amount</h1>
                    </div>
                    <div className='text-right'>
                        <h1 className="">₹ {total}</h1>
                        <h1 className="">₹ {isCodeValid ? 0.1*total : 0}</h1>
                        <h1 className="mt-1 font-semibold text-xl">₹ {(total - (isCodeValid ? 0.1*total : 0))}</h1>
                    </div>
                </div>
                {(total != 0) ? <div className='px-5'>
                    <button className='mb-3 bg-gray-800 text-white font-semibold p-3 text-center w-full uppercase'>Check for discounts</button>
                    <div className='mb-1 text-xs font-light text-gray-500'>Add a discount code if you have any</div>
                    <div className='border border-gray-800 grid grid-cols-4'>
                        <input className='col-span-3 outline-none p-3 w-full uppercase' type='text' value={discCode} placeholder='SAVE50' onChange={(e) => setDiscCode(e.target.value)}/>
                        <div onClick={checkCode} className='cursor-pointer font-semibold flex items-center justify-center'>APPLY</div>
                    </div>
                    <div className='mt-1 text-xs'>{codeMsg}</div>
                    <button onClick={placeOrder} className='mt-3 bg-gray-800 text-white font-semibold p-3 text-center w-full uppercase'>Place order</button>
                </div> : ''}
                <div className='mt-1 text-xs'>{orderMsg}</div>
            </div>
        </div>
    </>
}

export default Home