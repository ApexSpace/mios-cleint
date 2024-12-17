import React, { useEffect, useState } from "react";
import axios from "axios";

function TrackingDetails({ trackingId, courier }) {
  const host = process.env.REACT_APP_API_URL;

  //   const [trackingId, setTrackingId] = useState("");
  //   const [courier, setCourier] = useState("");
  //   useEffect(() => {
  //     const details = async () => {
  //       console.log(orderId);
  //       try {
  //         const tracking = await axios.get(
  //           `${host}/api/order/trackingid/${orderId}`
  //         );
  //         setTrackingId(tracking.data.trackingId); // Assuming setTrackingId updates your state with the API response
  //         setCourier(tracking.data.courierServiceName);
  //         console.log("tracking id ", trackingId);
  //         console.log("Service Name is ", courier);
  //       } catch (error) {
  //         // Check if the error has a response (e.g., 404, 500)
  //         if (error.response.status === 404) {
  //           setTrackingId("Order Not Shipped yet");
  //           setCourier("Order Not Shipped yet");
  //         }
  //         console.error("Error Response:", error.response.data.msg);
  //       }
  //     };
  //     details();
  //   }, [orderId]);
  return (
    <>
      <tr>
        <th scope="row">Tracking Number</th>
        <td>{trackingId && trackingId}</td>
      </tr>
      <tr>
        <th scope="row">Courier Service</th>
        <td>{courier && courier}</td>
      </tr>
    </>
  );
}

export default TrackingDetails;
