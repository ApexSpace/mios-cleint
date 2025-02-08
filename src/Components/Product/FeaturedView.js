import React, { useContext, useRef, useState } from "react";
import Product from "./Product";
import { useEffect } from "react";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";
import axios from "axios";
import Loader from "../../Loader/Loader";
import SidebarForLoggedOut from "../Sidebar/SidebarForLoggedOut";
import ProductView from "./ProductView";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";

const FeaturedView = () => {
  const host = process.env.REACT_APP_API_URL;
  const { products, getProducts, getCategories, loading } =
    useContext(ProductContext);
  const [currentPro, setProductState] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const { user } = useContext(UserContext);
  const userload = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const navigate = useNavigate();
  useEffect(() => {
    const getFeatured = async () => {
      const { data } = await axios.get(`${host}/api/product/featured`);
      setProductState(data.featuredProducts);
    };
    getFeatured();

    // eslint-disable-next-line
  }, []);

  const modalRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    getProducts();
    getCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [quantity, setQuantity] = useState(1);

  const modelFunction = (id) => {
    modalRef.current.click();
    products.filter((product) => {
      if (product._id === id) {
        setSingleProduct(product);
      }
      return null;
    });
  };
  const Navigate = useNavigate();
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
    await addToCart({ product }, quantity);
    Notification("Success", "Added to Cart", "success");
    await Refresh();
  };
  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <>
      {loading || userload?.loading ? (
        <Loader />
      ) : (
        <>
          <SidebarForLoggedOut />
          <ReactNotifications />
          {/* <div className="container-fluid mt-5 home-sidebar">
            <div className="row">
              <div className="grid-container">
                {currentPro &&
                  currentPro.map((product, index) => {
                    return (
                      product.deActivated === false && (
                        <ProductView
                          product={product}
                          modalRef={modelFunction}
                          key={index + 1}
                        />
                      )
                    );
                  })}
              </div>
            </div>
          </div> */}
          <div className={`container ${user?.name && "mt-1"} home-sidebar`}>
            <div className="row">
              <SearchBar onSearch={handleSearch} enable={false} />
            </div>
          </div>
          <div class="container">
            <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-3 row-cols-2  justify-content-start">
              {currentPro &&
                currentPro.map((product, index) => {
                  return (
                    product.deActivated === false && (
                      <div className="col" key={index + 1}>
                        <ProductView
                          product={product}
                          modalRef={modelFunction}
                          key={index + 1}
                        />
                      </div>
                    )
                  );
                })}
            </div>
          </div>

          <button
            ref={modalRef}
            type="button"
            className="btn btn-primary d-none"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Product Modal
          </button>

          <div
            className="modal fade mt-5"
            id="exampleModal"
            tabIndex="1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Product Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-2">
                    <div className="col-sm-6">
                      <img
                        style={{ width: "200px", height: "200px" }}
                        className="card-img-top image"
                        src={
                          singleProduct.photo?.url ||
                          "https://i.imgur.com/xdbHo4E.png"
                        }
                        alt="Product"
                      />
                    </div>
                    <div className="col-sm-6">
                      <h5>{singleProduct.title}</h5>

                      <button
                        data-bs-dismiss="modal"
                        ref={closeRef}
                        onClick={() => Navigate("/login")}
                        className="btn btn-primary mb-2"
                      >
                        Show Price
                      </button>
                      <div className="d-flex ">
                        <label htmlFor="" className="mt-2">
                          Qty
                        </label>
                        <input
                          className="form-control mx-1"
                          style={{ width: "70px" }}
                          min="1"
                          type="number"
                          name="qty"
                          value={quantity}
                          onChange={handleChange}
                        />
                        <Link to="/login">
                          {" "}
                          <button
                            className="cartbtn"
                            data-bs-dismiss="modal"
                            aria-label="Close"
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
                    </div>
                  </div>
                  <div className="row mb-2">
                    <p>{singleProduct.description}</p>
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
        </>
      )}
      {!loading && !userload.loading && currentPro.length <= 0 && (
        <h1>No Fearture Products Found</h1>
      )}
    </>
  );
};

export default FeaturedView;
