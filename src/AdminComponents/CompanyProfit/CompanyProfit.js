import { React, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Loader/Loader";
import Papa from "papaparse";

const image = window.location.origin + "/Assets/no-data.svg";

const CompanyProfit = () => {
  const host = process.env.REACT_APP_API_URL;

  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const getOrders = async () => {
    setLoading(true);
    const { data } = await axios.get(`${host}/api/order/allOrders`);
    setOrders(data);
    setAllOrders(data);
    setFilteredRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    getOrders();

    // eslint-disable-next-line
  }, []);

  const filter = async () => {
    if (
      to &&
      from &&
      new Date(from).toISOString() <= new Date(to).toISOString()
    ) {
      const startUTC = new Date(from).toISOString();
      let endUTC = new Date(to);
      endUTC.setUTCHours(23, 59, 59, 999);
      endUTC = endUTC.toISOString();
      if (startUTC && endUTC) {
        const filtered = orders?.filter((record) => {
          let recordDate = new Date(record.date);
          recordDate.setUTCHours(recordDate.getUTCHours() + 5);
          recordDate = recordDate.toISOString();
          return recordDate >= startUTC && recordDate <= endUTC;
        });
        setFilteredRecords(filtered);
        totalProfit();
      } else {
        Notification("Error", "Enter Valid Dates", "danger");
      }
    } else {
      Notification("Error", "Enter Valid Dates", "danger");
    }
  };

  const csVDataDownload = filteredRecords
    .filter((item) => item.companyProfit > 0)
    .map((item) => {
      let date = new Date(item.date);
      return {
        "Order Id": item.id,
        "Order Amount": item.orderAmount,
        "Order Date": date.toLocaleDateString(),
        "Company Profit": item.companyProfit,
      };
    });

  const csv = Papa.unparse(csVDataDownload);
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = "Company Profits.csv";
    document.body.appendChild(element);
    element.click();
  };

  const totalProfit = filteredRecords.reduce((accumulator, order) => {
    const profit = order.companyProfit;
    if (typeof profit === "number" && !isNaN(profit)) {
      return accumulator + profit;
    }
    return accumulator;
  }, 0);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="d-flex w-80 align-items-center justify-content-evenly mb-3 mt-3">
            <div>
              <label for="" className="form-label">
                Starting From: &nbsp;&nbsp;&nbsp;
              </label>
              <input
                type="Date"
                className="p-1"
                onChange={(e) => setFrom(e.target.value)}
                value={from}
                name="from"
                placeholder=""
              />
            </div>
            <div>
              <label for="" className="form-label">
                Till Date:&nbsp;&nbsp;&nbsp;{" "}
              </label>
              <input
                type="Date"
                className="p-1"
                name="to"
                onChange={(e) => setTo(e.target.value)}
                value={to}
                placeholder=""
              />
            </div>
            <button className="btn btn-sm btn-info text-light" onClick={filter}>
              Filter
            </button>
            <button
              className="btn btn-sm btn-info text-light"
              onClick={() => setFilteredRecords(orders)}
            >
              Fetch All
            </button>
            <button
              className="btn btn-sm btn-info text-light"
              onClick={download}
            >
              Export CSV
            </button>
          </div>
          <div className="main">
            <div className="container">
              <div className="d-flex justify-content-between  my-4">
                <h5 className="">Company Profits</h5>
                <h5 className="text-center">Total Profit: {totalProfit}</h5>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="1" className="text-center align-middle">
                      Order ID
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Order Amount
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Order Date
                    </th>
                    <th colSpan="1" className="text-center align-middle">
                      Company Profit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords
                    .slice()
                    .reverse()
                    .map((order) => {
                      let date = new Date(order.date);
                      return order.companyProfit > 0 ? (
                        <tr
                          className="text-center align-middle"
                          key={order._id}
                        >
                          <td>{order.id}</td>
                          <td className="text-center align-middle">
                            {order.orderAmount}
                          </td>
                          <td className="text-center align-middle">
                            {date.toLocaleDateString()}
                          </td>
                          <td className="text-center align-middle">
                            {order.companyProfit}
                          </td>
                        </tr>
                      ) : null;
                    })}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="no_data">
                  <img className="no_data-img" src={image} alt="No Data"></img>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CompanyProfit;
