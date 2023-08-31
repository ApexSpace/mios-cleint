import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditOrderAdminW = () => {
  const host = process.env.REACT_APP_API_URL;
  const [trackingId, setTrackingId] = useState("");
  const [courierServiceName, setcourierServiceName] = useState("");
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const getDetails = async () => {
    const { data } = await axios.get(`${host}/api/order/orderproduct/${id}`);
    setShippingDetails(data.shippingDetails);
  };

  const getTracking = async () => {
    const { data } = await axios.get(`${host}/api/order/trackingid/${id}`);
    setTrackingId(data.trackingId);
    setcourierServiceName(data.courierServiceName);
  };

  useEffect(() => {
    
    getDetails();
    getTracking();

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeShip = (e)=>{
    setShippingDetails({...shippingDetails, [e.target.name]: e.target.value})
  }
  
  const onChange = (e) => {
    setTrackingId(e.target.value);
  };
  const onSelectChange = (e) => {
    setcourierServiceName(e.target.value);
  };

  const params = useParams();
  const { id } = params;

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${host}/api/order/updateshippingdetails/${id}`, {
        name: shippingDetails.name,
        address: shippingDetails.address,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
      });


      await axios
        .put(`${host}/api/order/updatetrackingdetails/${id}`, {
          trackingId,
          courierServiceName,
        })

        Navigate(`/admin/wholesaleorders`);
        
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <form
              method="post"
              onSubmit={handleSubmit}
              className="py-2 px-4 rounded"
            >
              <div className="row mb-2   justify-content-center">
            <h3 className="text-center my-2">Edit Shipping Details</h3>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    value={shippingDetails.name}
                    placeholder="Update Sipping Name"
                    className="form-control mt-2"
                    id="name"
                    name="name"
                    onChange={onChangeShip}
                    required
                  />
                </div>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    value={shippingDetails.address}
                    placeholder="Enter Shipping Address"
                    className="form-control mt-2"
                    id="address"
                    name="address"
                    onChange={onChangeShip}
                    required
                  />
                </div>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    value={shippingDetails.email}
                    placeholder="Enter Update Email"
                    className="form-control mt-2"
                    id="email"
                    name="email"
                    onChange={onChangeShip}
                    required
                  />
                </div>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    value={shippingDetails.phone}
                    placeholder="Enter Update Phone Number"
                    className="form-control mt-2"
                    id="phone"
                    name="phone"
                    onChange={onChangeShip}
                    required
                  />
                </div>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="trackingId">Tracking Id</label>

                  <input
                    type="text"
                    value={trackingId}
                    placeholder="Enter Tracking Id"
                    className="form-control mt-2"
                    id="trackingId"
                    name="trackingId"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="courierServiceName">
                    Courier Service Name
                  </label>
                  <select
                    className="form-select mt-1"
                    id="courierServiceName"
                    name="courierServiceName"
                    onChange={onSelectChange}
                  >
                    <option value={courierServiceName}>{courierServiceName}</option>
                    <option value="https://www.tcsexpress.com/Tracking">
                      TCS
                    </option>
                    <option value="https://www.leopardscourierspk.com/tracking.php">
                      Leopards Courier
                    </option>
                    <option value="https://www.dhl.com/pk-en/home/tracking.html">
                      DHL
                    </option>
                    <option value="http://ep.gov.pk/">Pakistan Post</option>
                    <option value="https://www.fedex.com/en-us/home.html">
                      FedEx Express
                    </option>
                    <option value="https://www.mulphilog.com/">M&P</option>
                  </select>
                </div>
                <div className="col-sm-8 ">
                  <button type="submit" className="btn btn-success ">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOrderAdminW;