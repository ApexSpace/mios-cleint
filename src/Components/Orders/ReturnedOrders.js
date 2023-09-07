import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import UserContext from '../../context/User/UserContext';
import Loader from '../../Loader/Loader';

const ReturnedOrders = () => {
    const host = process.env.REACT_APP_API_URL;

    const [orders, setOrders] = useState([]);
    const [orderLoading, setloading] = useState(false);
    const { loading } = useContext(UserContext);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    useEffect(() => {
        const getOrders = async () => {
            setloading(true)
            const { data } = await axios.get(`${host}/api/order/returnedOrders`);
            setOrders(data);
            setloading(false)
            setFilteredRecords(data);
        }
        getOrders();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const filter = () => {
        if (
            to &&
            from &&
            new Date(from).toISOString() <= new Date(to).toISOString()
        ) {
            const startUTC = new Date(from).toISOString();
            let endUTC = new Date(to);
            endUTC.setUTCHours(23, 59, 59, 999);
            endUTC = endUTC.toISOString();
            if (startUTC && endUTC) {
                const filtered = orders?.filter((record) => {
                    let recordDate = new Date(record.date);
                    recordDate.setUTCHours(recordDate.getUTCHours() + 5);
                    recordDate = recordDate.toISOString();
                    return recordDate >= startUTC && recordDate <= endUTC;
                });
                setFilteredRecords(filtered);
            } else {
                Notification("Error", "Enter Valid Dates", "danger");
            }
        } else {
            Notification("Error", "Enter Valid Dates", "danger");
        }
    };


    return (
        <div>
            {loading || orderLoading ? <Loader /> : <>
                <div className="d-flex w-80 align-items-center justify-content-evenly mb-3 mt-3">
                    <div>
                        <label for="" className="form-label">
                            Starting From: &nbsp;&nbsp;&nbsp;
                        </label>
                        <input
                            type="Date"
                            className="p-1"
                            onChange={(e) => setFrom(e.target.value)}
                            value={from}
                            name="from"
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label for="" className="form-label">
                            Till Date:&nbsp;&nbsp;&nbsp;{" "}
                        </label>
                        <input
                            type="Date"
                            className="p-1"
                            name="to"
                            onChange={(e) => setTo(e.target.value)}
                            value={to}
                            placeholder=""
                        />
                    </div>
                    <button className="btn btn-sm btn-info text-light" onClick={filter}>
                        Filter
                    </button>
                    <button
                        className="btn btn-sm btn-info text-light"
                        onClick={() => setFilteredRecords(orders)}
                    >
                        Fetch All
                    </button>
                </div>


                <h1 style={{ textAlign: 'center' }}>My Orders</h1>
                <table className='table table-striped table-responsive table-hover' width={'90%'}>
                    <thead>
                        <tr>
                            <th>Sr#</th>
                            {/* <th>ID</th> */}
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
                        {filteredRecords && filteredRecords.map((item, ind) => {
                            var date = new Date(item.date);
                            var d = date.getDate();
                            var m = date.getMonth() + 1;
                            var y = date.getFullYear();
                            var h = date.getHours();
                            var min = date.getMinutes();
                            return (
                                <tr key={ind}>
                                    {/* <td>{item.id}</td> */}
                                    <td>{ind + 1}</td>
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

            </>}
        </div >
    )
}

export default ReturnedOrders