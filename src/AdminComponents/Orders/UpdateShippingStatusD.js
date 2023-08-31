import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const UpdateShippingStatusD = () => {
  const host = process.env.REACT_APP_API_URL;
  const [trackingId, setTrackingId] = useState("");
  const [courierServiceName, setcourierServiceName] = useState("");

  // useEffect(() => {
  //   const getDetails = async () => {
  //     const { data } = await axios.get(`/api/category/category/${id}`);
  //     setTrackingId(data.category?.name)
  //   }
  //   getDetails();
  // }, [])// eslint-disable-line react-hooks/exhaustive-deps

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
      await axios
        .post(`${host}/api/order/addtrackingdetails/${id}`, {
          trackingId,
          courierServiceName,
        })
        .then(async (res) => {
          let url = `${host}/api/order/changeshippingstatus/${id}`;
          await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
          Navigate("/admin/dropshiporders");
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center my-4">Add Tracking Details</h2>
            <form
              method="post"
              onSubmit={handleSubmit}
              className="card py-4 px-4 rounded"
            >
              <div className="row mb-2   justify-content-center">
                <div className="form-group col-sm-8 mt-5">
                  <label htmlFor="trackingId">Tracking Id</label>

                  <input
                    type="text"
                    value={trackingId}
                    placeholder="Enter Tracking Id"
                    className="form-control mt-2"
                    id="trackingId"
                    name="trackingId"
                    onChange={onChange}
                    required
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
                    <option value="">Select Sipping Company</option>
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

export default UpdateShippingStatusD;
