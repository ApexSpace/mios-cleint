import { React, useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import axios from "axios";
// import moment from "moment";
// import "./Order.css";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { ReactNotifications } from "react-notifications-component";
import Notification from "../../Notifications/Notifications";
// import { DateRangePicker } from 'react-date-range';
const image = window.location.origin + "/Assets/no-data.svg";

const SalesReport = () => {
  const host = process.env.REACT_APP_API_URL;

  const modalRef = useRef(null);
  // const closeRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [details, setDetails] = useState([]);
  const [checkFilter, setfeatured] = useState({
    shippingStatus: false,
    unshippingStatus: false,
    orderStatus: false
  });


  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  const getOrders = async () => {
    setLoading(true);
    const { data } = await axios.post(`${host}/api/order/allSales`, { startDate: from, endDate: to });
    console.log(data)
    setOrders(data);
    setFilteredRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    getOrders();

    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  const onChecked = (e) => {
    setChecked(!checked);
  };

  const setFilters = (e) => {
    setfeatured({ ...checkFilter, [e.target.name]: e.target.checked });
    if (e.target.checked) {
      if (e.target.name === "unshippingStatus") {
        setFilteredRecords(orders.filter((pro) => {
          return pro.shippingStatus === false;
        }));

      } else if (e.target.name === "shippingStatus") {
        setFilteredRecords(orders.filter((pro) => {
          return pro.shippingStatus === true;
        }));
      } else {
        setFilteredRecords(orders.filter((pro) => {
          return pro.orderStatus === "Pending";
        }));
      }

    } else {
      setFilteredRecords(orders);
    }
  };

  const handlePayment = async (id) => {
    if (window.confirm("Are you sure you want to verify payment?")) {
      await axios
        .put(`${host}/api/order/verifyorderpayment/${id}`)
        .then((res) => {
          getOrders();
        })
        .catch((err) => {
          window.alert("Something went wrong");
        });
    }
  };

  const handleShipping = (id) => {
    modalRef.current.click();
    let order = orders.find((order) => order._id === id);
    setDetails(order.shippingDetails);
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
    getOrders();
  };

  // const handleDelete = async (id) => {
  //     let url = `${host}/api/product/deleteproduct/${id}`;
  //     await fetch(url, {
  //         method: "DELETE",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //     });
  //     getOrders();
  // };

  const handleReverse = async (id) => {
    axios.put(`${host}/api/order/reverseorder/${id}`)
      .then(res => {
        getOrders()
      })
      .catch(err => {
        window.alert("Something went wrong")
      })
  }

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

  const csVDataDownload = filteredRecords.map((item,ind) => {
    return {
      "Sr": ind+1,
      "From": from,
      "To": to,
      "ProductId": item.productId,
      "Image": item?.quantities[0].productPhoto,
      "Title": item?.quantities[0].productPhoto,
      "WholeSale Quantity Ordered": item?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalQuantity ? item?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalQuantity : 0,
      "Dropship Quantity Ordered": item?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalQuantity ? item?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalQuantity : 0,
      "Wholesale Sales": item?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalPrice ? item?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalPrice : 0,
      "DropShip Sales": item?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalPrice ? item?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalPrice : 0
    };
  });

  const csv = Papa.unparse(csVDataDownload);
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = "Orders.csv";
    document.body.appendChild(element);
    element.click();
  };

  const filter = async () => {
    // if (
    //   to &&
    //   from &&
    //   new Date(from).toISOString() <= new Date(to).toISOString()
    // ) {
    //   const startUTC = new Date(from).toISOString();
    //   let endUTC = new Date(to);
    //   endUTC.setUTCHours(23, 59, 59, 999);
    //   endUTC = endUTC.toISOString();
    //   if (startUTC && endUTC) {
    //     const filtered = orders?.filter((record) => {
    //       let recordDate = new Date(record.date);
    //       recordDate.setUTCHours(recordDate.getUTCHours() + 5);
    //       recordDate = recordDate.toISOString();
    //       return recordDate >= startUTC && recordDate <= endUTC;
    //     });
    //     setFilteredRecords(filtered);
    //   } else {
    //     Notification("Error", "Enter Valid Dates", "danger");
    //   }
    // } else {
    //   Notification("Error", "Enter Valid Dates", "danger");
    // }
    await getOrders()
  };


  return (
    <>
      <ReactNotifications />
      {loading ? (
        <Loader />
      ) : (
        <>
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
          <div className="main">
            <div className="container-fluid">
              <div className="row my-4">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <h3 className="text-center ">Sales Details</h3>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-primary " onClick={download}>
                    Export
                  </button>
                </div>
              </div>
              {/* <DateRangePicker
                                ranges={[selectionRange]}
                                onChange={handleSelect}
                            /> */}
              {/* <div className="d-flex flex-row mt-2">
                <div className="ms-auto me-5">
                  <div className="form-check">
                    <input className="form-check-input" name="shippingStatus" value={checkFilter.shippingStatus} onChange={setFilters} type="checkbox" id="flexCheckDefault" />
                    <small className="form-check-label" for="flexCheckDefault">
                      Delivered
                    </small>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" name="unshippingStatus" value={checkFilter.unshippingStatus} onChange={setFilters} type="checkbox" id="flexCheckChecked" />
                    <small className="form-check-label" for="flexCheckChecked">
                      Not Delivered
                    </small>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" name="orderStatus" value={checkFilter.orderStatus} onChange={setFilters} type="checkbox" id="flexCheckChecked" />
                    <small className="form-check-label" for="flexCheckChecked">
                      Pending
                    </small>
                  </div>
                </div>
              </div> */}
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="1" className="text-center align-middle">
                      Sr.
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Image
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Title
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      WholeSale Quantity Ordered
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Dropship Quantity Ordered
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Wholesale Sales
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      DropShip Sales
                    </th>
                    {/* <th colSpan="1" className="text-center align-middle">
                                            Actions
                                        </th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords?.map((order, k) => {
                    // let date = new Date(order.date);
                    return (
                      <tr className="text-center align-middle" key={order._id}>
                        <td>{k + 1}</td>
                        <td className="text-center align-middle hover-pointer ">
                          <img src={order?.quantities[0].productPhoto} width={'50px'} />
                        </td>
                        <td className="text-center align-middle align-middle">
                          {order?.quantities[0].productName}
                        </td>
                        <td className="text-center align-middle">
                          {order?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalQuantity ? order?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalQuantity : 0}
                        </td>
                        <td className="text-center align-middle hover-pointer">
                          {order?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalQuantity ? order?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalQuantity : 0}
                        </td>
                        <td className="text-center align-middle">
                          Rs.  {order?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalPrice ? order?.quantities?.find((i) => i?.userRole === "wholeseller")?.totalPrice : 0}
                        </td>
                        <td className="text-center align-middle">
                          Rs. {order?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalPrice ? order?.quantities?.find((i) => i?.userRole === "dropshipper")?.totalPrice : 0}
                        </td>

                        <td className="text-center align-middle">

                        </td>
                        {/* <td className="text-center align-middle">
                                                    {
                                                        order.orderType === "Wholesale" ? (
                                                        <Link to={`/admin/editwholesaleorder/${order._id}`}>
                                                            <span className="edit-delete">Edit </span>
                                                        </Link>
                                                    ) : (
                                                        <Link to={`/admin/editdropshiporder/${order._id}`}>
                                                            <span className="edit-delete">Edit </span>
                                                        </Link>
                                                    )
                                                    }

                                                   
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
      )}
    </>
  );
};

export default SalesReport;

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
