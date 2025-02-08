import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Link, useParams } from "react-router-dom";
import Notification from "../../Notifications/Notifications";
import mioslogo from "../assets/images/mioslogo.png";
import Loader from "../../Loader/Loader";
import { Download } from "@mui/icons-material";
import ReactDOM from "react-dom";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdfviewer,
  Image,
} from "@react-pdf/renderer";
const image = window.location.origin + "/Assets/no-data.svg";

const PaidPerUser = () => {
  const host = process.env.REACT_APP_API_URL;
  const [profits, setAllProfits] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingIds, setTrackingIds] = useState({}); // Store tracking IDs
  useEffect(() => {
    getAllProfits();
    // eslint-disable-next-line
  }, []);
  const { id } = useParams();
  const getAllProfits = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `${host}/api/profitrecords/paidperuser/${id}`
    );
    setAllProfits(data);
    setFilteredRecords(data?.records);
    setLoading(false);
  };
  const fetchTrackingIds = async (data) => {
    const trackingData = {};

    for (const order of data?.records?.records[0]?.orders || []) {
      try {
        const response = await axios.get(
          `${host}/api/order/trackingid/${order.id}`
        );
        trackingData[order.id] = response.data.trackingId || "N/A"; // Handle missing tracking ID
      } catch (error) {
        console.error(
          `Error fetching tracking ID for order ${order.id}:`,
          error
        );
        trackingData[order.id] = "N/A"; // Default value in case of an error
      }
    }

    setTrackingIds(trackingData);
  };
  const styles = {
    page: { padding: 20 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    logoSection: { flex: 1 },
    logo: { width: 100, height: 50 },
    paymentDetails: { flex: 2, textAlign: "right" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    details: { fontSize: 12, marginBottom: 5 },
    infoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    customerInfo: { flex: 1, fontSize: 12 },
    bankInfo: { flex: 1, fontSize: 12 },
    infoHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    tableSection: { marginTop: 20 },
    tableHeader: {
      flexDirection: "row",
      borderBottom: "1px solid black",
      paddingBottom: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#ddd",
      paddingVertical: 5,
    },
    cellSmall: { width: "8%", textAlign: "center", fontSize: 10 },
    cellLarge: { width: "15%", textAlign: "center", fontSize: 10 },
    summary: {
      marginTop: 30,
      padding: 10,
      // border: "1px solid black",
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 12,
    },
    summaryTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },

    noTopBorder: {
      borderTopWidth: 0, // Removes top border for subsequent rows of the same order
    },
    mergedText: {
      color: "transparent", // Hide text to visually "merge" cells
    },
    strikethrough: {
      textDecorationLine: "line-through",
      color: "red",
    },
    summaryContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },

    summaryLogoSection: {
      alignItems: "center",
      marginBottom: 10,
    },

    summaryLogo: {
      width: 100,
      height: 50,
      resizeMode: "contain",
    },

    summaryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },

    summaryTable: {
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 5,
      overflow: "hidden",
    },

    summaryTableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 8,
      borderBottomWidth: 1,
      borderColor: "#000",
    },

    summaryTableHeader: {
      backgroundColor: "#f0f0f0",
    },

    summaryTableHeaderText: {
      fontWeight: "bold",
      fontSize: 14,
    },

    summaryTableCell: {
      fontSize: 14,
    },
  };

  const download = async (e) => {
    setLoading(true);

    // Extract IDs from the button click
    const ids = e.target.id.split("_***_");
    const userid = ids[0];
    const id = ids[1];

    // Fetch data from the API
    const { data } = await axios.get(
      `${host}/api/profitrecords/singleprofit/${userid}/${id}`
    );
    let bank = await axios.get(`${host}/api/bankDetails/${data?.user?._id}`);
    await fetchTrackingIds(data);
    console.log(data);

    // Create the PDF Document
    const MyPDF = (
      <Document>
        {/* Main Page */}
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              <Image
                src="https://miospk.a.eloerp.net/ERP-admin/assets/insapinia_theme/ecommerce/uploads/logo/logo_2.png"
                style={styles.logo}
              />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.title}>Profit Report</Text>

              <Text style={styles.details}>
                Report Date: {new Date().toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>

          {/* Customer and Bank Information */}
          <View style={styles.infoSection}>
            <View style={styles.customerInfo}>
              <Text style={styles.infoHeader}>Customer Details</Text>
              <Text>Name: {data?.user?.name || "N/A"}</Text>
              <Text>Phone: {data?.user?.phone || "N/A"}</Text>
              <Text>Email: {data?.user?.email || "N/A"}</Text>
              <Text>Address: {data?.user?.address || "N/A"}</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.infoHeader}>Bank Details</Text>
              <Text>Bank Name: {bank?.data?.bankName || "N/A"}</Text>
              <Text>
                Account Holder: {bank?.data?.accountHolderName || "N/A"}
              </Text>
              <Text>IBAN: {bank?.data?.iban || "N/A"}</Text>
            </View>
          </View>

          {/* Order Details Table */}
          {/* Order Details Table */}
          <View style={styles.tableSection}>
            <View style={styles.tableHeader}>
              <Text style={styles.cellSmall}>Sr#</Text>
              <Text style={styles.cellSmall}>Order ID</Text>
              <Text style={styles.cellLarge}>Customer</Text>
              <Text style={styles.cellLarge}>Product</Text>
              <Text style={styles.cellSmall}>Product Price (PKR)</Text>
              <Text style={styles.cellSmall}>Dropship Price (PKR)</Text>
              <Text style={styles.cellSmall}>Profit (PKR)</Text>
              <Text style={styles.cellSmall}>Shipping</Text>
              <Text style={styles.cellSmall}>Tracking Id</Text>
              <Text style={styles.cellSmall}>Delivery Date</Text>
              <Text style={styles.cellSmall}>Return Date</Text>
              <Text style={styles.cellSmall}>Payment Date</Text>
            </View>

            {data?.records?.records[0]?.orders.flatMap((order, orderIndex) =>
              order.products.map((product, productIndex) => (
                <View
                  style={[
                    styles.tableRow,
                    productIndex > 0 ? styles.noTopBorder : {}, // Removes border for subsequent rows
                  ]}
                  key={`${order.id}-${productIndex}`}
                >
                  {/* Order-related data shown for all rows, but visually merged */}
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {orderIndex + 1}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {order.id || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.cellLarge,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {order.billingDetails?.name || "N/A"}
                  </Text>

                  {/* Product-related data (shown separately) */}
                  <Text style={styles.cellLarge}>
                    {product.product?.title || "N/A"}
                  </Text>
                  <Text style={styles.cellSmall}>
                    {product.product.discountedPriceW ? (
                      <>
                        <Text style={styles.strikethrough}>
                          {product.product.wholesalePrice}
                        </Text>
                        {"  "} {/* Adds space between old and new price */}
                        {product.product.discountedPriceW}
                      </>
                    ) : (
                      product.product.wholesalePrice
                    )}
                  </Text>
                  <Text style={styles.cellSmall}>
                    {product.product?.dropshipperPrice || "N/A"}
                  </Text>

                  {/* Order-related data repeated for alignment */}
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {order.profitAmount || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {order.shippingPrice || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {trackingIds[order.id] || "Loading..."}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {new Date(order.date).toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    })}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    N/A
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {new Date(
                      data?.records?.records[0]?.datePaid
                    ).toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryLogoSection}>
              <Image src="/path/to/logo.png" style={styles.summaryLogo} />
            </View>

            <Text style={styles.summaryTitle}>Summary</Text>

            {/* Summary Table */}
            <View style={styles.summaryTable}>
              {/* Table Header */}
              <View style={[styles.summaryTableRow, styles.summaryTableHeader]}>
                <Text style={styles.summaryTableHeaderText}>Category</Text>
                <Text style={styles.summaryTableHeaderText}>Amount (PKR)</Text>
              </View>

              {/* Total Orders */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Total Orders</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders?.length || 0}
                </Text>
              </View>

              {/* Total Wholesale Amount */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>
                  Total Wholesale Amount
                </Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) =>
                          acc +
                          (order.products?.reduce(
                            (prodAcc, product) =>
                              prodAcc + (product.product?.wholesalePrice || 0),
                            0
                          ) || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>

              {/* Total Dropship Amount */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>
                  Total Dropship Amount
                </Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) =>
                          acc +
                          (order.products?.reduce(
                            (prodAcc, product) =>
                              prodAcc +
                              (product.product?.dropshipperPrice || 0),
                            0
                          ) || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>

              {/* Total Shipping Charges */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>
                  Total Shipping Charges
                </Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) => acc + (order.shippingPrice || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>

              {/* Total Profit */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Total Profit</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) => acc + (order.profitAmount || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );

    // Use @react-pdf/renderer's PDFDownloadLink to trigger the download
    const downloadLink = (
      <PDFDownloadLink
        document={MyPDF}
        fileName={`${data?.user?.name || "user"}_profit_report.pdf`}
      >
        {({ loading }) =>
          loading ? "Generating PDF..." : "Click to download your PDF!"
        }
      </PDFDownloadLink>
    );

    // Trigger the download by rendering the link and simulating a click
    const linkContainer = document.createElement("div");
    document.body.appendChild(linkContainer);

    const linkReactElement = (
      <div>
        <h1 style={{ display: "none" }}>{downloadLink}</h1>
      </div>
    );

    ReactDOM.render(linkReactElement, linkContainer);
    setTimeout(() => {
      const link = linkContainer.querySelector("a");
      if (link) {
        link.click();
      }
      document.body.removeChild(linkContainer);
    }, 100);

    setLoading(false);
  };

  const filter = () => {
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
        const filtered = profits?.records?.filter((record) => {
          let recordDate = new Date(record.datePaid);
          recordDate.setUTCHours(recordDate.getUTCHours() + 5);
          recordDate = recordDate.toISOString();
          return recordDate >= startUTC && recordDate <= endUTC;
        });
        setFilteredRecords(filtered);
      } else {
        Notification("Error", "Enter Valid Dates", "danger");
      }
    } else {
      Notification("Error", "Enter Valid Dates", "danger");
    }
  };

  const unPayAllProfits = async (user, profitId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${host}/api/profitrecords/unpayAllProfits`,
        { userId: user, profitId }
      );
      Notification("Success", data.message, "success");
      await getAllProfits();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Notification("Error", error.message, "danger");
    }
  };

  return (
    <>
      <ReactNotifications />
      {loading ? (
        <Loader />
      ) : (
        <div className="main">
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
              onClick={() => setFilteredRecords(profits?.records)}
            >
              Fetch All
            </button>
          </div>
          <div className="container-fluid">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-dark">
                  <th colSpan="1">Sr.</th>
                  <th colSpan="1" className="text-center">
                    Customer Name
                  </th>
                  <th colSpan="1" className="text-center">
                    Orders No.
                  </th>
                  <th colSpan="1" className="text-center">
                    Profit Amount
                  </th>
                  <th colSpan="1" className="text-center">
                    Payment Date
                  </th>
                  <th colSpan="1" className="text-center">
                    Reverse Payment
                  </th>
                  <th colSpan="1" className="text-center">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords &&
                  filteredRecords?.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td colSpan="1" className="text-center">
                          {key + 1}
                        </td>
                        <td colSpan="1" className="text-center">
                          {profits?.user?.name}
                        </td>
                        <td colSpan="1" className="text-center">
                          <Link
                            to={`/admin/singleprofit/${profits?.user?._id}/${item._id}`}
                            style={{ fontSize: "20px" }}
                          >
                            {item?.orders?.length}
                          </Link>
                        </td>
                        <td colSpan="1" className="text-center">
                          {item?.amount} Rs.
                        </td>
                        <td colSpan="1" className="text-center">
                          {new Date(item?.datePaid).toLocaleString("en-PK", {
                            timeZone: "Asia/Karachi",
                          })}
                        </td>
                        <td colSpan="1" className="text-center">
                          <button
                            className="btn btn-sm btn-info text-light"
                            id={`${profits?.user?._id}_***_${item._id}`}
                            onClick={() =>
                              unPayAllProfits(profits?.user?._id, item?._id)
                            }
                          >
                            Reverse Payment
                          </button>
                        </td>
                        <td colSpan="1" className="text-center">
                          <button
                            className="btn btn-sm btn-info text-light"
                            id={`${profits?.user?._id}_***_${item._id}`}
                            onClick={download}
                          >
                            Receipt <Download />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {profits?.length <= 0 && (
              <div className="no_data">
                <img className="no_data-img" src={image} alt="No Data"></img>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaidPerUser;
