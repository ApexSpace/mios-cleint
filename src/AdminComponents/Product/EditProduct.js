import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProductContext from "../../context/Product/ProductContext";
import { ReactNotifications } from "react-notifications-component";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";

const EditProduct = () => {
  const host = process.env.REACT_APP_API_URL;
  const Navigate = useNavigate();
  const { getProducts, loading, setLoading } = useContext(ProductContext);
  let [img, setImg] = useState("");
  const params = useParams();
  const { id } = params;
  let { categories } = useContext(ProductContext);

  let [product, setProduct] = useState({
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
  const {
    category,
    skuNumber,
    title,
    stock,
    wholesalePrice,
    discountedPriceW,
    purchasePrice,
    weight,
    featured,
    onSale,
    photo,
    description,
  } = product;

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const { data } = await axios.get(`${host}/api/product/product/${id}`);
      setProduct(data);
      setImg(data.photo.url);
      setLoading(false);
    };
    getProduct();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    photo.url = img;
    if (
      !category ||
      !skuNumber ||
      !title ||
      !wholesalePrice ||
      Number(wholesalePrice) === 0 ||
      !purchasePrice ||
      Number(purchasePrice) === 0 ||
      !weight ||
      !photo ||
      !description
    ) {
      Notification(
        "Error",
        "Enter Complete Details.(Prices or Weight can't be 0).",
        "danger"
      );
    } else if (onSale && !discountedPriceW) {
      Notification("Error", "Enter Discounted Price", "danger");
    } else if (title.length <= 2) {
      Notification("Error", "Minimum Length for Title should be 3.", "danger");
    } else if (
      onSale &&
      (Number(discountedPriceW) >= Number(wholesalePrice) ||
        Number(discountedPriceW) === 0)
    ) {
      Notification(
        "Error",
        "Discounted Price Should be less than Selling Price and can't be 0.",
        "danger"
      );
    } else {
      try {
        setLoading(true);
        await axios.put(`${host}/api/product/editProduct/${id}`, {
          category,
          skuNumber,
          title,
          stock,
          wholesalePrice,
          discountedPriceW,
          purchasePrice,
          weight,
          featured,
          onSale,
          photo,
          description,
        });
        setProduct({
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
        await getProducts();
        setLoading(false);
        Notification("Success", "Product Updated Successfully", "success");
        setTimeout(() => {
          Navigate("/admin/products");
        }, 2000);
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

  const onChange = (e) => {
    if (e.target.name === "onSale" || e.target.name === "featured") {
      setProduct((prevValue) => ({
        ...prevValue,
        [e.target.name]: e.target.checked,
      }));
      if (e.target.name === "onSale" && !e.target.checked) {
        setProduct((prevValue) => ({
          ...prevValue,
          discountedPriceW: "",
        }));
      }
    } else {
      setProduct((prevValue) => ({
        ...prevValue,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handlePhoto = (e) => {
    setImg(e.target.value);
    photo.url = e.target.value;
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
              <h2 className="text-center my-4">Edit Product</h2>
              <form className="form">
                <br />
                <label>Title</label>{" "}
                <input
                  type="text"
                  className="form-control"
                  placeholder="title"
                  value={title}
                  name="title"
                  onChange={onChange}
                />
                <br />
                <label>Category</label>
                <select
                  className="form-control"
                  type="text"
                  id="category"
                  placeholder="category"
                  value={category}
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
                  })}
                </select>
                <br />
                <label>skuNumber</label>{" "}
                <input
                  type="text"
                  min={100}
                  className="form-control"
                  id="pSKU"
                  placeholder="skuNumber"
                  value={skuNumber}
                  name="skuNumber"
                  onChange={onChange}
                />
                <br />
                <label>Stock</label>{" "}
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  id="stock"
                  placeholder="stock"
                  value={stock}
                  name="stock"
                  onChange={onChange}
                />
                <br />
                <label>Purchase Price</label>{" "}
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="purchasePrice"
                  placeholder="purchase Price"
                  value={purchasePrice}
                  name="purchasePrice"
                  onChange={onChange}
                />
                <br />
                <label>Wholesale Price</label>{" "}
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="wholesalePrice"
                  placeholder="wholesale Price"
                  value={wholesalePrice}
                  name="wholesalePrice"
                  onChange={onChange}
                />
                <br />
                <label>Weight</label>{" "}
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  id="weight"
                  placeholder="weight(grams)"
                  value={weight}
                  name="weight"
                  onChange={onChange}
                />
                <br />
                <input
                  type="checkbox"
                  onChange={onChange}
                  placeholder="featured"
                  checked={featured}
                  name="featured"
                  className="form-check-input"
                  id="featured"
                />
                &nbsp;
                <label className="form-check-label" htmlFor="featured">
                  Featured Product
                </label>
                &nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  onChange={onChange}
                  placeholder="onSale"
                  checked={onSale}
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
                    <label>Wholeseller Discounted Price</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      id="discountedPriceW"
                      placeholder="WholeSeller Discounted Price"
                      value={onSale && discountedPriceW}
                      name="discountedPriceW"
                      onChange={onChange}
                    />
                  </>
                )}
                {onSale && <br />}
                {onSale && <br />}
                <label>Image URL</label>{" "}
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  placeholder="Enter Url for Image"
                  name="image"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                />
                <br />
                <center>
                  <img width="200px" alt="" src={img} />
                  <br />
                  <br />
                </center>
                <label>Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  rows="10"
                  id="description"
                  placeholder="description"
                  value={description}
                  name="description"
                  onChange={onChange}
                ></textarea>
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Update Product Details
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

export default EditProduct;
