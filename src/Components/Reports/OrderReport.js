import React, { Component } from "react";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from "moment";
import "./Report.css"
const image = window.location.origin + "/Assets/no-data.svg";

class OrderReport extends Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      loading: false,
      checked: false,
      odate: "",
    };
  }
  host = process.env.REACT_APP_API_URL;

  async componentDidMount() {
    let url = `${this.host}/api/order/allorders`;
    this.setState({ loading: true });
    let data = await fetch(url);
    data = await data.json();
    this.setState({ loading: false, orders: data });
  }



  onChange = async (e) => {
    this.setState({ [e.target.name]: (e.target.value ) });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let date = new Date(this.state.odate);
    let edate = moment(date).format("YYYY-MM-DD");
    let url = `${this.host}/api/order/search/${edate}`;
    this.setState({ loading: true });
    let data = await fetch(url 
      , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          },
          });
    data = await data.json();
    this.setState({ loading: false, orders: data });

  }

  render() {
    return (
      <>
        <div className="main">
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
          <form method="post" onSubmit={this.onSubmit}>
                <div className="d-flex justify-content-center">
                    <input type="text" className="form-control mb-2" placeholder="Search By Date" id="odate" name="odate" onChange={this.onChange} required />
                  <button type="submit"  className="btn btn-primary btn-sm d-none">
                    Search
                  </button>
                </div>
              </form>
              {/* {this.state.orders.length !== 0 && (
        <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-primary btn-sm mb-2"
                    table="table-to-xls"
                    filename="Order Report"
                    sheet="Order Report"
                    buttonText="Export to Excel"/>)} */}
          </div>
        <table className="table table-hover table-bordered d-none" id="table-to-xls">
          <thead>
            <tr className="table-dark">
              <th colSpan="1" className="align-middle text-center">Sr.</th>
              <th colSpan="1" className="text-center align-middle">Customer Name</th>
              <th colSpan="1" className="text-center align-middle">Order Date</th>
              <th colSpan="1" className="text-center align-middle">Type</th>
              <th colSpan="1" className="text-center align-middle">Amount</th>
              <th colSpan="1" className="text-center align-middle">Product Title</th>
              <th colSpan="1" className="text-center align-middle">Product Wholesale Price</th>
              <th colSpan="1" className="text-center align-middle">Product Discounted Price</th>
              <th colSpan="1" className="text-center align-middle">Product Quantity</th>
              <th colSpan="1" className="text-center align-middle">Product Subtotal</th>
              <th colSpan="1" className="text-center align-middle">Payment Status</th>
              <th colSpan="1" className="text-center align-middle">Shipping Status</th>
              <th colSpan="1" className="text-center align-middle">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td className="align-middle text-center">{this.state.orders.indexOf(order) + 1}</td>
                  <td className="text-center align-middle">{order.user}</td>
                  <td className="text-center align-middle">{moment(order.date).format('DD-MMM-YYYY')}</td>
                  <td className="text-center align-middle">{order.orderType}</td>
                  <td className="text-center align-middle">{order.orderAmount}</td>
                  <td className="text-center align-middle">{order.orderDetails.name}</td>
                  <td className="text-center align-middle">{order.orderDetails.wholesaleprice}</td>
                  <td className="text-center align-middle">{order.orderDetails.discountedprice}</td>
                  <td className="text-center align-middle">{order.orderDetails.qty}</td>
                  <td className="text-center align-middle">{order.orderDetails.subtotal}</td>
                  <td className="text-center align-middle">{order.payment === true ? "Paid" : "Pending" }</td>
                  <td className="text-center align-middle">{order.shippingStatus === true ? "Shipped" : "Pending" }</td> 
                  <td className="text-center align-middle">{order.orderStatus === true ? "Delivered" : "Pending" }</td>
                  </tr>
              );
            })}
          </tbody>
        </table>
        <table className="table table-hover table-bordered">
          <thead>
            <tr className="table-dark">
              <th colSpan="1" className="align-middle text-center">Sr.</th>
              <th colSpan="1" className="text-center align-middle">Customer Name</th>
              <th colSpan="1" className="text-center align-middle">Order Date</th>
              <th colSpan="1" className="text-center align-middle">Type</th>
              <th colSpan="1" className="text-center align-middle">Amount</th>
              {/* <th colSpan="1" className="text-center align-middle">Product Details</th> */}
              <th colSpan="1" className="text-center align-middle">Payment Status</th>
              <th colSpan="1" className="text-center align-middle">Shipping Status</th>
              <th colSpan="1" className="text-center align-middle">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td className="align-middle text-center">{this.state.orders.indexOf(order) + 1}</td>
                  <td className="text-center align-middle">{order.shippingdetails.name}</td>
                  <td className="text-center align-middle">{moment(order.date).format('DD-MMM-YYYY')}</td>
                  <td className="text-center align-middle">{order.orderType}</td>
                  <td className="text-center align-middle">{order.orderAmount}</td>
                  {/* <td className="text-center align-middle">{order.orderDetails}</td> */}
                  <td className="text-center align-middle">{order.payment === true ? "Paid" : "Pending" }</td>
                  <td className="text-center align-middle">{order.shippingStatus === true ? "Shipped" : "Pending" }</td> 
                  <td className="text-center align-middle">{order.orderStatus === true ? "Delivered" : "Pending" }</td>
                  </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.orders.length === 0 && <div className='no_data'> 
            <img className='no_data-img' src={image} alt='No Data' ></img>
            </div>} 
        </div>
        </div>
      </>
    );
  }
}


export default (OrderReport);