import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductContext from '../../context/Product/ProductContext';
import emptyCartImage from '../assets/images/emptycart.png';
import { CartProduct } from "./CartProduct";
import {
  CartSidebar, CheckoutButton2, CheckoutButtonDiv, EmptyCart, EmptyCartLink, EmptyImage, SidbarHeading
} from "./cartStyles";



const Cart = () => {

  // let history = useHistory();
  // const goToPreviousPath = () => {
  //     history.goBack()
  // const [products, setProducts] = useState('')
  // const [quantity, setQuantity] = useState(1)

  const context = useContext(ProductContext);
  const { Cart, CartItems } = context;
  // const params = useParams(); 
  const localCart = CartItems;
  useEffect(() => {
    Cart();
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  
  // .filter(
  //   (item) => item.user === "62aef08c4caef3ca34e560a9"
  // );

  // const Removeitem = (id) => {
  //   let newData = Cart.filter((el) => {
  //     return el.id !== id;
  //   });
  //   localCart.setItem("Cart", JSON.stringify(newData));
  // };

  return (

    <CartSidebar>
      <SidbarHeading >
        <h2 style={{
          color: "Black",
        }}>My Cart</h2>
        <Link to={'/'}>
          <h2
            style={{
              color: "Black",
              marginRight: "10px",
            }}
            className="closeCross">
            X
          </h2>
        </Link>
      </SidbarHeading>
      <hr color="black" />

      {localCart === null ? (
        <div
          style={{
            marginTop: "auto",
            position: "relative",
            paddingRight: "25px",
            height: "70vh",
          }}
        >
          <p style={{ color: "rgb(88,88,88)", fontSize: "14px" }}>
            Nothing to see here yet! Sign in to see items that you've previously
            placed in your Cart or check out all the awesome things you can buy on
            MIOS.pk
          </p>
          <EmptyCart>
            <EmptyCartLink to="/sign-in">Sign In</EmptyCartLink>
            <EmptyCartLink to="/">Home Page</EmptyCartLink>
            <EmptyCartLink to="/brands">Brand List</EmptyCartLink>
            <EmptyCartLink to="/contact-us">Contact Us</EmptyCartLink>
          </EmptyCart>
          <EmptyImage>
            <img
              className="emptyCartImage"
              //have to add an image here
              src={emptyCartImage}
              alt="image1"
            />
            <br />
            <button>Sign In</button>
          </EmptyImage>
        </div>
      ) : (
        <div>
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              overflowY: "scroll",
              paddingRight: "25px",
              height: "70vh",
            }}
          >
            <CartProduct Data={localCart.cart}/>

          </div>

          <CheckoutButtonDiv>
            {/* <p
              style={{ lineHeight: "2px", fontSize: "15px", marginLeft: "0%", color:'black' }}
            >
              Cart Subtotal ({localCart.length}){" "}
            </p> */}
            <Link to="/checkout">
              <CheckoutButton2
                style={{
                  marginLeft: "160px",
                  border: '2px solid black',
                }}
              >
                PROCEED TO CHECKOUT
              </CheckoutButton2>
            </Link>
          </CheckoutButtonDiv>
        </div>
      )}
    </CartSidebar>
  );


};

export default Cart;


