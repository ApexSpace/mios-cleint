import axios from "axios";
import { React, useState, useEffect, useContext } from "react";
import ProductContext from "../../context/Product/ProductContext";
import { useParams } from "react-router-dom";
import "./Product.css";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";
import UserContext from "../../context/User/UserContext";

const ProductDetail = () => {
  const host = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(null);
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const context = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const { addToCart, updateCartProductQty } = context;
  const Refresh = context.Cart;

  const { id } = params;

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${host}/api/product/product/${id}`);
      setProduct(data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getProduct();

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (quantity >= 1 && quantity <= product?.stock) {
      updateCartProductQty(id, quantity);
    }

    // eslint-disable-next-line
  }, [quantity]);

  const handleChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty)) {
      setQuantity(newQty);
    } else {
      setQuantity(0);
    }
  };

  const addAndRefresh = async (product) => {
    if (quantity >= 1 && quantity <= product?.stock) {
      await addToCart({ product }, quantity);
      Notification("Success", "Added to Cart", "success");
      await Refresh();
    } else {
      Notification("Danger", "You enter more than stock quantity", "danger");
    }
  };

  return (
    <>
      <ReactNotifications />
      <div className="container ">
        {product ? (
          <div className="card p-4">
            <div className="row">
              <div className="col-md-7">
                <div className="image-product">
                  <img src={product.photo?.url} alt={product.title} />
                </div>
              </div>
              <div className="col-md-5">
                <div className="product-dtl px-1">
                  <div className="product-info">
                    <div className="product-name">{product.title}</div>
                    <div className="reviews-counter"></div>
                    <div className="product-price-discount">
                      {user.role === "wholeseller" ? (
                        product.discountedPriceW > 0 ? (
                          <>
                            Rs. {product.discountedPriceW}{" "}
                            <del>{product.wholesalePrice}</del>
                          </>
                        ) : (
                          <>Rs. {product.wholesalePrice}</>
                        )
                      ) : product.discountedPriceD > 0 ? (
                        <>
                          Rs. {product.discountedPriceD}{" "}
                          <del>{product.dropshipperPrice}</del>
                        </>
                      ) : (
                        <>Rs. {product.dropshipperPrice}</>
                      )}
                    </div>
                    <div className="skuNumber">
                      <span>
                        <b>SKU : </b>
                        {product.skuNumber}
                      </span>
                    </div>

                    <div className="product-count">
                      <label htmlFor="size">Quantity</label>
                      <div className="quantity">
                        <form action="#" className="display-flex qty-form">
                          <div
                            className="qtyminus"
                            onClick={() => {
                              if (quantity > 1) {
                                setQuantity(quantity - 1);
                              }
                            }}
                          >
                            -
                          </div>
                          <input
                            type="text"
                            name="quantity"
                            value={quantity}
                            onChange={handleChange}
                            className="qty"
                          />
                          <div
                            className="qtyplus"
                            onClick={() => {
                              if (quantity < product.stock) {
                                setQuantity(quantity + 1);
                              }
                            }}
                          >
                            +
                          </div>
                        </form>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="round-black-btn add-cart"
                            onClick={() => addAndRefresh(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="product-description mt-3">
                      <h6>Description:</h6>
                      <p>{product.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
