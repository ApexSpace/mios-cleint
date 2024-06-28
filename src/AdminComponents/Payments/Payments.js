import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';


const Payments = () => {
  const host = process.env.REACT_APP_API_URL;

  const [order, setOrder] = useState([])

  const getOrders = async () => {
    const { data } = await axios.get(`${host}/api/payment/allpayments`)
    setOrder(data)
  }

  useEffect(() => {
    getOrders()

    // eslint-disable-next-line
  }, [])

  const handleClick = async (id) => {
    if (window.confirm('Are you sure you want to change the payment status of this order?') === true) {
      await axios.put(`${host}/api/order/verifyorderpayment/${id}`)
      await getOrders()
    }
  }


  return (
    <>
      <div className='container my-3'>
        <div className='row'>
          <div className='col-md-12'>
            <h1 className='text-center mb-4'>Order Payments</h1>
            <table className='table' width={'90%'}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Receipt</th>
                  <th>Order Date</th>
                  <th>Total Amount Paid</th>
                  <th>Customer Name</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order && order.map((item, ind) => {
                  console.log(item)
                  return (
                    <tr key={ind}>
                      <td><Link to={`/admin/orderproduct/details/${item?.orderId._id}`}>{item?.orderId._id}</Link></td>
                      <td><a href={item?.photo?.url} target='_blank'><img width={'50px'} src={item?.photo?.url} /></a></td>
                      <td>{item?.date?.slice(0, 10)} {item?.date?.slice(11, 16)}</td>
                      <td>{item?.paymentAmount}</td>
                      <td>{item?.orderId?.billingDetails?.name}</td>
                      <td>
                        {
                          item.paymentStatus !== true ? (
                            <button className='btn btn-danger btn-sm'>
                              Not Verified
                            </button>
                          ) : (
                            <button className='btn btn-success btn-sm' disabled={item.paymentStatus === true}>Verified</button>
                          )
                        }
                      </td>
                      <td>
                        {
                          item.paymentStatus !== true ? (
                            <button className='btn btn-primary btn-sm' onClick={() => { handleClick(item?._id) }}>Click to verify</button>
                          ) : (
                            <button className='btn btn-danger btn-sm' onClick={() => { handleClick(item?._id) }}>Click to Unverify</button>
                            // <button className='btn btn-info btn-sm' disabled={item.paymentStatus === true} onClick={() => { handleClick(item._id) }}>Already Verified</button>
                          )
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}

export default Payments
