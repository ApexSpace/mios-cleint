import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import Loader from "../../Loader/Loader";
import { useNavigate } from "react-router-dom";

const PendingOrders = () => {
  const host = process.env.REACT_APP_API_URL;
  // const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderLoading, setloading] = useState(false);
  const { loading } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const getOrders = async () => {
      setloading(true);
      const { data } = await axios.get(`${host}/api/order/pendingOrders`);
      setOrders(data);
      setloading(false);
    };
    getOrders();

    // eslint-disable-next-line
  }, []);

  const handleEdit = (id, order) => {
    if (
      window.confirm(
        "Are you sure you want to edit this order? Clicking 'OK' will delete this order and clear your current cart. The order will then be added back to your cart for editing, allowing you to make changes and place it again."
      )
    ) {
      axios
        .put(`${host}/api/order/edituserorder/${id}`, order)
        .then((res) => {
          //window.location.reload();
          navigate(host + "/cart");
        })
        .catch((err) => {
          // console.log(err)
        });
    }
  };

  return (
    <div>
      {loading || orderLoading ? (
        <Loader />
      ) : (
        <>
          <h1 style={{ textAlign: "center" }}>My Orders</h1>
          <table
            className="table table-striped table-responsive table-hover"
            width={"90%"}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>Shipping Charges</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((item, ind) => {
                  var date = new Date(item.date);
                  var d = date.getDate();
                  var m = date.getMonth() + 1;
                  var y = date.getFullYear();
                  var h = date.getHours();
                  var min = date.getMinutes();
                  return (
                    <tr key={ind}>
                      <td>{item.id}</td>
                      <td>{item.shippingDetails.name}</td>
                      <td>{item.shippingDetails.phone}</td>
                      <td>{item.shippingDetails.address}</td>
                      <td>{item.shippingDetails.city}</td>
                      <td>{item.shippingPrice}</td>
                      <td>{item.orderAmount}</td>
                      <td>{item.paymentOption}</td>
                      <td>{`${d}/${m}/${y} at ${h}:${min}`}</td>
                      <td>{item.orderStatus}</td>
                      <td>
                        <span
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() => {
                            handleEdit(item._id, item);
                          }}
                        >
                          Edit
                        </span>{" "}
                        |&nbsp;
                        <span style={{ cursor: "pointer", color: "red" }}>
                          Delete
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PendingOrders;
