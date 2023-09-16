import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = (props) => {
  const host = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [CartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [shippCat, setShippingCat] = useState(0);
  const [MyShopItems, setMyShopItems] = useState([]);
  const [allproducts, setAllProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [onSale, setOnSale] = useState([])

  const getFeatured = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/product/featured`);
    setFeatured(data?.featuredProducts);
    setLoading(false)
  };

  const getOnSale = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/product/allonsale`);
    setOnSale(data?.onSaleProducts);
    setLoading(false)
  };



  // This Api
  const getCategories = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/category/allcategories`);
    setCategories(data?.categories);
    setLoading(false)
  };

  // New Api
  const GetAllProducts = async () => {

    const { data } = await axios.get(`${host}/api/product/allactiveproducts`);
    setAllProducts(data?.products);
    setLoading(false)

  }

  // This Api
  const getProducts = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/product/allProducts`);
    setProducts(data?.products);
    setLoading(false)
  };
  const getShipCat = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/shipping/shippingcalc`);
    setShippingCat(data);
    setLoading(false)
  };
  useEffect(() => {
    getShipCat();

    // eslint-disable-next-line
  }, []);

  const Cart = async () => {
    try {
      // setCartLoading(true)
      const { data } = await axios.get(`${host}/api/cart/allcartitems`);
      setCartItems(data);
      // setCartLoading(false)
    } catch (error) {
      // setCartLoading(false)
    }
  };

  const getMyshop = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/myshop/allmyshopitems`);
    setMyShopItems(data?.product);
    setLoading(false)
  };

  useEffect(() => {
    getCategories();
    getProducts();
    // Cart();
    getMyshop();

    // eslint-disable-next-line
  }, [setCartItems]);

  const addToCart = async ({ product }, quantity) => {
    const cart = {
      product,
      quantity,
    };
    setLoading(true)
    setCartLoading(true)
    await axios.post(`${host}/api/cart/addtocart`, { cart })
      .then(function () {
        setCartLoading(false)
        setLoading(false)
      })
      .catch(function (error) {
        setCartLoading(false)
        setLoading(false)
        console.log(error);
      });
  };

  const removeCartProduct = async (id) => {
    setCartLoading(true)
    await axios.delete(`${host}/api/cart/deletecartitem/${id}`)
      .then(function (response) {
        setCartLoading(false)
        setCartItems(response.data.result);
      })
      .catch(function (error) {
        setCartLoading(false)
        console.log(error);
      });
  };

  const updateCartProductQty = async (id, qty) => {
    // setCartLoading(true)
    await axios.put(`${host}/api/cart/updatecart/${id}`, { qty })
      .then(function (response) {
        // setCartLoading(false)
        setCartItems(response.data.result);
      })
      .catch(function (error) {
        // setCartLoading(false)
      });
  };

  const updateDropshipPrice = async (id, price) => {
    await axios.put(`${host}/api/cart/updatedropshipprice/${id}`, { price })
      .then(function (response) {
        setCartItems(response.data.result);
      })
      .catch(function (error) {
        setCartLoading(false)
      });
  };

  const addToMyShop = async (productid) => {
    const productId = { product: productid }
    setLoading(true)
    await axios.post(`${host}/api/myshop/addtomyshop`, productId)
      .then(function (res) {
        setLoading(false)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error);
      });
  };

  const removeMyShop = async (id) => {
    setLoading(true)
    await axios.put(`${host}/api/myshop/deletemyshopitem/${id}`)
      .then(function (response) {
        setLoading(false)
        getMyshop();
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error);
      });
  };

  return (
    <ProductContext.Provider
      value={{
        loading, setLoading,
        categories,
        getCategories,
        products,
        getProducts,
        addToCart,
        Cart,
        CartItems,
        subTotal,
        shippCat,
        allproducts,
        GetAllProducts,
        setSubTotal,
        removeCartProduct,
        updateCartProductQty,
        updateDropshipPrice,
        addToMyShop,
        removeMyShop,
        getMyshop, getFeatured, getOnSale, featured, onSale,
        MyShopItems, cartLoading
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;