import { React, useEffect, useState, useRef } from 'react'
import axios from "axios";
// import moment from "moment";
import "./Order.css";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { DateRangePicker } from 'react-date-range';
const image = window.location.origin + "/Assets/no-data.svg";

const WholesaleOrder = () => {

    const host = process.env.REACT_APP_API_URL;

    const modalRef = useRef(null);
    // const closeRef = useRef(null);
    const [orders, setOrders] = useState([])
    // eslint-disable-next-line
    const [allOrders, setAllOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [details, setDetails] = useState([])
    // const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());

    const getOrders = async () => {
        setLoading(true)
        const { data } = await axios.get(`${host}/api/order/allorders`);
        setOrders(data)
        setAllOrders(data)
        setLoading(false)
    }

    useEffect(() => {
        getOrders()

        // eslint-disable-next-line
    }, [])

    
    // eslint-disable-next-line
    const onChecked = (e) => {
        setChecked(!checked)
    };

    const handlePayment = async (_id) => {
        let url = `${host}/api/order/changepaymentstatus/${_id}`;
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let updatedUser = `${host}/api/order/allorders`;
        let uUser = await fetch(updatedUser);
        let usr = await uUser.json();
        setOrders(usr)
    };

    const handleShipping = (id) => {
        modalRef.current.click();
        let order = orders.find((order) => order._id === id);
        setDetails(order.shippingDetails)
    };

    const handleOrderStatues = async (id, orderStatus) => {
        let url = `${host}/api/order/changeorderstatus/${id}`;
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderStatus }),
        });
        let updatedUser = `${host}/api/order/allorders`;
        let uUser = await fetch(updatedUser);
        let usr = await uUser.json();
        setOrders(usr);
    };

    const handleDelete = async (id) => {
        let url = `${host}/api/product/deleteproduct/${id}`;
        await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let updatedOrder = `${host}/api/order/allorders`;
        let uOrder = await fetch(updatedOrder);
        let pro = await uOrder.json();
        setOrders(pro);
    };

    // const handleSelect = (date) => {
    //     let filteredOrders = allOrders.filter((order) => {
    //         let productDate = new Date(order.date);
    //         return (
    //             productDate >= date.selection.startDate &&
    //             productDate <= date.selection.endDate
    //         );
    //     });
    //     setStartDate(date.selection.startDate);
    //     setEndDate(date.selection.endDate);
    //     setOrders(filteredOrders);
    // };

    // const selectionRange = {
    //     startDate: startDate,
    //     endDate: endDate,
    //     key: 'selection',
    // }

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <div className="main">
                        <div className="container-fluid">
                            <h3 className='text-center my-4'>
                                Wholesale Orders
                            </h3>
                            {/* <DateRangePicker
                                ranges={[selectionRange]}
                                onChange={handleSelect}
                            /> */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan="1" className="text-center align-middle">
                                            Sr.
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Customer Name
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Order Date
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Shipping Details
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Order Amount
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Type
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Product Details
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Payment Status
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Shipping Status
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Order Status
                                        </th>
                                        <th colSpan="1" className="text-center align-middle">
                                            Un Delivered
                                        </th>
                                        {/* <th colSpan="1" className="text-center align-middle">
                                            Actions
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        let date = new Date(order.date);
                                        return (
                                            <tr className="text-center align-middle" key={order._id}>
                                                <td>{order.id}</td>
                                                <td className="text-center align-middle">
                                                    {order.shippingDetails.name}
                                                </td>
                                                <td className="text-center align-middle">
                                                    {date.toLocaleDateString()}
                                                </td>
                                                <td className="text-center align-middle hover-pointer">
                                                    <span
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleShipping(order._id)}
                                                        title="Shipping Details"
                                                    >
                                                        Details
                                                    </span>
                                                </td>
                                                <td className="text-center align-middle">
                                                    {order.orderAmount}
                                                </td>
                                                <td className="text-center align-middle">
                                                    {order.orderType}
                                                </td>
                                                <td className="text-center align-middle hover-pointer ">
                                                    <Link to={`/admin/orderproduct/details/${order._id}`}>
                                                        <span className="btn btn-primary btn-sm">
                                                            Details
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td className="text-center align-middle align-middle">
                                                    <label className="switch">
                                                        <input
                                                            onChange={() => handlePayment(order._id)}
                                                            type="checkbox"
                                                            checked={order.payment}
                                                        />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td className="text-center align-middle">
                                                    <button
                                                        className="btn btn-primary btn-sm text-white"
                                                        disabled={
                                                            order.shippingStatus === true ? true : false
                                                        }
                                                    >
                                                        <Link
                                                            to={`/admin/updateshippingstatus/${order._id}`}
                                                            className="text-white"
                                                        >
                                                            {order.shippingStatus === true
                                                                ? "Shipped"
                                                                : "Pending"}
                                                        </Link>
                                                    </button>
                                                </td>
                                                <td className="text-center align-middle">
                                                    {order.orderStatus === "Pending" ? (
                                                        <>
                                                            <button
                                                                className="btn btn-primary btn-sm mb-2"
                                                                onClick={() =>
                                                                    handleOrderStatues(order._id, "Returned")
                                                                }
                                                                disabled={
                                                                    order.shippingStatus === false ? true : false
                                                                }
                                                            >
                                                                {order.orderStatus === "Returned"
                                                                    ? "Returned"
                                                                    : "Order Return"}
                                                            </button>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() =>
                                                                    handleOrderStatues(order._id, "Delivered")
                                                                }
                                                                disabled={
                                                                    order.shippingStatus === false ? true : false
                                                                }
                                                            >
                                                                {order.orderStatus === "Delivered"
                                                                    ? "Delivered"
                                                                    : "Order Deliver"}
                                                            </button>
                                                        </>
                                                    ) : (<button className="btn btn-primary btn-sm">
                                                        {order.orderStatus}
                                                    </button>)}
                                                </td>
                                                <td className="text-center align-middle">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleOrderStatues(order._id)}
                                                        disabled={
                                                            order.shippingStatus === false ? true : false
                                                        }
                                                    >
                                                        {order.orderStatus === "Delivered"
                                                            ? "Click to undeliver"
                                                            : "Undelivered"}
                                                    </button>
                                                </td>
                                                {/* <td className="text-center align-middle">
                                                    <Link to={`/admin/editwholesaleorder/${order._id}`}>
                                                        <span className="edit-delete">Edit </span>
                                                    </Link>
                                                    |
                                                    <span
                                                        className="edit-delete"
                                                        onClick={() => handleDelete(order._id)}
                                                    >
                                                        Delete
                                                    </span>
                                                </td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {orders.length === 0 && (
                                <div className="no_data">
                                    <img className="no_data-img" src={image} alt="No Data"></img>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        ref={modalRef}
                        type="button"
                        className="btn btn-primary d-none"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Launch demo modal
                    </button>

                    <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Shipping Details
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Name</th>
                                                <td>{details.name}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">E-mail</th>
                                                <td>{details.email}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">City</th>
                                                <td>{details.city}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Address</th>
                                                <td>{details.address} </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Phone</th>
                                                <td>{details.phone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default WholesaleOrder










// import React, { Component } from "react";
// import Moment from 'moment';
// import "./Order.css";
// const image = window.location.origin + "/Assets/no-data.svg";
// class Order extends Component {
//   constructor() {
//     super();
//     this.state = {
//       orders: [],
//       loading: false,
//       checked: false,
//     };
//   }
//   host = process.env.REACT_APP_API_URL;
//   async componentDidMount() {
//     let url = `${this.host}/api/order/allorders`;
//     this.setState({ loading: true });
//     let data = await fetch(url);
//     data = await data.json();
//     this.setState({ loading: false, orders: data });
//   }

//   onChecked = (e) => {
//     this.setState({
//       checked: !this.state.checked,
//     });
//   };

//   handlePayment = async (_id) => {
//     let url = `${this.host}/api/order/changepaymentstatus/${_id}`;
//     await fetch(url, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     let updatedUser = `${this.host}/api/order/allorders`
//     let uUser = await fetch(updatedUser);
//     let usr = await uUser.json();
//     this.setState({ orders: usr });
//   };


//   handleDelete = async (id) => {
//         // let url = `${this.host}/api/product/deleteproduct/${id}`;
//         // let data = await fetch(url, {
//         //   method: "DELETE",
//         //   headers: {
//         //     "Content-Type": "application/json",
//         //   },
//         // });
//         // let updatedOrder = `${this.host}/api/order/allorders`
//         // let uOrder = await fetch(updatedOrder);
//         // let pro = await uOrder.json();
//         // this.setState({ products: pro });
//   }



//   render() {
//     return (
//       <>
//         <div className="main">
//         <div className="container-fluid">
//         <table className="table table-hover table-bordered">
//           <thead>
//             <tr className="table-dark">
//               <th colSpan="1" >Sr.</th>
//               <th colSpan="1" className="text-center">Customer Name</th>
//               <th colSpan="1" className="text-center">Order Date</th>
//               <th colSpan="1" className="text-center">Type</th>
//               <th colSpan="1" className="text-center">Shipping Details</th>
//               <th colSpan="1" className="text-center">Amount</th>
//               <th colSpan="1" className="text-center">Product Details</th>
//               <th colSpan="1" className="text-center">Payment Status</th>
//               <th colSpan="1" className="text-center">Shipping Status</th>
//               <th colSpan="1" className="text-center">Order Status</th>
//               {/* <th colSpan="1" className="text-center">Actions</th> */}
//             </tr>
//           </thead>
//           <tbody>


//             {this.state.orders.map((order) => {
//               return (
//                 <tr key={order._id}>
//                   <td>{this.state.orders.indexOf(order) + 1}</td>
//                   <td className="text-center">{order.user}</td>
//                   <td className="text-center">{Moment(order.date).format('DD-MMM-YYYY')}</td>
//                   <td className="text-center">{order.orderType}</td>
//                   <td className="text-center" ><input
//                         type="checkbox"
//                         className="custom-control-input mx-2 cursor-pointer"
//                         id="pSale"
//                         checked={this.state.checked}
//                         onChange={this.onChecked}
//                       /></td>

//                     {this.state.checked ? (
//                     <div className="col-sm-2">
//                       <div className="tooltips">
                        
//                         </div>
//                     </div>
//                   ) : null}
//                   <td className="text-center">{order.orderAmount}</td>
//                   <td className="text-center">{order.orderDetails}</td>
//                   <td className="text-center align-middle" ><label className="switch"> 
//                     <input onChange={() => this.handlePayment(order._id) } type="checkbox" checked={order.payment}/>
//                     <span></span>
//                   </label></td>
//                   <td className="text-center"><button className="btn btn-primary btn-sm"
//                   disabled={order.payment === false ? true : false}
//                     >{order.shippingStatus === true ? "Shipped" : "Unshipped" }</button></td>
//                   <td className="text-center"><button className="btn btn-primary btn-sm" disabled={order.payment === false ? true : false}>{order.orderStatus === true ? "Delivered" : "Undelivered"}</button></td>
//                   {/* <td className="text-center">Edit | <span onClick={() => this.handleDelete(order._id)}>Delete</span></td> */}
//                   </tr>
//               );  
//             })}
//           </tbody>
//         </table>
//         {this.state.orders.length === 0 && <div className='no_data'> 
//             <img className='no_data-img' src={image} alt='No Data' ></img>
//             </div>} 
//         </div>
//         </div>
//       </>
//     );
//   }
// }


// export default (Order);