import React from "react";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const CSVDownloadButton = ({ data, fileName, buttonText }) => {
  const csvData = data; // Your CSV data should be an array of objects, e.g., [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
  const headers = Object.keys(csvData[0]); // Assuming all objects in the data array have the same structure, use keys as headers.

  const handleDownload = () => {
    const csvString = csvData.map((row) =>
      headers.map((header) => row[header]).join(",")
    );

    const blob = new Blob([csvString.join("\r\n")], {
      type: "text/csv;charset=utf-8",
    });

    saveAs(blob, fileName); // Save the CSV file with the specified name
  };

  return (
    // <button className='btn btn-secondary' onClick={handleDownload}>
    //   {buttonText || 'Download CSV'}
    // </button>
    <Button
      variant="outlined"
      onClick={handleDownload}
      startIcon={<DownloadIcon />}
    >
      {buttonText || "Download CSV"}
    </Button>
  );
};

export default CSVDownloadButton;
