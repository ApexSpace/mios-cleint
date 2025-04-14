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
    console.log(data);
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
            <div className="d-flex justify-content-between my-4 flex-wrap">
              {/* Ordered By */}
              <div className="text-center mb-2">
                <h5>Ordered By</h5>
                <div>
                  {orderProduct?.user?.name} ({orderProduct?.user?.role})
                </div>
              </div>

              {/* Ordered At */}
              <div className="text-center mb-2">
                <h5>Ordered At</h5>
                <div>
                  {new Date(orderProduct?.date).toLocaleString("en-PK", {
                    timeZone: "Asia/Karachi",
                  })}
                </div>
              </div>

              {/* Order Total Amount */}
              <div className="text-center mb-2">
                <h5>Total DS Amount</h5>
                <div>Rs. {orderProduct?.orderAmount?.toFixed(2) || "0.00"}</div>
              </div>

              <div className="text-center mb-2">
                <h5>Total WS Amount</h5>
                <div>
                  Rs.{" "}
                  {orderProduct?.products &&
                  Array.isArray(orderProduct.products)
                    ? orderProduct.products
                        .map((item) => item.product.wholesalePrice || 0)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)
                    : "0.00"}
                </div>
              </div>

              {/* Shipping Price */}
              <div className="text-center mb-2">
                <h5>Shipping Price</h5>
                <div>Rs. {orderProduct?.shippingPrice || "0.00"}</div>
              </div>

              {/* Profit */}
              {orderProduct?.user?.role === "dropshipper" && (
                <div className="text-center mb-2">
                  <h5>Profit Amount</h5>
                  <div>
                    Rs. {orderProduct?.profitAmount?.toFixed(2) || "0.00"}
                  </div>
                </div>
              )}
            </div>

            <table className="table table-striped table-bordered">
              <thead className="">
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
