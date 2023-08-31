import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import OrderContext from '../../context/Order/OrderContext';
import UserContext from '../../context/User/UserContext';
import "./Dashboard.css";
import Loader from '../../Loader/Loader'

const UserDashboard = () => {
  const { userOrders, orderLoading, getMyOrders } = useContext(OrderContext);
  const { user, loading } = useContext(UserContext);
  const [pending, setPending] = useState(0)
  const [delivered, setDelivered] = useState(0)
  const [returned, setReturned] = useState(0)
  useEffect(() => {
    getMyOrders();
    setPending(userOrders.filter(order => order.orderStatus === 'Pending').length);
    setDelivered(userOrders.filter(order => order.orderStatus === 'Delivered').length);
    setReturned(userOrders.filter(order => order.orderStatus === 'Returned').length);
  }, [])

  return (
    <>
      <div className='main'>
        <div className='container-fluid'>
          {orderLoading || loading ? <Loader /> : <>
            <div className='page-heading'>{user && user.name}'s Dashboard</div>
            <div className="row align-items-stretch">
              <div className="c-dashboardInfo col-lg-3 col-md-6">
                <Link to="/MyOrders">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">My Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{userOrders && userOrders.length}</span>
                  </div>
                </Link>
              </div>
              <div className="c-dashboardInfo col-lg-3 col-md-6">
                <Link to="/orders/Pending">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Pending Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{pending && pending}</span>
                  </div>
                </Link>
              </div>
              <div className="c-dashboardInfo col-lg-3 col-md-6">
                <Link to="/orders/delivered">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Delivered Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{delivered && delivered}</span>
                  </div>
                </Link>
              </div>
              <div className="c-dashboardInfo col-lg-3 col-md-6">
                <Link to="/MyOrders">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Returned Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{returned && returned}</span>
                  </div>
                </Link>
              </div>
            </div>
          </>}
        </div>

      </div>
    </>
  )
}

export default UserDashboard
