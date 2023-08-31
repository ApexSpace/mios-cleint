import React, { useState, useContext } from 'react'
import axios from 'axios';
import Papa from 'papaparse';
import ProductContext from "../../context/Product/ProductContext";
import { useNavigate } from 'react-router-dom';
import CSVDownloadButton from '../../Components/Download_CSV/Csvformat';


const ImportProducts = () => {
  const host = process.env.REACT_APP_API_URL;
  const { getProducts } = useContext(ProductContext);
  const navigate = useNavigate();
  const [data, setData] = useState("");

  // CSV File Data
  // const data_csv = [
  //   ["Title", "Category", "SkuNumber", "Stock", "WholesalePrice", "DropshipperPrice", "DiscountedPriceW", "DiscountedPriceD", "Weight", "Featured", "OnSale", "Photo Link", "Description"],
  // ];

  const handleChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: function (results) {
        setData(results.data);
      }
    });
  };



  const handleSave = async (e) => {
    e.preventDefault();
    let arrayData = data.slice(1, data.length - 1);
    let parseData = [];
    arrayData.map((item) => {
      if (item[0] === "" && item[1] === "" && item[2] === "" && item[3] === "" && item[4] === "" && item[5] === "" && item[6] === "" && item[7] === "" && item[8] === "" && item[9] === "" && item[10] === "" && item[11] === "" && item[12] === "") {
        return null
      }
      let data = {
        title: item[0],
        description: item[1],
        skuNumber: item[2],
        category: item[3],
        stock: item[4],
        wholesalePrice: item[5],
        dropshipperPrice: item[6],
        discountedPriceW: item[7],
        discountedPriceD: item[8],
        weight: item[9],
        featured: item[10],
        onSale: item[11],
        photo: item[12],
      }
      parseData.push(data);

      return null
    })
    try {
      axios.post(`${host}/api/product/importproduct`, parseData).then((res) => {
        getProducts();
        navigate('/admin/products');
      }).catch((err) => {
        alert("Something went wrong may be you are trying to import duplicate products or invalid data");
      })

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 my-4">
            <h1 className='text-center'>Import CSV Of Products</h1>
            <div>
              <div className="row mb-2   justify-content-center">
                <div className="form-group col-sm-8 mt-3">
                  <label htmlFor="importFile" className=''>Upload CSV</label>
                  <div className="row mb-3">
                    <span>Please download the file format in which you will mention all the details.</span>
                    <div className="col-4">
                      {/* <CSVDownloadButton data={data_csv} fileName="format.csv" buttonText="Download CSV Format" /> */}
                      <a href='/Assets/sampleCsvFile.csv' className='btn btn-info btn-sm' download>Download Sample</a>
                    </div>
                  </div>
                  <input type='file' className='form-control mb-3' name="file" onChange={handleChange} accept=".csv" />
                  <button type='button' onClick={handleSave} className='btn btn-primary' disabled={
                    data === "" ? true : false
                  }>
                    Import CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportProducts