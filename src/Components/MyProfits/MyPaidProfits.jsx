import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Link } from "react-router-dom";
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

const MyPaidProfits = () => {
  const host = process.env.REACT_APP_API_URL;
  const [profits, setAllProfits] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingIds, setTrackingIds] = useState({}); // Store tracking IDs
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [returnedOrders, setReturnedOrders] = useState(0);
  useEffect(() => {
    getAllProfits();
    // eslint-disable-next-line
  }, []);
  const getAllProfits = async () => {
    setLoading(true);
    const { data } = await axios.get(`${host}/api/profitrecords/myPaidProfit`);
    setAllProfits(data);
    const sortedData = data?.records.sort(
      (a, b) => new Date(b.datePaid) - new Date(a.datePaid)
    );

    setFilteredRecords(sortedData);
    setLoading(false);
  };

  const fetchTrackingIds = async (data) => {
    const trackingData = {};

    for (const order of data?.records?.records[0]?.orders || []) {
      try {
        const response = await axios.get(
          `${host}/api/order/trackingid/${order._id}`
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
      `${host}/api/profitrecords/mysingleprofit/${id}`
    );
    let bank = await axios.get(`${host}/api/bankDetails/`);
    bank = bank?.data;
    await fetchTrackingIds(data);
    const deliveredOrdersCount =
      data?.records?.records[0]?.orders?.filter(
        (order) => order.orderStatus === "Delivered"
      ).length || 0;
    setDeliveredOrders(deliveredOrdersCount);
    const returnedOrdersCount =
      data?.records?.records[0]?.orders?.filter(
        (order) => order.orderStatus === "Returned"
      ).length || 0;
    setReturnedOrders(returnedOrdersCount);
    console.log(bank);
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
              <Text>Bank Name: {bank[0].bankName || "N/A"}</Text>
              <Text>Account Holder: {bank[0].accountHolderName || "N/A"}</Text>
              <Text>IBAN: {bank[0].iban || "N/A"}</Text>
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
              <Text style={styles.cellSmall}>Quantity</Text>
              <Text style={styles.cellSmall}>Product Price (PKR)</Text>
              <Text style={styles.cellSmall}>Dropship Price (PKR)</Text>

              <Text style={styles.cellSmall}>Shipping</Text>
              <Text style={styles.cellSmall}>Profit (PKR)</Text>
              <Text style={styles.cellSmall}>Tracking Id</Text>
              <Text style={styles.cellSmall}>Order Status</Text>
              <Text style={styles.cellSmall}>Order Status Date</Text>
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
                    {product.quantity || "N/A"}
                  </Text>
                  <Text style={styles.cellSmall}>
                    {product.product.discountedPriceW ? (
                      <>
                        <Text style={styles.strikethrough}>
                          {product.product.wholesalePrice * product.quantity}
                        </Text>
                        {"  "} {/* Adds space between old and new price */}
                        {product.product.discountedPriceW * product.quantity}
                      </>
                    ) : (
                      product.product.wholesalePrice * product.quantity
                    )}
                  </Text>
                  <Text style={styles.cellSmall}>
                    {product.product?.dropshipperPrice * product.quantity ||
                      "N/A"}
                  </Text>

                  {/* Order-related data repeated for alignment */}
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
                    {order.profitAmount || "N/A"}
                  </Text>

                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {trackingIds[order.id]}
                  </Text>
                  <Text
                    style={[
                      styles.cellSmall,
                      productIndex > 0 ? styles.mergedText : {},
                    ]}
                  >
                    {order.orderStatus || "N/A"}
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
                    {new Date(
                      data?.records?.records[0]?.datePaid
                    ).toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}
                  </Text>
                </View>
              ))
            )}
          </View>
        </Page>
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>

            {/* Summary Table */}
            <View style={styles.summaryTable}>
              {/* Table Header */}

              {/* Total Orders */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Orders</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders?.length || 0}
                </Text>
              </View>
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Delivered Orders</Text>
                <Text style={styles.summaryTableCell}>{deliveredOrders}</Text>
              </View>
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Returned Orders</Text>
                <Text style={styles.summaryTableCell}>{returnedOrders}</Text>
              </View>
              {/* Total Wholesale Amount */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Wholesale Amount</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) =>
                          acc +
                          (order.products?.reduce(
                            (prodAcc, product) =>
                              prodAcc +
                              (product.product?.discountedPriceW // Check if there's a sale price
                                ? product.product.discountedPriceW
                                : product.product?.wholesalePrice || 0) *
                                (product.quantity || 1), // Multiply by quantity
                            0
                          ) || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>

              {/* Total Dropship Amount */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Dropship Amount</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders
                    ? data.records.records[0].orders.reduce(
                        (acc, order) =>
                          acc +
                          (order.products?.reduce(
                            (prodAcc, product) =>
                              prodAcc +
                              (product.product?.dropshipperPrice || 0) *
                                (product.quantity || 1), // Multiply by quantity
                            0
                          ) || 0),
                        0
                      )
                    : 0}
                </Text>
              </View>

              {/* Total Shipping Charges */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Shipping Charges</Text>
                <Text style={styles.summaryTableCell}>
                  {data?.records?.records[0]?.orders?.reduce(
                    (total, order) =>
                      total + (Number(order?.shippingPrice) || 0),
                    0
                  )}
                </Text>
              </View>

              {/* Total Profit */}
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Profit</Text>
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
    // Format file name properly
    const formattedDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `Profit Report - ${data?.user?.name.replace(
      /\s/g,
      " "
    )} - ${formattedDate}.pdf`;
    // Use @react-pdf/renderer's PDFDownloadLink to trigger the download
    const downloadLink = (
      <PDFDownloadLink document={MyPDF} fileName={fileName}>
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

  // const download = async (e) => {
  //     try {
  //         setLoading(true);
  //         const ids = e.target.id.split('_***_')
  //         // const userid = ids[0];
  //         const id = ids[1];
  //         // Create a new PDF document
  //         const pdfDoc = await PDFDocument.create();
  //         const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  //         // Load the logo image
  //         const response = await fetch(mioslogo);
  //         const logoImage = await response.arrayBuffer();

  //         // Embed the logo image in the PDF
  //         const logoImagePage = pdfDoc.insertPage(0);
  //         const logoImageEmbed = await pdfDoc.embedPng(logoImage);
  //         const logoDims = logoImageEmbed.scale(0.1);
  //         logoImagePage.drawImage(logoImageEmbed, {
  //             x: logoImagePage.getWidth() / 2 - logoDims.width / 2,
  //             y: logoImagePage.getHeight() - logoDims.height - 50,
  //             width: logoDims.width,
  //             height: logoDims.height,
  //         });

  //         const { data } = await axios.get(`${host}/api/profitrecords/mysingleprofit/${id}`)
  //         let bank = await axios.get(`${host}/api/bankDetails/`);
  //         bank = bank?.data;
  //         // Add the heading to the PDF
  //         logoImagePage.drawText(`Paid Profit Detail`, {
  //             x: 211,
  //             y: 700,
  //             size: 24,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(`\t\tUser Detail`, {
  //             x: 200,
  //             y: 670,
  //             size: 20,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         logoImagePage.drawText(`\t\tPaid To: ${data?.user?.name} (${data?.user?.role}) \n\t\tPhone Number: ${data?.user?.phone}`, {
  //             x: 174,
  //             y: 650,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         logoImagePage.drawText(`\t\tProfit Detail`, {
  //             x: 200,
  //             y: 570,
  //             size: 20,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         const num = data?.records?.records[0]?.orders?.length;
  //         logoImagePage.drawText(`\t\t\tNumber Of Orders: ${num}`, {
  //             x: 184,
  //             y: 550,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         logoImagePage.drawText(`\t\t\tTotal Profit Paid: ${data?.records?.records[0]?.amount} Rs.\n\t\tPayment Date: ${new Date(data?.records?.records[0]?.datePaid).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}`, {
  //             x: 184,
  //             y: 530,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         logoImagePage.drawText(`\t\t Bank Detail`, {
  //             x: 200,
  //             y: 470,
  //             size: 20,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         logoImagePage.drawText(`\t\t\tAccount Holder Name: ${bank[0]?.accountHolderName}`, {
  //             x: 164,
  //             y: 450,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(`\t\t\tBank Name: ${bank[0]?.bankName}`, {
  //             x: 184,
  //             y: 430,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(`\t\t\tIBAN: ${bank[0]?.iban}`, {
  //             x: 174,
  //             y: 410,
  //             size: 15,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         const tableData = [['Order\nID', 'Order\nAmount', 'Order\nDate', 'Profit\nAmount']];
  //         data?.records?.records[0]?.orders?.forEach(item => {
  //             tableData.push([item?.id.toString(), `${item?.orderAmount.toString()} Rs.`, new Date(item?.date).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' }), `${item?.profitAmount.toString()} Rs.`]);
  //         });

  //         const tableWidth = 500;
  //         const cellPadding = 50;
  //         // const lineHeight = 40;
  //         const tableX = 50;
  //         const tableY = 350;

  //         // Draw table headers
  //         logoImagePage.drawText(tableData[0][0], {
  //             x: tableX + 20,
  //             y: tableY,
  //             size: 16,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(tableData[0][1], {
  //             x: tableX + 220,
  //             y: tableY,
  //             size: 16,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(tableData[0][2], {
  //             x: tableX + 320,
  //             y: tableY,
  //             size: 16,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });
  //         logoImagePage.drawText(tableData[0][3], {
  //             x: tableX + 420,
  //             y: tableY,
  //             size: 16,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         // Draw table lines and cell contents
  //         for (let i = 1; i < (tableData.length <= 5 ? tableData.length : 5); i++) {
  //             const rowY = 350 - (i * 50);

  //             logoImagePage.drawLine({
  //                 start: { x: tableX, y: rowY },
  //                 end: { x: tableX + tableWidth, y: rowY },
  //                 thickness: 1,
  //                 color: rgb(0, 0, 0),
  //             });

  //             logoImagePage.drawText(tableData[i][0], {
  //                 x: tableX + 20,
  //                 y: rowY - (cellPadding / 2),
  //                 size: 12,
  //                 font,
  //                 color: rgb(0, 0, 0),
  //             });

  //             logoImagePage.drawText(tableData[i][1], {
  //                 x: tableX + 220,
  //                 y: rowY - (cellPadding / 2),
  //                 size: 12,
  //                 font,
  //                 color: rgb(0, 0, 0),
  //             });
  //             logoImagePage.drawText(tableData[i][2], {
  //                 x: tableX + 320,
  //                 y: rowY - (cellPadding / 2),
  //                 size: 12,
  //                 font,
  //                 color: rgb(0, 0, 0),
  //             });
  //             logoImagePage.drawText(tableData[i][3], {
  //                 x: tableX + 420,
  //                 y: rowY - (cellPadding / 2),
  //                 size: 12,
  //                 font,
  //                 color: rgb(0, 0, 0),
  //             });
  //         }

  //         if (tableData.length >= 5) {
  //             const page2 = pdfDoc.insertPage(1);
  //             for (let i = 6; i < tableData.length; i++) {
  //                 const rowY = 800 - (i * 50);

  //                 page2.drawLine({
  //                     start: { x: tableX, y: rowY },
  //                     end: { x: tableX + tableWidth, y: rowY },
  //                     thickness: 1,
  //                     color: rgb(0, 0, 0),
  //                 });

  //                 page2.drawText(tableData[i][0], {
  //                     x: tableX + 20,
  //                     y: rowY - (cellPadding / 2),
  //                     size: 12,
  //                     font,
  //                     color: rgb(0, 0, 0),
  //                 });

  //                 page2.drawText(tableData[i][1], {
  //                     x: tableX + 220,
  //                     y: rowY - (cellPadding / 2),
  //                     size: 12,
  //                     font,
  //                     color: rgb(0, 0, 0),
  //                 });
  //                 page2.drawText(tableData[i][2], {
  //                     x: tableX + 320,
  //                     y: rowY - (cellPadding / 2),
  //                     size: 12,
  //                     font,
  //                     color: rgb(0, 0, 0),
  //                 });
  //                 page2.drawText(tableData[i][3], {
  //                     x: tableX + 420,
  //                     y: rowY - (cellPadding / 2),
  //                     size: 12,
  //                     font,
  //                     color: rgb(0, 0, 0),
  //                 });
  //             }
  //         }

  //         // Save the PDF as a Blob
  //         const pdfBytes = await pdfDoc.save();

  //         // Create a download link for the PDF
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
  //         downloadLink.download = `${data?.user?.name}`;
  //         downloadLink.click();
  //         setLoading(false)
  //     } catch (error) {
  //         setLoading(false)
  //         Notification('Error', error?.response?.data?.message, 'danger');
  //     }
  // }

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
            <table className="table ">
              <thead>
                <tr className="">
                  <th colSpan="1">Sr.</th>
                  <th colSpan="1" className="text-center">
                    Customer Name
                  </th>
                  <th colSpan="1" className="text-center">
                    Orders
                  </th>
                  <th colSpan="1" className="text-center">
                    Order Details
                  </th>
                  <th colSpan="1" className="text-center">
                    Profit Amount
                  </th>
                  <th colSpan="1" className="text-center">
                    Payment Date
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
                          {item?.orders?.length}
                        </td>
                        <td colSpan="1" className="text-center">
                          <Link
                            to={`/user/mysingleprofit/${item._id}`}
                            style={{ fontSize: "20px" }}
                          >
                            <button className="btn btn-sm btn-info text-light">
                              View Orders
                            </button>
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

export default MyPaidProfits;
