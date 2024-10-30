import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import emptyCartImage from "../assets/images/emptycart.png";
import { CartProduct } from "./CartProduct";
import { EmptyImage } from "./cartStyles";
import UserContext from "../../context/User/UserContext";
import Loader from "../../Loader/Loader";
// import AddIcon from "@mui/icons-material/Add";

const Cart = () => {
  const context = useContext(ProductContext);
  const { loading } = useContext(UserContext);
  const { Cart, CartItems, setSubTotal, cartLoading } = context;
  const localCart = CartItems;
  const { user } = useContext(UserContext);
  const getCart = Cart;
  useEffect(() => {
    getCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subTotalD = (cart) => {
    let subTotal = 0;
    cart?.forEach((item) => {
      subTotal += item.product.dropshipperPrice * item.quantity;
    });
    return subTotal;
  };

  const subTotalW = (cart) => {
    let subTotal = 0;
    cart?.forEach((item) => {
      subTotal +=
        item.product.discountedPriceW > 0
          ? item.product.discountedPriceW * item.quantity
          : item.product.wholesalePrice * item.quantity;
    });
    return subTotal;
  };

  const subTotl =
    localCart !== null
      ? user.role === "dropshipper"
        ? subTotalD(localCart.cart)
        : subTotalW(localCart.cart)
      : null;
  setSubTotal(subTotl);

  return (
    <>
      <div className="cart container">
        <h2 className="text-center container mb-3">Cart</h2>

        {cartLoading || loading ? (
          <Loader />
        ) : (
          <>
            {localCart === null ? (
              <div>
                <EmptyImage>
                  <img
                    className="emptyCartImage"
                    //have to add an image here
                    src={emptyCartImage}
                    alt="image1"
                  />
                  <br />
                  <Link to="/">
                    <button>Shop Now</button>
                  </Link>
                </EmptyImage>
              </div>
            ) : (
              <div className="cart-info">
                <div className="cart-items">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped round">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Image</th>
                          <th scope="col">Name</th>
                          {/* <th scope="col">Price</th> */}
                          {user.role === "dropshipper" ? (
                            <th scope="col">Dropship Price</th>
                          ) : null}
                          {/* <th scope="col">Quantity</th> */}
                          <th scope="col">Total</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localCart?.cart?.map((el, index) => {
                          return (
                            <CartProduct
                              Data={el}
                              Index={index + 1}
                              key={index + 1}
                            />
                          );
                        })}
                        {/* <tr>
                        <td
                          colSpan={user.role === "dropshipper" ? 3 : 4}
                          className="text-end"
                        >
                          <h6>Subtotal</h6>
                        </td>
                        <td>
                          <h6>Rs.{subTotl}</h6>
                        </td>
                      </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="cart-total-info">
                  <ul
                    class="list-group list-group-flus"
                    style={{ height: "300px" }}
                  >
                    <li class="list-group-item">
                      <div className="cart-subtotal">
                        <div>
                          <h6>Subtotal</h6>
                        </div>

                        <div>
                          <h6>Rs.{subTotl}</h6>
                        </div>
                      </div>
                    </li>
                    <li class="list-group-item">
                      <div className="cart-shipping">
                        <div>
                          <h6>Shipping</h6>
                        </div>

                        <div style={{ width: "60%", textAlign: "right" }}>
                          <h6>Proceed Checkout to see Shipping Charges</h6>
                        </div>
                      </div>
                    </li>
                    <li class="list-group-item">
                      <br />
                      <br />
                      <br />
                    </li>

                    <li class="list-group-item">
                      <Link to={"/"}>
                        <button type="button" class="cart-action-btn">
                          Back to shopping
                        </button>
                      </Link>
                    </li>
                    <li class="list-group-item">
                      <Link to={"/checkout"}>
                        <button type="button" class="cart-action-btn">
                          Proceed to Checkout
                        </button>
                      </Link>
                    </li>
                    <br />
                    <br />
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
