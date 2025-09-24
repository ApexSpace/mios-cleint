import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProductContext from "../../context/Product/ProductContext";
import { ReactNotifications } from "react-notifications-component";
import Notification from "../../Notifications/Notifications";
import Loader from "../../Loader/Loader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditProduct = () => {
  const host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { getProducts, loading, setLoading } = useContext(ProductContext);
  const [img, setImg] = useState("");
  const { id } = useParams();
  const { categories } = useContext(ProductContext);

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
    photo: { url: "", public_id: "no id" },
    description: "",
  });

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        // Only fetch essential product details
        const { data } = await axios.get(`${host}/api/product/product/${id}`);
        setProduct((prevProduct) => ({
          ...prevProduct,
          ...data, // batch setting all data
          photo: {
            url: data.photo?.url || data.photo || "",
            public_id: data.photo?.public_id || "no id"
          }
        }));
        setImg(data.photo.url);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Notification("Error", "Failed to fetch product data.", "danger");
      }
    };
    getProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.category ||
      !product.skuNumber ||
      !product.title ||
      !product.wholesalePrice ||
      Number(product.wholesalePrice) === 0 ||
      !product.purchasePrice ||
      Number(product.purchasePrice) === 0 ||
      !product.weight
    ) {
      Notification("Error", "Enter complete details.", "danger");
    } else {
      try {
        setLoading(true);
        await axios.put(`${host}/api/product/editProduct/${id}`, product);
        // await getProducts();
        Notification("Success", "Product updated successfully", "success");
        navigate("/admin/products");
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Notification("Error", "Failed to update product", "danger");
      }
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevValue) => ({
      ...prevValue,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "onSale" && !checked) {
      setProduct((prevValue) => ({
        ...prevValue,
        discountedPriceW: "",
      }));
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
              <h2 className="text-center my-4">Edit Product</h2>
              <form className="form">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="title"
                  value={product.title}
                  name="title"
                  onChange={onChange}
                />
                <br />
                <label>Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={product.category}
                  onChange={onChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <br />
                <label>skuNumber</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="skuNumber"
                  value={product.skuNumber}
                  name="skuNumber"
                  onChange={onChange}
                />
                <br />
                <label>Stock</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="stock"
                  value={product.stock}
                  name="stock"
                  onChange={onChange}
                />
                <br />
                <label>Purchase Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="purchase Price"
                  value={product.purchasePrice}
                  name="purchasePrice"
                  onChange={onChange}
                />
                <br />
                <label>Wholesale Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="wholesale Price"
                  value={product.wholesalePrice}
                  name="wholesalePrice"
                  onChange={onChange}
                />
                <br />
                <label>Weight</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="weight(grams)"
                  value={product.weight}
                  name="weight"
                  onChange={onChange}
                />
                <br />
                <input
                  type="checkbox"
                  onChange={onChange}
                  checked={product.featured}
                  name="featured"
                  className="form-check-input"
                />
                <label className="form-check-label">Featured Product</label>
                <input
                  type="checkbox"
                  onChange={onChange}
                  checked={product.onSale}
                  name="onSale"
                  className="form-check-input"
                />
                <label className="form-check-label">On Sale</label>
                <br />
                {product.onSale && (
                  <>
                    <label>Wholeseller Discounted Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="WholeSeller Discounted Price"
                      value={product.discountedPriceW}
                      name="discountedPriceW"
                      onChange={onChange}
                    />
                  </>
                )}
                <br />
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Enter Url for Image"
                  name="photo"
                  value={product.photo.url}
                  onChange={(e) =>
                    setProduct((prevValue) => ({
                      ...prevValue,
                      photo: { url: e.target.value, public_id: "no id" },
                    }))
                  }
                />
                <br />
                <center>
                  <img
                    width="200px"
                    alt="Product"
                    src={product.photo.url}
                    loading="lazy"
                  />
                  <br />
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
