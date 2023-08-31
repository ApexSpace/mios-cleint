import { hover } from "@testing-library/user-event/dist/hover";
import React, { useState,useContext } from "react";
import styles from "./OrderRecipt.module.css";
import "./checkoutExtra.css";
import ProductContext from '../../context/Product/ProductContext';


export const OrderRecipt = () => {

  const context = useContext(ProductContext);
  const { Cart, getCart, handleQuantity } = context;
    // const params = useParams(); 
  
    const localCart = Cart.filter(
      (item) => item.user === "62aef08c4caef3ca34e560a9"
    );


  // let cartArr2 = JSON.parse(localStorage.getItem("Cart"));
  // let TotalPrice = cartArr2.reduce((acc, elem) => {
  //   return acc + Number(elem.price);
  // }, 0);

  // const [applyPromo, setApplyPromo] = useState(false);
  // const handlePromo = (e) => {
  //   let promocode = document.getElementById("promoCode").value;
  //   if (promocode === "zappos10") {
  //     let UpTotalPrice = TotalPrice - TotalPrice * 0.1;
  //     TotalPrice = UpTotalPrice;
  //   } else {
  //   }
  // };

  // const navigate = useNavigate();

  // const handleClick = () => {
  //   alert("Order Placed Successfully");
  //   navigate("/");
  // };

  return (
    <>
      <div className="promobox">
        <p style={{ fontSize: "40px" }}>
          Order Summary 
          {/* ( {cartArr2.length}{" "}
          {cartArr2.length === 1 ? "item" : "items"}) */}
        </p>
        <div className={styles.miniCont}>
          <h3 style={{ fontSize: "25px" }}>Subtotal:</h3>
          <h3 style={{ fontSize: "25px" }}>Rs.10 
          {/* {TotalPrice.toFixed(2)} */}
          </h3>
        </div>

        <div className={styles.miniCont}>
          <p style={{ fontSize: "25px" }}>Shipping Cost:</p>
          <p style={{ fontSize: "25px" }}>Rs.5</p>
        </div>
        <div className={styles.miniCont}>
          <p style={{ fontSize: "25px" }}>Total before tax:</p>
          <p style={{ fontSize: "25px" }}>Rs.10
           {/* {TotalPrice.toFixed(2)} */}
           </p>
        </div>

        {/* <div className={styles.miniCont}>
          <p style={{ fontSize: "25px" }}>Total after tax:</p>
          <p style={{ fontSize: "25px" }}>Rs.12.5
          </p>
        </div> */}
        
        <hr />
        <div className={styles.miniCont}>
          <h2 style={{ fontSize: "25px" }}>Order Total :</h2>
          <h2 style={{ fontSize: "25px" }}>Rs.15 
          </h2>
        </div>
      </div>

      {/* <div className="promobox">
        <h2>Apply Gift Card or Promo Code</h2>
        <div className={styles.promoCodeDiv}>
          <input
            id="promoCode"
            type="text"
            style={{ height: "30px", width: "70%", fontSize: "larger" }}
            placeholder="Enter Code"
          />
          <button className="applyBtn" 
          // onClick={handlePromo}
          >
            APPLY
          </button>
        </div>

        <div>
          <button 
          // onClick={handleClick} 
          className="placeOrderBtn">
            {" "}
            PLACE YOUR ORDER{" "}
          </button>
        </div>
      </div> */}
    </>
  );
};
