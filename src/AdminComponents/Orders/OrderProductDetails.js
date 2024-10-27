import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import OrderProductDetailMap from "./OrderProductDetailMap";

const OrderProductDetails = () => {
  const host = process.env.REACT_APP_API_URL;
  const [orderProduct, setOrderProduct] = useState([]);
  const [loading, setLoader] = useState(false);
  const params = useParams();
  let { id } = params;

  const getOrderProducts = async () => {
    let url = `${host}/api/order/orderproduct/${id}`;
    setLoader(true);
    let data = await fetch(url);
    data = await data.json();
    setOrderProduct(data);
    setLoader(false);
  };

  useEffect(() => {
    getOrderProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="container mt-3">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-center">Product Details</h2>
            <div className="d-flex justify-content-between my-4">
              <div>
                <h5 className="text-center"> Ordered By </h5>{" "}
                {orderProduct?.user?.name}({orderProduct?.user?.role})
              </div>

              {/* <h6 className="text-center">  User ID: {orderProduct?.user?._id}</h6><br /> */}
              <div>
                <h5 className="text-center"> Ordered At </h5>{" "}
                {new Date(orderProduct?.date).toLocaleString("en-PK", {
                  timeZone: "Asia/Karachi",
                })}
              </div>
              {/* {orderProduct?.user?.role == "dropshipper" && <h3 className="text-center">  Profit Amount: {orderProduct?.profitAmount}</h3>} */}
            </div>

            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr className="table-dark text-center">
                  <th scope="col">Product Image</th>
                  <th scope="col">Product Title</th>
                  <th scope="col">Product Sku</th>
                  <th scope="col">Wholesale Price</th>
                  {orderProduct?.user?.role == "dropshipper" && (
                    <th scope="col">Dropship Price</th>
                  )}
                  <th scope="col">Qty</th>
                  <th scope="col">SubTotal</th>
                </tr>
              </thead>
              <tbody>
                {orderProduct.products &&
                  orderProduct.products.map((el, index) => {
                    return (
                      <OrderProductDetailMap
                        key={index}
                        product={el}
                        otherdata={orderProduct}
                        orderID={id}
                      />
                    );
                  })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default OrderProductDetails;
