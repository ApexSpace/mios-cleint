import { React, useEffect, useState, useRef } from "react";
import axios from "axios";
// import moment from "moment";
import "./Order.css";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { DateRangePicker } from 'react-date-range';
const image = window.location.origin + "/Assets/no-data.svg";

const ShippedDropship = () => {
  const host = process.env.REACT_APP_API_URL;

  const modalRef = useRef(null);
  // const closeRef = useRef(null);
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [checked, setChecked] = useState(false)
  const [details, setDetails] = useState([]);
  const paymentRef = useRef(null);
  const [payment, setPayment] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [courier, setCourier] = useState("");

  const getPayment = async (id, option) => {
    if (option === "Receipt") {
      let url = `${host}/api/order/paymentbyorderid/${id}`;
      const { data } = await axios.get(url);
      const obj = {
        option,
        photo: data.photo.url,
        transactionId: data.transactionId,
      };
      setPayment(obj);
    } else {
      setPayment({ option: "Cash on Delivery" });
    }
    paymentRef.current.click();
  };

  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  const getOrders = async () => {
    setLoading(true);
    const { data } = await axios.get(`${host}/api/order/dropshiporder`);
    setOrders(data);
    // setAllOrders(data)
    setFilteredRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    getOrders();

    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  // const onChecked = (e) => {
  //   setChecked(!checked)
  // };

  const handleShipping = async (id, method) => {
    modalRef.current.click();
    try {
      const tracking = await axios.get(`${host}/api/order/trackingid/${id}`);
      setTrackingId(tracking.data.trackingId); // Assuming setTrackingId updates your state with the API response
      setCourier(tracking.data.courierServiceName);
    } catch (error) {
      // Check if the error has a response (e.g., 404, 500)
      if (error.response.status === 404) {
        setTrackingId("Order Not Shipped yet");
        setCourier("Order Not Shipped yet");
      }
      console.error("Error Response:", error.response.data.msg);
    }
    let order = orders.find((order) => order._id === id);
    order.shippingDetails.paymentOption = method;
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
    let updatedUser = `${host}/api/order/dropshiporder`;
    let uUser = await fetch(updatedUser);
    let usr = await uUser.json();
    setOrders(usr);
    getOrders();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      axios.delete(`${host}/api/order/deleteorderadmin/${id}`).then((res) => {
        getOrders();
      });
    }
  };

  const handleReverse = async (id) => {
    axios
      .put(`${host}/api/order/reverseorder/${id}`)
      .then((res) => {
        getOrders();
      })
      .catch((err) => {
        window.alert("Something went wrong");
      });
  };

  // const handlePayment = async (id) => {
  //   if (window.confirm("Are you sure you want to verify payment?")) {
  //     await axios.put(`${host}/api/order/verifyorderpayment/${id}`)
  //       .then(res => {
  //         getOrders()
  //       })
  //       .catch(err => {
  //         window.alert("Something went wrong")
  //       })
  //   }
  // }

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

  const handleNameNumberSearch = (e) => {
    const search = e.target.value;
    if (search) {
      const filtered = orders?.filter((record) => {
        return (
          record?.billingDetails?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          record?.billingDetails?.phone
            ?.toLowerCase()
            .includes(search.toLowerCase())
        );
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(orders);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="d-flex w-80 align-items-center justify-content-evenly mb-3 mt-3">
            <div>
              <label for="" className="form-label">
                Search: &nbsp;&nbsp;&nbsp;
              </label>
              <input
                type="text"
                className="p-1"
                name="search"
                placeholder="By Name or Phone Number"
                onChange={handleNameNumberSearch}
              />
            </div>
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
              <h3 className="text-center my-4">Dropship Orders</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="1" className="text-center align-middle">
                      ID
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
                      Product Details
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
                    <th colSpan="1" className="text-center align-middle">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice().map((order) => {
                    let date = new Date(order.date);

                    return (
                      order.shippingStatus === true && (
                        <tr
                          className="text-center align-middle"
                          key={order._id}
                        >
                          <td>{order.id}</td>
                          <td className="text-center align-middle">
                            {order.billingDetails.name}
                          </td>
                          <td className="text-center align-middle">
                            {date.toLocaleDateString()}
                          </td>
                          <td className="text-center align-middle hover-pointer">
                            <span
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                handleShipping(order._id, order.paymentOption)
                              }
                              title="Shipping Details"
                            >
                              Details
                            </span>
                          </td>
                          <td className="text-center align-middle">
                            {order.orderAmount}
                          </td>

                          <td className="text-center align-middle hover-pointer ">
                            <Link
                              to={`/admin/orderproduct/details/${order._id}`}
                            >
                              <span className="btn btn-primary btn-sm">
                                Details
                              </span>
                            </Link>
                          </td>
                          <td className="text-center align-middle">
                            {order.shippingStatus === true ? (
                              <span className="text-success">Shipped</span>
                            ) : (
                              <Link
                                to={`/admin/updateshippingstatusD/${order._id}`}
                                className="text-white"
                              >
                                <button className="btn btn-primary btn-sm text-white">
                                  Click to ship
                                </button>
                              </Link>
                            )}
                          </td>
                          <td className="text-center align-middle">
                            {order.profitStatus === "Not Paid" ? (
                              order.shippingStatus === true ? (
                                order.orderStatus === "Pending" ? (
                                  <>
                                    <button
                                      className="btn btn-primary btn-sm mx-2"
                                      onClick={() =>
                                        handleOrderStatues(
                                          order._id,
                                          "Returned"
                                        )
                                      }
                                      disabled={
                                        order.shippingStatus === false
                                          ? true
                                          : false
                                      }
                                    >
                                      {order.orderStatus === "Returned"
                                        ? "Returned"
                                        : "Order Return"}
                                    </button>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() =>
                                        handleOrderStatues(
                                          order._id,
                                          "Delivered"
                                        )
                                      }
                                      disabled={
                                        order.shippingStatus === false
                                          ? true
                                          : false
                                      }
                                    >
                                      {order.orderStatus === "Delivered"
                                        ? "Delivered"
                                        : "Order Deliver"}
                                    </button>
                                  </>
                                ) : (
                                  <span className="">{order.orderStatus}</span>
                                )
                              ) : (
                                <span className="text-danger">Not Shipped</span>
                              )
                            ) : (
                              <span className="text-success">Profit Paid</span>
                            )}
                          </td>
                          <td className="text-center align-middle">
                            {order.profitStatus === "Not Paid" ? (
                              order.orderStatus !== "Pending" ? (
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => {
                                    handleReverse(order._id);
                                  }}
                                >
                                  Reverse Order
                                </button>
                              ) : (
                                <span>Order Pending</span>
                              )
                            ) : (
                              <span className="text-success">Profit Paid</span>
                            )}
                          </td>
                          <td className="text-center align-middle">
                            <Link to={`/admin/editdropshiporder/${order._id}`}>
                              <span className="edit-delete">Edit</span>
                            </Link>
                            &nbsp;|&nbsp;
                            <span
                              className="edit-delete"
                              onClick={() => handleDelete(order._id)}
                            >
                              Delete
                            </span>
                          </td>
                        </tr>
                      )
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
                      <tr>
                        <th scope="row">Payment Method</th>
                        <td>{details.paymentOption}</td>
                      </tr>
                      <tr>
                        <th scope="row">Tracking Number</th>
                        <td>{trackingId && trackingId}</td>
                      </tr>
                      <tr>
                        <th scope="row">Courier Service</th>
                        <td>{courier && courier}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <button
            ref={paymentRef}
            type="button"
            className="btn btn-primary d-none"
            data-bs-toggle="modal"
            data-bs-target="#paymentModal"
          >
            Launch demo modal
          </button>
          <div
            className="modal fade"
            id="paymentModal"
            tabIndex="-1"
            aria-labelledby="paymentModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="paymentModalLabel">
                    Payment Details
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
                        <th scope="row">Payment Option</th>
                        <td>{payment.option}</td>
                      </tr>
                      {payment.option === "Receipt" && (
                        <tr>
                          <th scope="row">Transaction Id</th>
                          <td>{payment.transactionId}</td>
                        </tr>
                      )}

                      {payment.option === "Receipt" && (
                        <tr>
                          <th scope="row">Click Image to Open</th>
                          <td>
                            <a href={payment.photo}>
                              <img
                                height={"200px"}
                                width={"200px"}
                                src={payment.photo}
                              />
                            </a>
                          </td>
                        </tr>
                      )}
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

export default ShippedDropship;
