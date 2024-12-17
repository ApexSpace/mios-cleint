import React, { useContext, useRef, useState } from "react";
import Product from "./Product";
import { useEffect } from "react";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";
import Loader from "../../Loader/Loader";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";

// import { useNavigate } from "react-router-dom";

const ProductWithSearchForLogin = () => {
  const {
    products,
    getProducts,
    getCategories,
    cartLoading,
    getPaginateProduct,
  } = useContext(ProductContext);
  const [currentPro, setProductState] = useState(products);
  const [searchState, setSearchState] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});
  const { user } = useContext(UserContext);
  const userload = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //getCategories();
    setLoading(true);
    const getting = async () => {
      setLoading(true);
      await getProducts();
      setLoading(false);
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

  const searchFun = async (query) => {
    setLoading(true);
    setProductState([]);
    setSearchState(true);

    await products.forEach((i) => {
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

  return (
    <>
      <ReactNotifications />
      {currentPro.length < products.length && <ReactNotifications />}

      {/* {loading ? <Loader /> : <> */}
      {loading || cartLoading || userload?.loading ? (
        <Loader />
      ) : (
        <>
          <div className="main-product">
            <div className={`container ${user?.name && "mt-1"} home-sidebar`}>
              <SearchBar onSearch={handleSearch} enable={true} />
              <h1>Search Results for "{query}"</h1>
              {/* Product Data */}
            </div>
            <div class="container">
              <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-3 row-cols-2  justify-content-start">
                {currentPro &&
                  currentPro.map((product, index) => {
                    return (
                      product.deActivated === false && (
                        <div className="col" key={index + 1}>
                          <Product product={product} modalRef={modelFunction} />
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

                      <h6 className=" ">
                        {user.role === "wholeseller" ? (
                          singleProduct.discountedPriceW > 0 ? (
                            <>
                              Rs. {singleProduct.discountedPriceW}{" "}
                              <del>{singleProduct.wholesalePrice}</del>
                            </>
                          ) : (
                            <>Rs. {singleProduct.wholesalePrice}</>
                          )
                        ) : singleProduct.discountedPriceD > 0 ? (
                          <>
                            Rs. {singleProduct.discountedPriceD}{" "}
                            <del>{singleProduct.dropshipperPrice}</del>
                          </>
                        ) : (
                          <>Rs. {singleProduct.dropshipperPrice}</>
                        )}
                      </h6>

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

                        <button
                          className="cartbtn"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          type="button"
                          name="add_cart"
                          id="button"
                          onClick={() => addAndRefresh(singleProduct)}
                        >
                          <i
                            className="bx bx-cart cart-button mt-1 pl-5"
                            style={{ marginRight: "8px" }}
                          ></i>
                        </button>
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

export default ProductWithSearchForLogin;
