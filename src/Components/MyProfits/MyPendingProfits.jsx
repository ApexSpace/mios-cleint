import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useParams } from "react-router-dom";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";
const image = window.location.origin + "/Assets/no-data.svg";
const MyPendingProfits = () => {

    const host = process.env.REACT_APP_API_URL;
    const [allProfits, setAllProfits] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getAllProfits();
        // eslint-disable-next-line
    }, [])
    const getAllProfits = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${host}/api/profitrecords/mypendingprofits/`);
            setAllProfits(data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <><ReactNotifications />
            {loading ? <Loader /> : <div className="main">
                <div className="container-fluid">
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr className="table-dark">
                                <th colSpan="1" >Sr.</th>
                                <th colSpan="1" className="text-center">Customer Name</th>
                                <th colSpan="1" className="text-center">Order ID</th>
                                <th colSpan="1" className="text-center">Contact</th>
                                <th colSpan="1" className="text-center">Pending Profit</th>
                                <th colSpan="1" className="text-center">Profit Status</th>
                                <th colSpan="1" className="text-center">Detail</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allProfits && allProfits?.map((item, key) => {
                                return (<tr key={key}>
                                    <td colSpan="1" className="text-center">{key + 1}</td>
                                    <td colSpan="1" className="text-center">{item?.user?.name}</td>
                                    <td colSpan="1" className="text-center"><Link to={`/user/order/${item?._id}`}>{item?._id}</Link></td>
                                    <td colSpan="1" className="text-center">{item?.user?.city}</td>
                                    <td colSpan="1" className="text-center">{item?.profitAmount}</td>
                                    <td colSpan="1" className="text-center">{item?.profitStatus}</td>
                                    <td colSpan="1" className="text-center"><Link to={`/user/order/${item?._id}`}><button className="btn btn-primary">Detail</button></Link></td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                    {allProfits?.length <= 0 && <div className='no_data'>
                        <img className='no_data-img' src={image} alt='No Data' ></img>
                    </div>}
                </div>
            </div>}
        </>
    );
}

export default MyPendingProfits;

