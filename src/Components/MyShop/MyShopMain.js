import React, { useContext, useEffect, useRef, useState } from "react";
import MyShop from "./MyShop";
import ProductContext from "../../context/Product/ProductContext";
// import { useParams } from 'react-router-dom'
import UserContext from "../../context/User/UserContext";


const MyShopMain = ({ data }) => {
  const { products, getMyshop, MyShopItems } = useContext(ProductContext);
  const [singleProduct, setSingleProduct] = useState({})
  const { user } = useContext(UserContext);
  const context = useContext(ProductContext);
  const Refresh = context.Cart;
  const { addToCart } = context;
  const [shop, setShop] = useState(MyShopItems)

  useEffect(() => {
    getMyshop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setShop(MyShopItems)
  }, [MyShopItems]);




  const modalRef = useRef(null);
  const closeRef = useRef(null);

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

  const addAndRefresh = async (product) => {
    await addToCart({ product }, quantity);
    await Refresh();
  };

  return (
    <>
      <div className="container-fluid mt-3 home-sidebar">
        <div className="row">
          <h2 className="mb-4 text-center">Myshop</h2>
          <div className="grid-container">
            {shop?.map((product, index) => {
              return <MyShop product={product} modalRef={modelFunction} key={index + 1} />;
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
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
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
                      style={{ width: "100%" }}
                      className="card-img-top image"
                      src={
                        singleProduct.photo?.url || "https://i.imgur.com/xdbHo4E.png"
                      }
                      alt="Product"
                    />
                  </div>
                  <div className="col-sm-6">
                    <h5>{singleProduct.title}</h5>
                    <p>{singleProduct.description}</p>
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
                    <div className="d-flex justify-content-start ">
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
        {(shop?.length <= 0) && <h1>Your Shop is Empty</h1>}
      </div>
    </>
  );
};

export default MyShopMain
  ;
