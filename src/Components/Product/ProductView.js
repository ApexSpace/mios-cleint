import { React, useContext, useState } from "react";
import "./Product.css";
import ProductContext from "../../context/Product/ProductContext";
import { Link } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";

const ProductView = ({ product, modalRef }) => {
  const context = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const { addToCart, addToMyShop } = context;
  const Refresh = context.Cart;
  const [quantity, setQuantity] = useState(1);

  const handleChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty)) {
      setQuantity(newQty);
      // updateProductQty(Data.product._id, newQty)
    } else {
      setQuantity(0);
    }
  };
  const addAndRefresh = async (product) => {
    if (quantity >= 1 && quantity <= product?.stock) {
      await addToCart({ product }, quantity);
      await Refresh();
      setTimeout(() => {
        Notification("Success", "Added To Cart", "success");
      }, 10);
    } else {
      Notification("Danger", "You enter more than stock quantity", "danger");
    }
  };

  const handleAddToMyshop = async (id) => {
    await addToMyShop(id);
    setTimeout(() => {
      Notification("Success", "Added To My Shop", "success");
    }, 10);
  };

  return (
    <>
      <ReactNotifications />
      <div>
        <div className="card m-0">
          <div className="content">
            <div className="content-overlay"></div>
            <div className="image product-img">
              <Link to={`/product/${product._id}`}>
                <img
                  style={{ height: "160px", width: "100%" }}
                  className="card-img-top "
                  src={product.photo?.url || ""}
                  alt="Product"
                />
              </Link>
            </div>
            <div className="content-details fadeIn-bottom text-white btn btn-primary my-2">
              <span
                className=" text-white"
                id="quick_btn"
                onClick={() => {
                  modalRef(product._id);
                }}
              >
                Quick view
              </span>
            </div>
          </div>
          {product.featured === true && (
            <div className="feature-overlay">
              <span className="ribbon ribbon--blue">Feature</span>
            </div>
          )}
          {product.stock < 1 && (
            <div className="outstock-overlay">
              <span className="">Out of Stock</span>
            </div>
          )}

          <div className="card-body">
            <Link to={`/product/${product._id}`}>
              <h1 className=" text-center limit-text">{product.title}</h1>
            </Link>

            {product.stock === 0 ? (
              <div className="d-flex justify-content-center ">
                <label htmlFor="" className="mt-2">
                  Qty
                </label>

                <input
                  className="form-control mx-1"
                  style={{ width: "60px" }}
                  min="0"
                  type="number"
                  name="qty"
                  value="1"
                  onChange={handleChange}
                />

                <div className="cartbtn d-none">
                  <i
                    className="bx bx-cart cart-button mt-1"
                    // style={{fontSize: '25px'}}
                  ></i>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center ">
                <label htmlFor="" className="mt-2">
                  Qty
                </label>

                <input
                  className="form-control mx-1"
                  style={{ width: "50px" }}
                  min="1"
                  type="number"
                  name="qty"
                  value={quantity}
                  onChange={handleChange}
                />
                <Link to={"/login"}>
                  <button
                    className="cartbtn"
                    type="button"
                    name="add_cart"
                    id="button"
                  >
                    <i
                      className="bx bx-cart cart-button mt-1 pl-5"
                      style={{ marginRight: "8px" }}
                    ></i>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
