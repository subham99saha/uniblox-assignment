import axios from 'axios'
import { useState, useEffect } from 'react'

const Home = () => {
    const URL = 'http://localhost:5000'
    const [products,setProducts] = useState([])
    const [cart,setCart] = useState([])
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
    },[])

    const addToCart = (i) => {
        setCart([...cart, {
            ...products[i],
            qty: 1
        }])
    }

    return <>
        <div className="container mx-auto p-20 min-h-screen grid grid-cols-3">
            <div className='col-span-2'>
                <div className="font-semibold mb-5 px-5">
                    <h1 className="text-5xl heading"><i>Trending</i> Items</h1>
                </div>
                <div className='grid grid-cols-3'>
                    {products.map((p,i) => {
                        return <div className='p-5'>
                            <div className='shadow-xl overflow-hidden' style={{ borderRadius: '30px'}}>
                                <div className='' style={{backgroundImage: `url('${URL}/images/${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'cover', width: '100%', height: '200px'}}></div>
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
                    {cart.map((c,i) => {
                        return <div className='grid grid-cols-4 m-5 overflow-hidden shadow-lg' style={{borderRadius: '20px'}}>
                            <div className='' style={{backgroundImage: `url('${URL}/images/${c.image}')`, backgroundSize: 'cover', backgroundPosition: 'cover', width: '100%', height: '125px'}}></div>
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
                                    <div className='col-span-2 flex justify-end mt-2'>
                                        <span className='px-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
                                        <span className='px-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg></span>
                                        <span className='px-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>
                                    </div>
                                </div>
                                <div className='text-xs font-light mt-3 text-gray-500'>{c.description}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </>
}

export default Home