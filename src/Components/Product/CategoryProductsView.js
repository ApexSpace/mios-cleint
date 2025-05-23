import React, { useContext, useRef, useState } from "react";
import Product from "./Product";
import { useEffect } from "react";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import SidebarForLoggedOut from "../Sidebar/SidebarForLoggedOut";
import ProductView from "./ProductView";
import SearchBar from "../SearchBar";

const CategoryProductsView = () => {
  const host = process.env.REACT_APP_API_URL;
  const { products, getProducts, getCategories, loading, setLoading } =
    useContext(ProductContext);
  const [currentPro, setProductState] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const { user } = useContext(UserContext);
  const [fetching, setFetching] = useState(true);
  const userloading = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const { slug } = useParams();
  const Navigate = useNavigate();
  const navigate = useNavigate();
  useEffect(() => {
    const getFeatured = async () => {
      setFetching(true);
      setLoading(true);
      const { data } = await axios.get(
        `${host}/api/product/categoryProducts/${slug}`
      );
      setProductState(data.products);
      setLoading(false);
      setFetching(false);
    };
    getFeatured();

    // eslint-disable-next-line
  }, [slug]);
  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  const modalRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    getProducts();
    getCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [quantity, setQuantity] = useState(1);

  const modelFunction = async (id) => {
    const host = process.env.REACT_APP_API_URL;
    const { data } = await axios.get(`${host}/api/product/product/${id}`);
    modalRef.current.click();
    setSingleProduct(data);
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
    await addToCart({ product }, quantity);
    Notification("Success", "Added to Cart", "success");
    await Refresh();
  };
  const searchFun = (e) => {
    setProductState([]);

    products.forEach((i) => {
      if (
        i?.title?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        i?.description?.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        setProductState((prevVal) => [...prevVal, i]);
      }
    });
  };

  return (
    <>
      <ReactNotifications />
      <SidebarForLoggedOut />
      {loading || userloading?.loading ? (
        <Loader />
      ) : (
        <>
          <div className="main-product">
            <div className={`container ${user?.name && "mt-1"} home-sidebar`}>
              <div className="row">
                <div className="input-group mb-1">
                  <SearchBar onSearch={handleSearch} enable={false} />
                  {currentPro.length < products.length && (
                    <ReactNotifications />
                  )}
                </div>
                {/* Product Data */}
              </div>
            </div>
            <div class="container">
              <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-3 row-cols-2  justify-content-start">
                {currentPro &&
                  currentPro.map((product, index) => {
                    return (
                      product.deActivated === false && (
                        <div className="col">
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
          {!loading &&
            !fetching &&
            !userloading.loading &&
            currentPro.length <= 0 && (
              <h1 className="notFound">No Products Found In this category</h1>
            )}
        </>
      )}
    </>
  );
};

export default CategoryProductsView;
