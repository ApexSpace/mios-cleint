import React, { Component } from "react";
import Moment from 'moment';
const image = window.location.origin + "/Assets/no-data.svg";
class Payments extends Component {
  constructor() {
    super();
    this.state = {
      payment: [],
      loading: false,
    };
  }
  host = process.env.REACT_APP_API_URL;

  async componentDidMount() {
    let url = `${this.host}/api/payment/paidpayments`;
    this.setState({ loading: true });
    let data = await fetch(url ,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      });
    data = await data.json();
    this.setState({ loading: false, payment: data });
  }



  handleDelete = async (id) => {

  }



  render() {
    return (
      <>
        <div className="main">
        <div className="container-fluid">
        <table className="table table-hover table-bordered">
          <thead>
            <tr className="table-dark">
              <th colSpan="1" >Sr.</th>
              <th colSpan="1" className="text-center">Order ID</th>
              <th colSpan="1" className="text-center">Date</th>
              <th colSpan="1" className="text-center">Shipping Details</th>
              <th colSpan="1" className="text-center">Payment Amount</th>
              <th colSpan="1" className="text-center">Payment Status</th>
              <th colSpan="1" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>


            {this.state.payment.map((payment) => {
              return (
                <tr key={payment._id}>
                  <td>{this.state.payment.indexOf(payment) + 1}</td>
                  <td className="text-center">{payment.orderId._id}</td>
                  <td className="text-center">{Moment(payment.date).format('DD-MMM-YYYY')}</td>
                  <td className="text-center">{payment.shippingdetails.name}</td>
                  <td className="text-center">{payment.paymentAmount}</td>
                  <td className="text-center">{payment.orderId.payment === true ? "Paid" : "Pending" }</td>
                  <td className="text-center">Edit | <span onClick={() => this.handleDelete(payment._id)}>Delete</span></td>
                  </tr>
              );  
            })}
          </tbody>
        </table>
        {this.state.payment.length === 0 && <div className='no_data'> 
            <img className='no_data-img' src={image} alt='No Data' ></img>
            </div>} 
        </div>
        </div>
      </>
    );
  }
}


export default Payments;