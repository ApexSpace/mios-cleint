import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductContext from "../../context/Product/ProductContext";
import { ReactNotifications } from "react-notifications-component";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddProduct = () => {
  const host = process.env.REACT_APP_API_URL;
  const Navigate = useNavigate();
  const { getProducts, loading, setLoading, categories } =
    useContext(ProductContext);

  const [product, setProduct] = useState({
    category: "",
    skuNumber: "",
    title: "",
    stock: 0,
    wholesalePrice: 0,

    discountedPriceW: 0,

    purchasePrice: 0,
    weight: 0,
    featured: false,
    onSale: false,
    photo: "",
    description: "",
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevValue) => ({
      ...prevValue,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      category,
      skuNumber,
      title,
      stock,
      wholesalePrice,
      purchasePrice,
      weight,
      photo,
      description,
      onSale,
      discountedPriceW,
    } = product;

    if (
      !category ||
      !skuNumber ||
      !title ||
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
        "Enter Complete Details. (Prices, Stock or Weight can't be 0).",
        "danger"
      );
    } else if (onSale && !discountedPriceW) {
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
        await axios.post(`${host}/api/product/addProduct`, product);
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

  const handleDescriptionChange = (value) => {
    setProduct((prevValue) => ({
      ...prevValue,
      description: value,
    }));
  };

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
                  onChange={onChange}
                />
                <br />
                <label>Category</label>
                <select
                  className="form-control"
                  name="category"
                  onChange={onChange}
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
                  className="form-control"
                  name="skuNumber"
                  onChange={onChange}
                />
                <br />
                <label>Stock</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  onChange={onChange}
                />
                <br />
                <label>Purchase Price</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  name="purchasePrice"
                  onChange={onChange}
                />
                <br />
                <label>Wholesale Price</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  name="wholesalePrice"
                  onChange={onChange}
                />
                <br />
                <label>Weight</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  name="weight"
                  onChange={onChange}
                />
                <br />
                <input
                  type="checkbox"
                  name="featured"
                  className="form-check-input"
                  onChange={onChange}
                />
                &nbsp;
                <label className="form-check-label">Featured Product</label>
                &nbsp;&nbsp;&nbsp;
                <label></label>{" "}
                <input
                  type="checkbox"
                  name="onSale"
                  className="form-check-input"
                  onChange={onChange}
                />
                &nbsp;
                <label className="form-check-label">On Sale</label>
                <br />
                <br />
                {product.onSale && (
                  <>
                    <label>WholeSeller Discounted Price</label>{" "}
                    <input
                      type="number"
                      className="form-control"
                      name="discountedPriceW"
                      onChange={onChange}
                    />
                  </>
                )}
                {product.onSale && <br />}
                <label>Image</label>{" "}
                <input
                  type="url"
                  className="form-control"
                  name="photo"
                  value={product.photo}
                  onChange={onChange}
                />
                <br />
                <center>
                  <img width="200px" alt="" src={product.photo} />
                  <br />
                </center>
                <label>Description</label>
                <ReactQuill
                  value={product.description}
                  onChange={handleDescriptionChange}
                />
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
