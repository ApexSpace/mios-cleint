import React, { Component } from "react";
// import Moment from 'moment';
// import ShippingDetails from "../Shippingcost/ShippingDetails";
// import { Link } from "react-router-dom";
const image = window.location.origin + "/Assets/no-data.svg";
class DropshipPaid extends Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      loading: false,
      checked: false,
    };
  }
  host = process.env.REACT_APP_API_URL;
  async componentDidMount() {
    let url = `${this.host}/api/profit/paidprofit`;
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
    let updatedUser = `${this.host}/api/order/dropshiporder`
    let uUser = await fetch(updatedUser);
    let usr = await uUser.json();
    this.setState({ orders: usr });
  };


  handleDelete = async (id) => {
        // let url = `http://localhost:5000/api/product/deleteproduct/${id}`;
        // let data = await fetch(url, {
        //   method: "DELETE",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NjY1OTllNmYxZGIwNWQ4NzVjZDM3In0sImlhdCI6MTY1MTkyNjQyNn0.4sT98Nu8Q5ad87buKzYarR8KzpPyeL_9RWf8q7JdjQk"
        //   },
        // });
        // let updatedOrder = `http://localhost:5000/api/order/allorders`
        // let uOrder = await fetch(updatedOrder);
        // let pro = await uOrder.json();
        // this.setState({ products: pro });
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
              <th colSpan="1" className="text-center">Customer Name</th>
              {/* <th colSpan="1" className="text-center">Company Name</th> */}
              {/* <th colSpan="1" className="text-center">Contact</th> */}
              <th colSpan="1" className="text-center">Paid Profit</th>
              <th colSpan="1" className="text-center">Profit Details</th>
            </tr>
          </thead>
          <tbody>
          {this.state.orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>{this.state.orders.indexOf(order) + 1}</td>
                  <td className="text-center">{order.name}</td>
                  {/* <td className="text-center">Apex Space</td> */}
                  {/* <td className="text-center">03164322144</td> */}
                  <td className="text-center" >{order.profit}</td>
                  <td className="text-center">{order.name}</td>
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


export default (DropshipPaid);