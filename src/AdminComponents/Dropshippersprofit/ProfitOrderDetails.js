import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import './dialog.css';
const ProfitOrderDetails = () => {
    const host = process.env.REACT_APP_API_URL;
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState({});
    const [user, setUser] = useState({});
    useEffect(() => {
        getProfitDetails();
    }, [])
    const { id, userid } = useParams();
    const getProfitDetails = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${host}/api/profitrecords/singleprofit/${userid}/${id}`)
            setUser(data?.user)
            setRecord(data?.records?.records[0]);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const [showDialog, setShowDialog] = useState(false);

    const handleClick = () => {
        setShowDialog(true);
    };

    const handleClose = () => {
        setShowDialog(false);
    };



    return (
        <div className="container mt-3">
            {loading ? <Loader /> : <><h2 className="text-center">Paid Profit Detail</h2>
                <h3 className="text-center">  Paid to: {user?.name}({user?.role})</h3>
                <h6 className="text-center">  User ID: {user?._id}</h6><br />
                <h6 className="text-center">  Total Profit: {record?.amount}</h6><br />
                <h6 className="text-center">  Paid At: {new Date(record?.datePaid).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</h6><br />


                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr className="table-dark text-center">
                            <th scope="col">Sr.</th>
                            <th scope="col">Order Amount</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Profit Amount</th>
                            <th scope="col">Shipping Detail</th>
                            <th scope="col">Products Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record?.orders?.map((item, ind) => {
                            return (
                                <tr key={ind}>
                                    <td className='text-center'>{ind + 1}</td>
                                    <td className='text-center'>{item?.orderAmount} Rs.</td>
                                    <td className='text-center'>{new Date(item?.date).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
                                    <td className='text-center'>{item?.profitAmount} Rs.</td>
                                    <td className='text-center'><button className='btn btn-primary' onClick={handleClick}>Shipping Detail</button> <Dialog
                                        show={showDialog}
                                        onClose={handleClose}
                                        details={item?.shippingDetails}
                                    /></td>
                                    <td className='text-center'><Link to={`/admin/orderproduct/details/${item?._id}`}><button className='btn btn-primary'>Order Detail</button></Link></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>}

        </div>)
}

export default ProfitOrderDetails




function Dialog({ show, onClose, details }) {
    return (
        <><div className={`dialog-box ${show ? 'active' : ''}`}>
            <div className="dialog-content">

                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        Shipping Details
                    </h5>
                    <button type="button" style={{ fontSize: '20px' }} className='btn-close' onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th scope="row">Name</th>
                                <td>{details?.name}</td>
                            </tr>
                            <tr>
                                <th scope="row">E-mail</th>
                                <td>{details?.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">City</th>
                                <td>{details?.city}</td>
                            </tr>
                            <tr>
                                <th scope="row">Address</th>
                                <td>{details?.address}</td>
                            </tr>
                            <tr>
                                <th scope="row">Phone</th>
                                <td>{details?.phone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
        </>
    );
}

