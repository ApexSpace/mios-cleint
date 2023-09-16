import { useState, useContext, useEffect } from "react";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";

export const CartProduct = ({ Data, Index }) => {
  const context = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const { removeCartProduct, updateCartProductQty, cartLoading, updateDropshipPrice } = context;
  const [Qty, setQty] = useState(Data.quantity);
  const [dropshipPrice, setDropshipPrice] = useState(Data.product.dropshipperPrice)
  const [dropPriceButton, setDropPriceButton] = useState(true);
  const [cartQtyDisable, setCartQtyDisable] = useState(true);
  const [currPrice, setCurrPrice] = useState(
    user.role === "wholeseller"
      ? Data?.product?.wholesalePrice
      : user.role === "dropshipper"
        ? Data.product.dropshipperPrice
        : 0
  );
  useEffect(() => {
    if (user.isAdmin === false) {
      if (user.role === "wholeseller") {
        if (Data.product.onSale) {
          setCurrPrice(Data.product.discountedPriceW);
        } else {
          setCurrPrice(Data.product.wholesalePrice);
        }
      } else if (user.role === "dropshipper") {
        setCurrPrice(Data.product.wholesalePrice);
      }
    }
  }, [cartLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps


  const addOne = () => {

    if (Qty >= Data.product.stock) return alert("You can't add more than available stock")
    setCartQtyDisable(false);
    // updateCartProductQty(Data.product._id, Qty + 1);
    setQty(Qty + 1);
  };

  const minusOne = () => {
    if (Qty >= 2) {
      setCartQtyDisable(false);
      setQty(Qty - 1);
      // updateCartProductQty(Data.product._id, Qty - 1);
    }
  };

  const handleRemove = (id) => {
    removeCartProduct(id);
  };

  const handleChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty)) {
      setCartQtyDisable(false);
      setQty(newQty);
      // updateCartProductQty(Data.product._id, newQty)
    } else {
      setQty("");
    }
  };

  const handleDropshipPriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setDropshipPrice(newPrice);
    setDropPriceButton(false);
  }

  const handleDropshipPriceUpdate = (id, price) => {
    if (dropshipPrice > (Data.product.discountedPriceW > 0 ? Data.product.discountedPriceW : Data.product.wholesalePrice)) {
      updateDropshipPrice(id, price);
      setDropPriceButton(true)
    } else {
      alert("Dropship price must be greater than wholesale price")
    }
  }

  const updateCart = () => {
    updateCartProductQty(Data.product._id, Qty);
    setCartQtyDisable(true);
  };


  return (
    <>
      <tr>
        <td>{Index}</td>
        <td style={{ width: "10%" }}>
          <img
            src={Data.product.photo?.url || "https://i.imgur.com/xdbHo4E.png"}
            style={{ maxHeight: "50px", maxWidth: "50px" }}
            alt={Data.product.title}
          />
        </td>

        <td style={{ width: "40%" }}>
          <p style={{ fontSize: "13px" }}>{Data.product.title}</p>
        </td>

        <td style={{ width: "7%" }}>
          <p style={{ fontSize: "13px" }}>Rs. {currPrice && currPrice}</p>
        </td>

        {
          user.role === "dropshipper" ? (
            <td>
              <div className="d-flex justify-content-between">

                <input
                  style={{
                    border: "1px solid lightgrey",
                    width: "80px",
                    background: "white",
                  }}
                  value={dropshipPrice}
                  type="number"
                  onChange={handleDropshipPriceChange}
                  name="dropshipPrice"
                  min={currPrice}
                />
                <div>
                  <button
                    disabled={dropPriceButton}
                    style={{ border: "1px solid lightgrey" }}
                    onClick={() => handleDropshipPriceUpdate(Data.product._id, dropshipPrice)}
                  >
                    ✓
                  </button>
                </div>
              </div>
            </td>
          ) : null
        }

        <td
          className="d-flex justify-content-between"
        // style={{ maxWidth: "150px" }}
        >
          <div>
            <button
              style={{ border: "1px solid lightgrey" }}
              onClick={minusOne}
            >
              -
            </button>
            <input
              style={{
                border: "1px solid lightgrey",
                width: "40px",
                background: "white",
              }}
              value={Qty}
              type="number"
              onChange={handleChange}
              name="quantity"
              min={1}
            />

            <button style={{ border: "1px solid lightgrey" }} onClick={addOne}>
              +
            </button>
          </div>
          <div>
            <button
              disabled={cartQtyDisable}
              style={{ border: "1px solid lightgrey" }}
              onClick={updateCart}
            >
              ✓
            </button>
          </div>
        </td>

        <td>
          {
            user.role === "dropshipper" ? (
              <p style={{ fontSize: "13px" }}>Rs. {dropshipPrice * Qty}</p>
            ) : (<p style={{ fontSize: "13px" }}>Rs. {currPrice * Qty}</p>)
          }

        </td>
        <td>
          <div>
            <button
              style={{ border: "1px solid lightgrey" }}
              onClick={() => handleRemove(Data.product._id)}
            >
              X
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
