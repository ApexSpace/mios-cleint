import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductContext from "../../context/Product/ProductContext";
import { ReactNotifications } from "react-notifications-component";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";

const AddProduct = () => {
  const host = process.env.REACT_APP_API_URL;
  const Navigate = useNavigate();
  const { getProducts, loading, setLoading } = useContext(ProductContext);
  let { categories } = useContext(ProductContext);

  const [category, setCategory] = useState("");
  const [skuNumber, setSkuNumber] = useState("");
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [dropshipperPrice, setDropshipperPrice] = useState(0);
  const [discountedPriceW, setDiscountedPriceW] = useState(0);
  const [discountedPriceD, setDiscountedPriceD] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !category ||
      !skuNumber ||
      !stock ||
      Number(stock) <= 0 ||
      !wholesalePrice ||
      Number(wholesalePrice) <= 0 ||
      !purchasePrice ||
      Number(purchasePrice) <= 0 ||
      !weight ||
      !photo ||
      !description
    ) {
      Notification(
        "Error",
        "Enter Complete Details.(Prices, Stock or Weight can't be 0).",
        "danger"
      );
    } else if (onSale && !(discountedPriceW || discountedPriceD)) {
      Notification("Error", "Enter Discounted Price", "danger");
    } else if (title.length <= 2) {
      Notification("Error", "Minimum Length for Title should be 3.", "danger");
    } else if (
      onSale &&
      (Number(discountedPriceW) >= Number(wholesalePrice) ||
        Number(discountedPriceW) <= 0)
    ) {
      Notification(
        "Error",
        "Discounted Price Should be less than Selling Price and can't be 0.",
        "danger"
      );
    } else {
      try {
        setLoading(true);
        await axios.post(`${host}/api/product/addProduct`, {
          category,
          skuNumber,
          title,
          stock,
          wholesalePrice,
          dropshipperPrice,
          discountedPriceW,
          discountedPriceD,
          purchasePrice,
          weight,
          featured,
          onSale,
          photo,
          description,
        });
        setLoading(false);
        Notification("Success", "Product Added Successfully", "success");

        Navigate("/admin/products");
        await getProducts();
      } catch (e) {
        setLoading(false);
        if (e.response?.data?.keyPattern) {
          Notification(
            "Error",
            `Enter a unique ${Object.keys(e.response?.data?.keyPattern)[0]}`,
            "danger"
          );
        } else if (e.response?.data?.message) {
          Notification("Error", e.response?.data?.message, "danger");
        } else if (e.response?.data) {
          Notification("Error", e.response?.data, "danger");
        }
      }
    }
  };

  // const onChange = (e) => {
  //   if (e.target.name === "onSale" || e.target.name === "featured") {
  //     setProduct((prevValue) => ({
  //       ...prevValue,
  //       [e.target.name]: e.target.checked,
  //     }));
  //     if (e.target.name === "onSale" && !e.target.checked) {
  //       setProduct((prevValue) => ({
  //         ...prevValue,
  //         discountedPriceW: "",
  //         discountedPriceD: "",
  //       }));
  //     }
  //   } else {
  //     setProduct((prevValue) => ({
  //       ...prevValue,
  //       [e.target.name]: e.target.value,
  //     }));
  //   }
  // };

  // const handlePhoto = (e) => {
  //   setImg(e.target.value);
  //   photo = img;
  // };

  return (
    <>
      <ReactNotifications />
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center my-4">Add New Product</h2>
              <form className="form">
                <br />
                <label>Title</label>{" "}
                <input
                  type="text"
                  className="form-control"
                  placeholder="title"
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <label>Category</label>
                <select
                  className="form-control"
                  type="text"
                  id="category"
                  placeholder="category"
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => {
                    return (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    );
                  })}{" "}
                </select>
                <br />
                <label>SkuNumber</label>{" "}
                <input
                  type="text"
                  min={100}
                  className="form-control"
                  id="pSKU"
                  placeholder="skuNumber"
                  name="skuNumber"
                  onChange={(e) => setSkuNumber(e.target.value)}
                />
                <br />
                <label>Stock</label>{" "}
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  id="stock"
                  placeholder="stock"
                  name="stock"
                  onChange={(e) => setStock(e.target.value)}
                />
                <br />
                <label>Purchase Price</label>{" "}
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="purchasePrice"
                  placeholder="purchase Price"
                  name="purchasePrice"
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
                <br />
                <label>wholesale Price</label>{" "}
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="wholesalePrice"
                  placeholder="wholesale Price"
                  name="wholesalePrice"
                  onChange={(e) => setWholesalePrice(e.target.value)}
                />
                <br />
                {/* <label>dropshipper Price</label>                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="dropshipperPrice"
                  placeholder="dropshipper Price"
                  name="dropshipperPrice"
                  onChange={onChange}
                />
                <br /> */}
                <label>Weight</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  id="weight"
                  placeholder="weight(grams)"
                  name="weight"
                  onChange={(e) => setWeight(e.target.value)}
                />
                <br />
                <input
                  type="checkbox"
                  onChange={(e) => setFeatured(e.target.checked)}
                  placeholder="featured"
                  name="featured"
                  className="form-check-input"
                  id="featured"
                />
                &nbsp;
                <label className="form-check-label" htmlFor="featured">
                  Featured Product
                </label>
                &nbsp;&nbsp;&nbsp;
                <label></label>{" "}
                <input
                  type="checkbox"
                  onChange={(e) => setOnSale(e.target.checked)}
                  placeholder="onSale"
                  name="onSale"
                  className="form-check-input"
                  id="onSale"
                />
                &nbsp;
                <label className="form-check-label" htmlFor="sale">
                  On Sale
                </label>
                <br />
                <br />
                {onSale && (
                  <>
                    <label>WholeSeller Discounted Price</label>{" "}
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      id="discountedPriceW"
                      placeholder="WholeSeller Discounted Price"
                      name="discountedPriceW"
                      onChange={(e) => setDiscountedPriceW(e.target.value)}
                    />
                  </>
                )}
                {onSale && <br />}
                {/* {onSale && (
                  <>
                    <label>DropShipper Discounted Price</label>                <input
                      type="number"
                      className="form-control"
                      min={0}
                      id="discountedPriceD"
                      placeholder="DropShipper Discounted Price"
                      name="discountedPriceD"
                      onChange={onChange}
                    />
                  </>
                )}
                {onSale && <br />} */}
                <label>Image</label>{" "}
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  placeholder="Enter Url for Image"
                  name="image"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
                <br />
                <center>
                  <img width="200px" alt="" src={photo} />
                  <br />
                </center>
                <label>Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="description"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Add Product
                </button>
                <br />
                <br />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
