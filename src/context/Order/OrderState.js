import axios from 'axios'
import React, { useEffect, useState } from 'react'
import OrderContext from './OrderContext'



const OrderState = (props) => {
  const host = process.env.REACT_APP_API_URL;
  const [userOrders, setUserOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const getMyOrders = async () => {
    setOrderLoading(true)
    const { data } = await axios.get(`${host}/api/order/myOrders`);
    setUserOrders(data);
    setOrderLoading(false)
  }

  useEffect(() => {
    getMyOrders();
  }, [])




  return (
    <OrderContext.Provider value={{ userOrders, getMyOrders, orderLoading, setOrderLoading }}>
      {props.children}
    </OrderContext.Provider>
  )
}




export default OrderState;