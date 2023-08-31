import React, { Component } from "react";
import moment from "moment";
import "./Order.css";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
const image = window.location.origin + "/Assets/no-data.svg";
class DropshipOrder extends Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      loading: false,
      checked: false,
      details: [],
    };
    this.modalRef = React.createRef();
    this.closeRef = React.createRef();
  }
  host = process.env.REACT_APP_API_URL;
  async componentDidMount() {
    let url = `${this.host}/api/order/dropshiporder`;
    this.setState({ loading: true });
    let data = await fetch(url);
    data = await data.json();
    this.setState({ loading: false, orders: data });
  }

  onChecked = (e) => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  handlePayment = async (_id) => {
    let url = `${this.host}/api/order/changepaymentstatus/${_id}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let updatedUser = `${this.host}/api/order/dropshiporder`;
    let uUser = await fetch(updatedUser);
    let usr = await uUser.json();
    this.setState({ orders: usr });
  };

  handleShipping = (id) => {
    this.modalRef.current.click();
    let order = this.state.orders.find((order) => order._id === id);
    this.setState({ details: order.shippingDetails });
  };

  handleShipStatus = async (id) => {
    let url = `${this.host}/api/order/changeshippingstatus/${id}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let updatedUser = `${this.host}/api/order/dropshiporder`;
    let uUser = await fetch(updatedUser);
    let usr = await uUser.json();
    this.setState({ orders: usr });
  };

  handleOrderStatues = async (id, orderStatus) => {
    let url = `${this.host}/api/order/changeorderstatus/${id}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus }),
    });
    let updatedUser = `${this.host}/api/order/dropshiporder`;
    let uUser = await fetch(updatedUser);
    let usr = await uUser.json();
    this.setState({ orders: usr });
  };

  handleDelete = async (id) => {
    let url = `${this.host}/api/product/deleteproduct/${id}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let updatedOrder = `${this.host}/api/order/allorders`
    let uOrder = await fetch(updatedOrder);
    let pro = await uOrder.json();
    this.setState({ products: pro });
  };

  render() {
    return (
      <>{this.state.loading ? <Loader /> : <>
        <div className="main">
          <div className="container-fluid">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-dark">
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
                  <th colSpan="1" className="text-center align-middle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.orders.map((order) => {
                  return (
                    <tr className="text-center align-middle" key={order._id}>
                      <td>{this.state.orders.indexOf(order) + 1}</td>
                      <td className="text-center align-middle">
                        {order.shippingDetails.name}
                      </td>
                      <td className="text-center align-middle">
                        {moment(order.date).format("DD-MMM-YYYY")}
                      </td>
                      <td className="text-center align-middle hover-pointer">
                        <span
                          className="btn btn-primary btn-sm"
                          onClick={() => this.handleShipping(order._id)}
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
                            onChange={() => this.handlePayment(order._id)}
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
                                this.handleOrderStatues(order._id, "Returned")
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
                                this.handleOrderStatues(order._id, "Delivered")
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

                        {/* {order.orderStatus === "Pending" ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm mb-2"
                              onClick={() =>
                                this.handleOrderStatues(order._id, "Returned")
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
                                this.handleOrderStatues(order._id, "Delivered")
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
                        ) : order.orderStatus === "Delivered" ? (
                          <button className="btn btn-primary btn-sm">
                            Delivered
                          </button>
                        ) : order.orderStatus === "Returened" ? (
                          <button className="btn btn-primary btn-sm">
                            Returened
                          </button>
                        ) : (
                          <button className="btn btn-primary btn-sm">
                            {order.orderStatus}
                          </button> // Add default case here
                        )} */}
                      </td>
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => this.handleOrderStatues(order._id)}
                          disabled={
                            order.shippingStatus === false ? true : false
                          }
                        >
                          {order.orderStatus === "Delivered"
                            ? "Click to undeliver"
                            : "Undelivered"}
                        </button>
                      </td>
                      <td className="text-center align-middle">
                        <Link to={`/admin/editdropshiporder/${order._id}`}>
                          <span className="edit-delete">Edit </span>
                        </Link>
                        |
                        <span
                          className="edit-delete"
                          onClick={() => this.handleDelete(order._id)}
                        >
                          Delete
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {this.state.orders.length === 0 && (
              <div className="no_data">
                <img className="no_data-img" src={image} alt="No Data"></img>
              </div>
            )}
          </div>
        </div>
        <button
          ref={this.modalRef}
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
                      <td>{this.state.details.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">E-mail</th>
                      <td>{this.state.details.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">City</th>
                      <td>{this.state.details.city}</td>
                    </tr>
                    <tr>
                      <th scope="row">Address</th>
                      <td>{this.state.details.address} </td>
                    </tr>
                    <tr>
                      <th scope="row">Phone</th>
                      <td>{this.state.details.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>}</>
    );
  }
}

export default DropshipOrder;
