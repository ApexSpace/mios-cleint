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
  let [img, setImg] = useState("");
  let { categories } = useContext(ProductContext);
  let [product, setProduct] = useState({ category: "", skuNumber: "", title: "", stock: 0, wholesalePrice: 0, dropshipperPrice: 0, discountedPriceW: 0, discountedPriceD: 0, purchasePrice: 0, weight: 0, featured: false, onSale: false, photo: "", description: "", });
  const { category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo, description, } = product;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !skuNumber || !title || !stock || Number(stock) <= 0 || !wholesalePrice || Number(wholesalePrice) <= 0 || !purchasePrice || Number(purchasePrice) <= 0 || !weight || !photo || !description
    ) {
      Notification(
        "Error",
        "Enter Complete Details.(Prices and Stock can't be 0).",
        "danger"
      );
    } else if (onSale && !(discountedPriceW || discountedPriceD)) {
      Notification("Error", "Enter Discounted Price", "danger");
    } else if (title.length <= 2) {
      Notification("Error", "Minimum Length for Title should be 3.", "danger");
    } else if (
      onSale &&
      (Number(discountedPriceW) >= Number(wholesalePrice) ||
        (Number(discountedPriceW) <= 0))
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
          category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo, description,
        });
        setLoading(false);
        Notification("Success", "Product Added Successfully", "success");
        setProduct({
          category: "", skuNumber: "", title: "", stock: 0, wholesalePrice: 0, dropshipperPrice: 0, discountedPriceW: 0, discountedPriceD: 0, purchasePrice: 0, weight: 0, featured: false, onSale: false, photo: "", description: "",
        });
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

  useEffect(() => {
    if (img) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prevValue) => ({
          ...prevValue,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(img);
    }
  }, [img]);

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
          discountedPriceD: "",
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
    setImg(e.target.files[0]);
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

                <label>Title</label>                <input
                  type="text"
                  className="form-control"
                  placeholder="title"
                  name="title"
                  onChange={onChange}
                />
                <br /><label>Category</label>
                <select
                  className="form-control"
                  type="text"
                  id="category"
                  placeholder="category"
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
                <label>SkuNumber</label>                <input
                  type="text"
                  min={100}
                  className="form-control"
                  id="pSKU"
                  placeholder="skuNumber"
                  name="skuNumber"
                  onChange={onChange}
                />
                <br />
                <label>Stock</label>                <input
                  type="number"
                  min={1}
                  className="form-control"
                  id="stock"
                  placeholder="stock"
                  name="stock"
                  onChange={onChange}
                />
                <br />
                <label>Purchase Price</label>                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="purchasePrice"
                  placeholder="purchase Price"
                  name="purchasePrice"
                  onChange={onChange}
                />
                <br />
                <label>wholesale Price</label>                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="wholesalePrice"
                  placeholder="wholesale Price"
                  name="wholesalePrice"
                  onChange={onChange}
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
                <label>Weight</label>                <input
                  type="number"
                  className="form-control"
                  min={0}
                  id="weight"
                  placeholder="weight(grams)"
                  name="weight"
                  onChange={onChange}
                />
                <br />
                <input
                  type="checkbox"
                  onChange={onChange}
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
                <label></label>                <input
                  type="checkbox"
                  onChange={onChange}
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
                {onSale && (<>
                  <label>WholeSeller Discounted Price</label>                <input
                    type="number"
                    className="form-control"
                    min={0}
                    id="discountedPriceW"
                    placeholder="WholeSeller Discounted Price"
                    name="discountedPriceW"
                    onChange={onChange}
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
                <label>Image</label>                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="image"
                  placeholder="image"
                  name="image"
                  onChange={handlePhoto}
                />
                <br />
                <center>
                  <img width="200px" alt="" src={photo && photo} />
                  <br />
                </center>
                <label>Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="description"
                  name="description"
                  onChange={onChange}
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
