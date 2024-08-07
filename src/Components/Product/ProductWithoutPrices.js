import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from '../../Loader/Loader';
import Notification from "../../Notifications/Notifications";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import SidebarForLoggedOut from "../Sidebar/SidebarForLoggedOut";
import ProductView from "./ProductView";
// import { useNavigate } from "react-router-dom";

const ProductWithoutPrices = () => {
  const { products, getProducts, getCategories, cartLoading } = useContext(ProductContext);
  const [currentPro, setProductState] = useState(products);
  const [loading, setLoading] = useState(false);

  const [singleProduct, setSingleProduct] = useState({})
  const { user } = useContext(UserContext);
  const userload = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const Navigate = useNavigate()
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    getProducts();
    getCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProductState(products)
  }, [products]);
  const [quantity, setQuantity] = useState(1);

  const modelFunction = (id) => {
    modalRef.current.click();
    products.filter((product) => {
      if (product._id === id) {
        setSingleProduct(product)
      }
      return null
    })
  }

  const handleChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty)) {
      setQuantity(newQty);
      // updateProductQty(Data.product._id, newQty)
    } else {
      setQuantity(0);
    }
  };

  const searchFun = (e) => {
    setProductState([]);
    products.forEach((i) => {
      if (i?.title?.toLowerCase().includes(e.target.value.toLowerCase()) || i?.description?.toLowerCase().includes(e.target.value.toLowerCase())) {
        setProductState((prevVal) => [
          ...prevVal,
          i
        ])
      }
    })
  }

  const addAndRefresh = async (product) => {
    setLoading(true)
    await addToCart({ product }, quantity);
    setLoading(false)
    await Refresh();
    setTimeout(() => {
      Notification("Success", "Added to Cart", "success")
    }, 10);
  };
  const location = useLocation()
  return (
    <>
      {!["login", "signup"].includes(location.pathname) && <SidebarForLoggedOut />}
      <ReactNotifications />
      {currentPro.length < products.length && <ReactNotifications />}

      {/* {loading ? <Loader /> : <> */}
      {loading || cartLoading || userload?.loading ? <Loader /> : <>
        <div className="container-fluid home-sidebar">
          <div className="row">
            <div className="input-group mb-3">
              <input onChange={searchFun} type="text" className="form-control" placeholder="Search Products" />
              {currentPro.length < products.length && <ReactNotifications />}
            </div>
            <div className="grid-container ">
              {currentPro && currentPro.map((product, index) => {
                return (
                  product.deActivated === false &&
                  <ProductView product={product} modalRef={modelFunction} key={index + 1} />
                );
              })}
            </div>
          </div>
        </div>
        <button ref={modalRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal"   >
          Product Modal
        </button>
        <div className="modal fade mt-5" id="exampleModal" tabIndex="1" aria-labelledby="exampleModalLabel" aria-hidden="true"   >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Product Details
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"     ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <img style={{ width: "200px", height: "200px" }} className="card-img-top image" src={singleProduct.photo?.url || "https://i.imgur.com/xdbHo4E.png"} alt="Product" />
                  </div>
                  <div className="col-sm-6">
                    <h5>{singleProduct.title}</h5>
                    <p>{singleProduct.description}</p>
                    <button data-bs-dismiss="modal"
                      ref={closeRef}
                      onClick={() => Navigate('/login')} className="btn btn-primary mb-2">Show Price</button>
                    <div className="d-flex ">
                      <label htmlFor="" className="mt-2">
                        Qty
                      </label>
                      <input className="form-control mx-1" style={{ width: "70px" }} min="1" type="number" name="qty" value={quantity} onChange={handleChange} />
                      <Link to='/login'> <button className="cartbtn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        type="button" name="add_cart" id="button">
                        <i
                          className="bx bx-cart cart-button mt-1 pl-5"
                          style={{ marginRight: "8px" }}
                        ></i>
                      </button></Link>
                    </div>


                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={closeRef}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>}
    </>
  );
};

export default ProductWithoutPrices;