// import React, { createContext, useState } from "react";
// // import CartData  from '../../data/menData' ;

// export const CartContext = createContext();
// import ProductContext from '../../context/Product/ProductContext';


// export const CartProvider = ({ children }) => {
//   const [cartData, setCartData] = useState([]);
//   const context = useContext(ProductContext);
//   const { CartData, getCart , handleQuantity } = context;
  
//   useEffect(() => {
//     getCart();
//   }, [getCart]);

  

//   const addToCart = (data) => {
//     setCartData([...CartData, data]);
//   };

//   const removeFromCart = (id) => {
//     let newData = CartData.filter((el) => {
//       return el.id !== id;
//     });
//     setCartData(newData);
//   };

//   const value = { CartData, setCartData, addToCart, removeFromCart };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };
