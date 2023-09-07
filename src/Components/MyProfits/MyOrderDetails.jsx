import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";

const MyOrderDetails = () => {
  const host = process.env.REACT_APP_API_URL;
  const [orderProduct, setOrderProduct] = useState([]);
  const [loading, setLoader] = useState(false)
  const params = useParams();
  let { id } = params;

  const getOrderProducts = async () => {
    let url = `${host}/api/order/orderproduct/${id}`;
    setLoader(true)
    let data = await fetch(url);
    data = await data.json();
    setOrderProduct(data);
    setLoader(false)
  };

  useEffect(() => {
    getOrderProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="container mt-3">
        {loading ? <Loader /> : <><h2 className="text-center">Product Details</h2>
          <h3 className="text-center">  Ordered By: {orderProduct?.user?.name}({orderProduct?.user?.role})</h3>
          <h6 className="text-center">  ID: {orderProduct?.user?._id}</h6><br />
          <h3 className="text-center">  Ordered At: {new Date(orderProduct?.date).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</h3><br />
          {orderProduct?.user?.role === "dropshipper" && <h3 className="text-center">  Profit Amount: {orderProduct?.profitAmount}</h3>}


          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr className="table-dark text-center">
                <th scope="col">Product Image</th>
                <th scope="col">Product Title</th>
                <th scope="col">Price</th>
                <th scope="col">Sale Price</th>
                <th scope="col">Qty</th>
                <th scope="col">SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {orderProduct.products &&
                orderProduct.products.map((el) => {
                  return (
                    <tr key={el.product._id}> <td className="table-product-images">   <img src={el.product.photo.url} alt={el.product.title} /></td> <td>{el.product.title}</td> <td>
                      {orderProduct.orderType === "Wholesale"
                        ? el.product.wholesalePrice
                        : el.product.dropshipperPrice} </td>
                      <td>
                        {el?.product?.purchasePrice}</td>
                      <td>{el.quantity}</td> <td>
                        {orderProduct.orderType === "Wholesale"
                          ? el.product.discountedPriceW > 0
                            ? el.product.discountedPriceW * el.quantity
                            : el.product.wholesalePrice * el.quantity
                          : el.product.discountedPriceD > 0
                            ? el.product.discountedPriceD * el.quantity
                            : el.product.dropshipperPrice * el.quantity} </td>
                    </tr>
                  );
                })}
            </tbody>
          </table></>}
      </div>
    </>
  );
};

export default MyOrderDetails;
