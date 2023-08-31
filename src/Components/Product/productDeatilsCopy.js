import axios from "axios";
import { React, useState, useEffect, useContext } from "react";
import ProductContext from "../../context/Product/ProductContext";
import { useParams } from "react-router-dom";
import "./Product.css";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";

const ProductDetail = () => {
    const host = process.env.REACT_APP_API_URL;

    const [product, setProduct] = useState([]);
    const params = useParams();
    const [quantity, setQuantity] = useState(1);
    const context = useContext(ProductContext);
    const { addToCart, updateCartProductQty } = context;
    const Refresh = context.Cart;

    const { id } = params;

    const getProductBYID = async () => {
        try {
            const { data } = await axios.get(`${host}/api/product/product/${id}`);
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getProductBYID();

        // eslint-disable-next-line
    }, []);


    useEffect(() => {
        if (quantity >= 1) {
            updateCartProductQty(id, quantity);
        }
    }, [quantity]); // eslint-disable-line react-hooks/exhaustive-deps

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
        Notification("Success", "Added to Cart", "success")
        await Refresh();
    };

    // const product = products;
    // console.log(product);

    return (
        <>
            <ReactNotifications />
            <div className="container-fluid mt-5">

                <div
                    className="card p-4"
                    // key={product._id}
                    style={{ margin: "5.5rem 0 0 0" }}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <div className="image-product p-3">
                                <img src={product.photo.url} alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="product-dtl">
                                <div className="product-info">
                                    <div className="product-name">{product.title}</div>
                                    <div className="reviews-counter">
                                        {/* <span>{product}</span> */}
                                    </div>

                                    {/* <div className="product-price-discount"><span>{product.discountedPrice} Rs</span><span className="line-through">{product.wholesalePrice} Rs</span></div> */}
                                    <div className="product-price-discount">
                                        {product.discountedPrice ? (
                                            <span className="product-price-discount">
                                                {product.discountedPrice} Rs.
                                            </span>
                                        ) : (
                                            <span>{product.wholesalePrice} Rs.</span>
                                        )}
                                        {product.discountedPrice ? (
                                            <span className="line-through">
                                                {product.wholesalePrice} Rs.
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="skuNumber">
                                        <span>
                                            <b>SKU : </b>
                                            {product.skuNumber}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna
                                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                {/* <div className="row">
	        				<div className="col-md-6">
	        					<label for="size">Size</label>
								<select id="size" name="size" className="form-control">
									<option>S</option>
									<option>M</option>
									<option>L</option>
									<option>XL</option>
								</select>
	        				</div>
	        				<div className="col-md-6">
	        					<label for="color">Color</label>
								<select id="color" name="color" className="form-control">
									<option>Blue</option>
									<option>Green</option>
									<option>Red</option>
								</select>
	        				</div>
	        			</div> */}
                                <div className="product-count">
                                    <label htmlFor="size">Quantity</label>
                                    <form action="#" className="display-flex">
                                        <div
                                            className="qtyminus"
                                            onClick={() => {
                                                if (quantity > 1) {
                                                    setQuantity(quantity - 1);
                                                }
                                            }}
                                        >
                                            -
                                        </div>
                                        <input
                                            type="text"
                                            name="quantity"
                                            value={quantity}
                                            onChange={handleChange}
                                            className="qty"
                                        />
                                        <div
                                            className="qtyplus"
                                            onClick={() => {
                                                setQuantity(quantity + 1);
                                            }}
                                        >
                                            +
                                        </div>
                                    </form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="round-black-btn"
                                                onClick={() => addAndRefresh(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
