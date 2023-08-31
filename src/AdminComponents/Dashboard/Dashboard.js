import React, { useContext, useEffect, useState } from 'react'
import ProductContext from '../../context/Product/ProductContext';
import UserContext from '../../context/User/UserContext';
import "./Dashboard.css";
import axios from 'axios';
import Loader from '../../Loader/Loader';

const Dashboard = () => {
  const { getAndSetUsers } = useContext(UserContext)
  const { getCategories, getProducts } = useContext(ProductContext)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getCustomers = async () => {
      await getAndSetUsers();
      await getCategories();
      await getProducts();
    }
    getStats();
    getCustomers();
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  const getStats = async () => {
    setLoading(true);
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/stats`)
    setLoading(false);
    setStats(data);
  }

  return (
    <>
      {loading ? <Loader /> :
        <div className='main'>
          <div className='container-fluid'>
            <div className='page-heading'>Today's Summary</div>
            <div className="">
              <div className="row align-items-stretch">
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.totalOrders}</span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Wholesale Customers<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>  </svg>
                    </h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.wholesellers}</span></div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Dropship Customers<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.dropshippers}</span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Returned Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.returnedOrders}</span>
                  </div>
                </div>
              </div>


              <div className="row align-items-stretch">
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Categories<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.categories}</span>
                    {/* <span className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: PKR 30</span> */}
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Out of Stock Products<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.OutOfStockProducts}</span>
                    {/* <span className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: PKR 30</span> */}
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">In Stock Products<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.InStockProducts}</span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Products<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.totalProducts}</span>
                  </div>
                </div>
              </div>
              <div className="row align-items-stretch">
                <div className="c-dashboardInfo col-lg-6 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Delivered Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.deliveredOrders}</span>
                    {/* <span className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: PKR 30</span> */}
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-6 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Pending Orders<svg
                      className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                      </path>
                    </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{stats?.pendingOrders}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >}
    </>
  )
}

export default Dashboard
