import axios from 'axios'
import { useState, useEffect } from 'react'
import config from '../../config.json'

const Admin = () => {
    const N = config.N
    const URL = config.URL
    const [orders,setOrders] = useState([])
    const [codes,setCodes] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: `${URL}/orders`
        }).then(response => {
            // console.log({response})
            setOrders(response.data)
        }).catch(error => {
            console.log({error})
        });
    },[])

    useEffect(() => {
        axios({
            method: 'get',
            url: `${URL}/orders/view-codes`
        }).then(response => {
            // console.log({response})
            setCodes(response.data)
        }).catch(error => {
            console.log({error})
        });
    },[])

    return <>
        <div className="container mx-auto p-20">
            <div className="font-semibold mb-10 px-5">
                <h1 className="text-5xl"><i>N</i> = {N}</h1>
            </div>
            <div className="font-semibold mb-5 px-5">
                <h1 className="text-3xl heading"><i>Orders</i> Placed</h1>
            </div>
            {orders.length != 0 ? <table className='table-auto w-full'>
                <thead className=''>
                    <tr>
                        <th className='cell'>#</th>
                        <th className='cell'>Customer</th>
                        <th className='cell'>Items</th>
                        <th className='cell'>Discount Code</th>
                        <th className='cell'>Price</th>
                        <th className='cell'>Discount</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map((o,i) => {
                    let price = 0
                    let items = o.items.map(i => {
                        price += i.price * i.qty
                        return `${i.title} (${i.qty})`
                    })
                    console.log({items})
                    return <tr className='row'>
                        <td className='cell'>{i + 1}</td>
                        <td className='cell'>{o.userId}</td>
                        <td className='cell'>{items.join(', ')}</td>
                        <td className='cell uppercase'>{(o.discountApplied) ? o.discCode : ''}</td>
                        <td className='cell'>₹{price}</td>
                        <td className='cell'>{(o.discountApplied) ? `₹${0.1 * price}` : ''}</td>
                    </tr>
                })}
                </tbody>
                <tfoot>
                    <tr className='row'>
                        <th className='cell' colSpan='4'></th>
                        <th className='cell italic text-xl'>
                            ₹{orders.reduce(
                                (acc, curr) => {
                                    let price = curr.items.reduce((a,c) => a + (c.price * c.qty), 0)
                                    return acc + price
                                },
                                0,
                            )}
                        </th>
                        <th className='cell italic text-xl'>
                            ₹{orders.reduce(
                                (acc, curr) => {
                                    let price = 0
                                    if (curr.discountApplied)
                                        price = curr.items.reduce((a,c) => a + (c.price * c.qty), 0) * 0.1
                                    return acc + price
                                },
                                0,
                            )}
                        </th>
                    </tr>
                </tfoot>
            </table> 
            : <p className='px-5'>No orders found</p>}

            <div className="font-semibold mt-10 mb-5 px-5">
                <h1 className="text-3xl heading"><i>Discount</i> Codes</h1>
            </div>
            <div className='px-5'>
                {codes.length != 0 ? codes.map(c => {
                    return <span class={`inline-flex items-center rounded-md mr-2 px-2 py-1 text-xs font-medium ring-1 ring-inset ${(c.used) ? 'bg-red-50 text-red-700 ring-red-600/10' : 'bg-green-50 text-green-700 ring-green-600/10'} uppercase`}>{c.code}</span>
                }) : 'No codes found'}
            </div>
        </div>
    </>
}

export default Admin