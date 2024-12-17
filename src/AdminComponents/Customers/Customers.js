import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import "./Customers.css";
import Loader from "../../Loader/Loader";
import Papa from "papaparse";

const Customers = () => {
  const host = process.env.REACT_APP_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const [allUsers, setAllUser] = useState([]);
  const [loading, setLoading] = useState([]);
  const { getAndSetUsers } = useContext(UserContext);
  const [filterUsers, setFilterUsers] = useState([]);
  const [deleted, setDeleted] = useState(0);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchParams({ query: e.target.value });
  };

  useEffect(() => {
    if (query) {
      const newUsers = allUsers.filter((user) => {
        return (
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.phone.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilterUsers(newUsers);
    } else {
      setFilterUsers(allUsers);
    }
  }, [query, allUsers]);

  useEffect(() => {
    getUsers();
    setDeleted(0);

    // eslint-disable-next-line
  }, [deleted]);

  const getUsers = async () => {
    setLoading(true);
    const { data } = await axios.get(`${host}/api/auth/allUsers`);
    if (allUsers.length !== data.length) {
      setAllUser(data);
    }
    console.log(data);
    setLoading(false);
  };

  const deleteAccount = async (e) => {
    setLoading(true);

    const ans = await axios.delete(
      `${host}/api/auth/delete/${e.currentTarget.id}`
    );

    //await axios.get(`${host}/api/auth/allUsers`);
    await getAndSetUsers();
    setDeleted(1);
    setLoading(false);
  };

  const csVDataDownload = filterUsers.map((item) => {
    return {
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      City: item.city,
      Address: item.address,
      Role: item.role,
      Company: item.company,
    };
  });

  const csv = Papa.unparse(csVDataDownload);
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = "Customers.csv";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <center>
      {loading ? (
        <Loader />
      ) : (
        <div className="container-fluid">
          <br />
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                name="search"
                onChange={handleChange}
                value={query}
                className="form-control"
                placeholder="Search by name/phone"
              />
            </div>
            <h1 className="col-md-4 mt-2">
              Customers Details({filterUsers && filterUsers.length})
            </h1>
            <br />
            <div className="col-md-4 d-flex justify-content-evenly">
              <button className="btn btn-primary" onClick={download}>
                Export Customers
              </button>
            </div>
          </div>

          <br />

          <table className="table" width={"90%"}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>

                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            {filterUsers &&
              filterUsers.map((item, ind) => {
                return (
                  <tbody key={ind}>
                    <tr>
                      <td>{ind + 1}</td>
                      <td> {item.name} </td>
                      <td> {item.email} </td>
                      <td> {item.phone} </td>
                      <td> {item.city && item.city} </td>
                      <td> {item.address && item.address} </td>
                      <td> {item.role} </td>
                      {/* <td> {(item.role === "dropshipper") ? (item.dropShipperStatus ? `True` : `False`) : `--`} </td> */}
                      <td>
                        {" "}
                        {item.role === "wholeseller" && item.wholesellerStatus
                          ? "True"
                          : item.role === "dropshipper" &&
                            item.dropShipperStatus
                          ? "true"
                          : "false"}{" "}
                      </td>

                      <td>
                        <Link to={`/admin/customer/edit/${item._id}`}>
                          <button className="btn btn-info" id={item._id}>
                            Edit
                          </button>{" "}
                        </Link>{" "}
                      </td>
                      <td>
                        <button
                          id={item._id}
                          className="btn btn-danger"
                          onClick={deleteAccount}
                        >
                          Delete
                        </button>{" "}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </div>
      )}
    </center>
  );
};

export default Customers;
