import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import Loader from "../../Loader/Loader";
import Notification from "../../Notifications/Notifications";


const OnSale = () => {
  const host = process.env.REACT_APP_API_URL;

  const { onSale, getOnSale, loading, setLoading } = useContext(ProductContext);

  useEffect(() => {
    getOnSale()
  }, [])
  const deleteProduct = async (e) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/api/product/deleteProduct/${e.currentTarget.id}`);
      await getOnSale();
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      Notification("Error", error.response.data, 'danger');
    }
  }
  return (
    <div>
      {loading ? null : <Link to="/admin/addProduct">
        <center><br />   <button className="btn btn-info">Add New Product</button> <br /></center>
      </Link>}
      <ReactNotifications /><br />
      {loading ? <Loader /> :
        <table className="table" width={"95%"}>
          <thead>
            <tr>
              <th>ID</th>
              <th>photo</th>
              <th>title</th>
              <th>category</th>
              <th>skuNumber</th>
              <th>stock</th>
              <th>Wholeseller Price</th>
              <th>Dropshipper Price</th>
              <th>featured</th>
              <th>onSale</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          {onSale && onSale.map((item, ind) => {
            return (
              <tbody key={ind}>
                <tr>
                  <td>{ind + 1}</td>
                  <td> <img src={item.photo.url} alt="" height="50px" width={"50px"} /> </td>
                  <td> {item.title} </td>
                  <td>{item.category.name}</td>
                  <td>{item.skuNumber}</td>
                  <td>{item.stock}</td>
                  <td>{item.wholesalePrice}</td>
                  <td>{item.dropshipperPrice}</td>
                  <td>{item.featured ? `Yes` : `No`}</td>
                  <td>{item.onSale ? `Yes` : `No`}</td>
                  <td><Link to={`/admin/product/edit/${item._id}`}><button className="btn btn-info" id={item._id} >Edit</button> </Link> </td>
                  <td><button id={item._id} className="btn btn-danger" onClick={deleteProduct} >Delete</button> </td>
                </tr>
              </tbody>
            )
          })}

        </table>}
    </div >
  );
}

export default OnSale;