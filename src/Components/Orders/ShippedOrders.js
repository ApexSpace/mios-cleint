import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ShippedOrders = () => {
    const host = process.env.REACT_APP_API_URL;
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const getOrders = async () => {
            const { data } = await axios.get(`${host}/api/order/shippedOrders`);
            setOrders(data);
        }
        getOrders();
    }, [])

    console.log("Wow", orders);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>My Orders</h1>
            <table className='table table-striped table-responsive table-hover' width={'90%'}>
                <thead>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Sr#</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Shipping Charges</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.map((item, ind) => {
                        var date = new Date(item.date);
                        var d = date.getDate();
                        var m = date.getMonth() + 1;
                        var y = date.getFullYear();
                        var h = date.getHours();
                        var min = date.getMinutes();
                        return (
                            <tr key={ind}>
                                <td>{ind + 1}</td>
                                {/* <td>{item.id}</td> */}
                                <td>{item.shippingDetails.name}</td>
                                <td>{item.shippingDetails.phone}</td>
                                <td>{item.shippingDetails.address}</td>
                                <td>{item.shippingDetails.city}</td>
                                <td>{item.shippingPrice}</td>
                                <td>{item.orderAmount}</td>
                                <td>{item.paymentOption}</td>
                                <td>{`${d}/${m}/${y} at ${h}:${min}`}</td>
                                <td>{item.orderStatus}</td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>

        </div>
    )
}

export default ShippedOrders