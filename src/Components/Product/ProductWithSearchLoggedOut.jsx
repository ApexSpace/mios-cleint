import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Notification from "../../Notifications/Notifications";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import SidebarForLoggedOut from "../Sidebar/SidebarForLoggedOut";
import ProductView from "./ProductView";
import "./Product.css";
import SearchBar from "../SearchBar";

// import { useNavigate } from "react-router-dom";

const ProductWithSearchLoggedOut = () => {
  const {
    products,
    getProducts,
    getCategories,
    cartLoading,
    getPaginateProduct,
  } = useContext(ProductContext);
  const [currentPro, setProductState] = useState(products);
  const [loading, setLoading] = useState(false);

  const [singleProduct, setSingleProduct] = useState({});
  const { user } = useContext(UserContext);
  const userload = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const Navigate = useNavigate();
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //getCategories();
    setLoading(true);
    const getting = async () => {
      await getProducts();
    };
    getting();
    setLoading(false);
  }, []);

  useEffect(() => {}, [query, products]);

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };
  useEffect(() => {
    setProductState(products);
    if (query) {
      searchFun(query);
    }
  }, [query, products]);

  const searchFun = (query) => {
    setLoading(true);
    setProductState([]);

    products.forEach((i) => {
      if (i?.title?.toLowerCase().includes(query.toLowerCase())) {
        setProductState((prevVal) => [...prevVal, i]);
      }
    });
    setLoading(false);
  };

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
    setLoading(true);
    await addToCart({ product }, quantity);
    setLoading(false);
    await Refresh();
    setTimeout(() => {
      Notification("Success", "Added to Cart", "success");
    }, 10);
  };
  const location = useLocation();
  return (
    <>
      {!["login", "signup"].includes(location.pathname) && (
        <SidebarForLoggedOut />
      )}
      <ReactNotifications />
      {currentPro.length < products.length && <ReactNotifications />}

      {/* {loading ? <Loader /> : <> */}
      {loading || cartLoading || userload?.loading ? (
        <Loader />
      ) : (
        <>
          <div className="main-product">
            <div className="container mt-1 home-sidebar">
              <div className="row">
                <SearchBar onSearch={handleSearch} enable={true} />
                <h1>Search Results for "{query}"</h1>
                {currentPro.length < products.length && <ReactNotifications />}
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
                        src={singleProduct.photo?.url || ""}
                        alt="Product"
                      />
                      <p>{singleProduct.description}</p>
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
                          onChange={() => handleChange()}
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
    </>
  );
};

export default ProductWithSearchLoggedOut;
