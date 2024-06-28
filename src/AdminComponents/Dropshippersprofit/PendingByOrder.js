import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useParams } from "react-router-dom";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";
const image = window.location.origin + "/Assets/no-data.svg";

const PendingByOrder = () => {
    const host = process.env.REACT_APP_API_URL;
    const [allProfits, setAllProfits] = useState([]);
    const [filteredProfits, setFilteredProfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        getAllProfits();
    }, []);

    const { id } = useParams();

    const getAllProfits = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${host}/api/profitrecords/pendingprofitsbyuser/${id}`
            );
            setAllProfits(data);
            setFilteredProfits(data);
            setLoading(false);
            // Filter the profits based on the initial date range (if provided)
            // filterProfitsByDate();
        } catch (error) {
            setLoading(false);
        }
    };

    const paySingleProfits = async (user, amount, orderId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${host}/api/profitrecords/paySingleProfit`,
                { userId: user, amount, orderId }
            );
            await getAllProfits();
            setLoading(false);
            Notification("Success", data.message, "success");
        } catch (error) {
            setLoading(false);
            Notification("Error", error.message, "danger");
        }
    };

    const filterProfitsByDate = () => {
        if (startDate && endDate) {
            const filteredData = allProfits.filter((item) => {
                const itemDate = new Date(item.date);
                return (
                    itemDate >= new Date(startDate + "T00:00:00Z") &&
                    itemDate <= new Date(endDate + "T23:59:59Z")
                );
            });
            setFilteredProfits(filteredData);
        } else {
            // If no date range is selected, show all profits
            setFilteredProfits(allProfits);
        }
    };

    const handleSearch = () => {
        // Call the filter function explicitly when the "Search" button is clicked
        filterProfitsByDate();
    };

    return (
        <>
            <ReactNotifications />
            {loading ? (
                <Loader />
            ) : (
                <div className="main">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-evenly align-center">
                            <div className="mb-3">
                                <label htmlFor="startDate" className="form-label">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <button className="btn btn-primary" onClick={handleSearch}>
                                    Filter
                                </button>
                            </div>
                            <div>
                                <button className="btn btn-primary" onClick={() => {
                                    setFilteredProfits(allProfits);
                                    setStartDate("");
                                    setEndDate("");
                                }}>
                                    Fetch All
                                </button>
                            </div>
                        </div>


                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr className="table-dark">
                                    <th colSpan="1">Sr.</th>
                                    <th colSpan="1" className="text-center">
                                        Customer Name
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Order ID
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Contact
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Pending Profit
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Profit Status
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Pay Profit
                                    </th>
                                    <th colSpan="1" className="text-center">
                                        Detail
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfits.length > 0 ? (
                                    filteredProfits.map((item, key) => (
                                        <tr key={key}>
                                            <td colSpan="1" className="text-center">{key + 1}</td>
                                            <td colSpan="1" className="text-center">{item?.user?.name}</td>
                                            <td colSpan="1" className="text-center"><Link to={`/admin/orderproduct/details/${item?._id}`}>{item?.id}</Link></td>
                                            <td colSpan="1" className="text-center">{item?.user?.city}</td>
                                            <td colSpan="1" className="text-center">{item?.profitAmount}</td>
                                            <td colSpan="1" className="text-center">{item?.profitStatus}</td>
                                            <td colSpan="1" className="text-center"><button disabled={item?.profitAmount <= 0 || item?.profitStatus === "Paid"} onClick={() => paySingleProfits(item?.user?._id, item?.profitAmount, item?._id)} className="btn btn-primary">Pay Profit </button></td>
                                            <td colSpan="1" className="text-center"><Link to={`/admin/orderproduct/details/${item?._id}`}><button className="btn btn-primary">Detail</button></Link></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {/* No data message */}
                                            No pending profits found in the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* ... */}
                    </div>
                </div>
            )}
        </>
    );
};

export default PendingByOrder;
