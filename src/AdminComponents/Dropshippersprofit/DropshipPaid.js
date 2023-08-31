import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import Loader from "../../Loader/Loader";
const image = window.location.origin + "/Assets/no-data.svg";
const DropshipPending = () => {
  const host = process.env.REACT_APP_API_URL;
  const [allProfits, setAllProfits] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllProfits()
  }, [])
  const getAllProfits = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${host}/api/profitrecords/paidprofits`);
      setAllProfits(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }


  return (
    <>
      <ReactNotifications />{loading ? <Loader /> :
        <div className="main">
          <div className="container-fluid">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-dark">
                  <th colSpan="1" >Sr.</th>
                  <th colSpan="1" className="text-center">Customer Name</th>
                  <th colSpan="1" className="text-center">City</th>
                  <th colSpan="1" className="text-center">Total Paid Profit</th>
                  <th colSpan="1" className="text-center">Latest Payment</th>
                  <th colSpan="1" className="text-center">Profit Detail</th>
                </tr>
              </thead>
              <tbody>

                {allProfits && allProfits?.map((item, key) => {
                  return (<tr key={key}>
                    <td colSpan="1" className="text-center">{key + 1}</td>
                    <td colSpan="1" className="text-center">{item?.name}</td>
                    <td colSpan="1" className="text-center">{item?.city}</td>
                    <td colSpan="1" className="text-center">{item?.totalProfit}</td>
                    <td colSpan="1" className="text-center">{new Date(item?.latestDatePaid).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
                    <td colSpan="1" className="text-center"><Link to={`/admin/PaidPerUser/${item?.id}`}><button className="btn btn-primary">Detail</button></Link></td>
                  </tr>)
                })}
              </tbody>
            </table>
            {allProfits?.length <= 0 && <div className='no_data'>
              <img className='no_data-img' src={image} alt='No Data' ></img>
            </div>}
          </div>
        </div>
      }
    </>
  );
}

export default DropshipPending;

