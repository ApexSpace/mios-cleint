import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Link, useParams } from "react-router-dom";
import Notification from "../../Notifications/Notifications";
import mioslogo from '../assets/images/mioslogo.png';
import Loader from "../../Loader/Loader";
import { Download } from '@mui/icons-material'
const image = window.location.origin + "/Assets/no-data.svg";


const PaidPerUser = () => {
  const host = process.env.REACT_APP_API_URL;
  const [profits, setAllProfits] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllProfits();
    // eslint-disable-next-line
  }, [])
  const { id } = useParams();
  const getAllProfits = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/profitrecords/paidperuser/${id}`);
    setAllProfits(data);
    setFilteredRecords(data?.records);
    setLoading(false)
  }


  const download = async (e) => {
    try {
      setLoading(true);
      const ids = e.target.id.split('_***_')
      const userid = ids[0];
      const id = ids[1];
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);


      // Load the logo image
      const response = await fetch(mioslogo);
      const logoImage = await response.arrayBuffer();


      // Embed the logo image in the PDF
      const logoImagePage = pdfDoc.insertPage(0);
      const logoImageEmbed = await pdfDoc.embedPng(logoImage);
      const logoDims = logoImageEmbed.scale(0.1);
      logoImagePage.drawImage(logoImageEmbed, {
        x: logoImagePage.getWidth() / 2 - logoDims.width / 2,
        y: logoImagePage.getHeight() - logoDims.height - 50,
        width: logoDims.width,
        height: logoDims.height,
      });

      const { data } = await axios.get(`${host}/api/profitrecords/singleprofit/${userid}/${id}`)
      let bank = await axios.get(`${host}/api/bankDetails/${data?.user?._id}`);
      // bank = bank?.data;
      // Add the heading to the PDF
      logoImagePage.drawText(`Paid Profit Detail`, {
        x: 211,
        y: 700,
        size: 24,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(`\t\tUser Detail`, {
        x: 200,
        y: 670,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      logoImagePage.drawText(`\t\tPaid To: ${data?.user?.name} (${data?.user?.role}) \n\t\tPhone Number: ${data?.user?.phone}`, {
        x: 174,
        y: 650,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });


      logoImagePage.drawText(`\t\tProfit Detail`, {
        x: 200,
        y: 570,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      const num = data?.records?.records[0]?.orders?.length;
      logoImagePage.drawText(`\t\t\tNumber Of Orders: ${num}`, {
        x: 184,
        y: 550,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });

      logoImagePage.drawText(`\t\t\tTotal Profit Paid: ${data?.records?.records[0]?.amount} Rs.\n\t\tPayment Date: ${new Date(data?.records?.records[0]?.datePaid).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}`, {
        x: 184,
        y: 530,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });

      logoImagePage.drawText(`\t\t Bank Detail`, {
        x: 200,
        y: 470,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      logoImagePage.drawText(`\t\t\tAccount Holder Name: ${bank[0]?.accountHolderName}`, {
        x: 164,
        y: 450,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(`\t\t\tBank Name: ${bank[0]?.bankName}`, {
        x: 184,
        y: 430,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(`\t\t\tIBAN: ${bank[0]?.iban}`, {
        x: 174,
        y: 410,
        size: 15,
        font,
        color: rgb(0, 0, 0),
      });



      const tableData = [['Order\nID', 'Order\nAmount', 'Order\nDate', 'Profit\nAmount']];
      data?.records?.records[0]?.orders?.forEach(item => {
        tableData.push([item?.id.toString(), `${item?.orderAmount.toString()} Rs.`, new Date(item?.date).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' }), `${item?.profitAmount.toString()} Rs.`]);
      });

      const tableWidth = 500;
      const cellPadding = 50;
      const lineHeight = 40;
      const tableX = 50;
      const tableY = 350;

      // Draw table headers
      logoImagePage.drawText(tableData[0][0], {
        x: tableX + 20,
        y: tableY,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(tableData[0][1], {
        x: tableX + 220,
        y: tableY,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(tableData[0][2], {
        x: tableX + 320,
        y: tableY,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
      logoImagePage.drawText(tableData[0][3], {
        x: tableX + 420,
        y: tableY,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw table lines and cell contents
      for (let i = 1; i < (tableData.length <= 5 ? tableData.length : 5); i++) {
        const rowY = 350 - (i * 50);

        logoImagePage.drawLine({
          start: { x: tableX, y: rowY },
          end: { x: tableX + tableWidth, y: rowY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        logoImagePage.drawText(tableData[i][0], {
          x: tableX + 20,
          y: rowY - (cellPadding / 2),
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        logoImagePage.drawText(tableData[i][1], {
          x: tableX + 220,
          y: rowY - (cellPadding / 2),
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        logoImagePage.drawText(tableData[i][2], {
          x: tableX + 320,
          y: rowY - (cellPadding / 2),
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        logoImagePage.drawText(tableData[i][3], {
          x: tableX + 420,
          y: rowY - (cellPadding / 2),
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }

      if (tableData.length >= 5) {
        const page2 = pdfDoc.insertPage(1);
        for (let i = 6; i < tableData.length; i++) {
          const rowY = 800 - (i * 50);

          page2.drawLine({
            start: { x: tableX, y: rowY },
            end: { x: tableX + tableWidth, y: rowY },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          page2.drawText(tableData[i][0], {
            x: tableX + 20,
            y: rowY - (cellPadding / 2),
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });

          page2.drawText(tableData[i][1], {
            x: tableX + 220,
            y: rowY - (cellPadding / 2),
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
          page2.drawText(tableData[i][2], {
            x: tableX + 320,
            y: rowY - (cellPadding / 2),
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
          page2.drawText(tableData[i][3], {
            x: tableX + 420,
            y: rowY - (cellPadding / 2),
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }

      // Save the PDF as a Blob
      const pdfBytes = await pdfDoc.save();

      // Create a download link for the PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      downloadLink.download = `${data?.user?.name}`;
      downloadLink.click();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Notification('Error', error?.response?.data?.message, 'danger');
    }
  }


  const filter = () => {

    if (to && from && (new Date(from).toISOString() <= new Date(to).toISOString())) {
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
        Notification('Error', 'Enter Valid Dates', 'danger')
      }
    } else {
      Notification('Error', 'Enter Valid Dates', 'danger')
    }
  }

  return (
    <><ReactNotifications />
      {loading ? <Loader /> : <div className="main">
        <div className="d-flex w-80 align-items-center justify-content-evenly mb-3 mt-3">

          <div>
            <label for="" className="form-label">Starting From: &nbsp;&nbsp;&nbsp;</label>
            <input type="Date" className="p-1" onChange={(e) => setFrom(e.target.value)} value={from} name="from" placeholder="" />
          </div>
          <div>
            <label for="" className="form-label">Till Date:&nbsp;&nbsp;&nbsp; </label>
            <input type="Date" className="p-1" name="to" onChange={(e) => setTo(e.target.value)} value={to} placeholder="" />
          </div>
          <button className="btn btn-sm btn-info text-light" onClick={filter}>Filter</button>
          <button className="btn btn-sm btn-info text-light" onClick={() => setFilteredRecords(profits?.records)}>Fetch All</button>
        </div>
        <div className="container-fluid">
          <table className="table table-hover table-bordered">
            <thead>
              <tr className="table-dark">
                <th colSpan="1" >Sr.</th>
                <th colSpan="1" className="text-center">Customer Name</th>
                <th colSpan="1" className="text-center">Orders No.</th>
                <th colSpan="1" className="text-center">Profit Amount</th>
                <th colSpan="1" className="text-center">Payment Date</th>
                <th colSpan="1" className="text-center">PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords && filteredRecords?.map((item, key) => {
                return (<tr key={key}>
                  <td colSpan="1" className="text-center">{key + 1}</td>
                  <td colSpan="1" className="text-center">{profits?.user?.name}</td>
                  <td colSpan="1" className="text-center"><Link to={`/admin/singleprofit/${profits?.user?._id}/${item._id}`} style={{ fontSize: "20px" }}>{item?.orders?.length}</Link></td >
                  <td colSpan="1" className="text-center">{item?.amount} Rs.</td>
                  <td colSpan="1" className="text-center">{new Date(item?.datePaid).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
                  <td colSpan="1" className="text-center"><button className="btn btn-sm btn-info text-light" id={`${profits?.user?._id}_***_${item._id}`} onClick={download}>
                    Receipt <Download />
                  </button>
                  </td >
                </tr>)
              })}
            </tbody>
          </table>
          {profits?.length <= 0 && <div className='no_data'>
            <img className='no_data-img' src={image} alt='No Data' ></img>
          </div>}
        </div>
      </div>}
    </>
  );
}

export default PaidPerUser;

