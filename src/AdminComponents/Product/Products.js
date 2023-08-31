import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useSearchParams } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import Loader from "../../Loader/Loader";
import Notification from "../../Notifications/Notifications";
import Papa from 'papaparse';


const AdminProducts = () => {
  const host = process.env.REACT_APP_API_URL;
  const { products, getProducts, loading, setLoading, allproducts, GetAllProducts } = useContext(ProductContext);
  const deleteProduct = async (e) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/api/product/deleteProduct/${e.currentTarget.id}`);
      await getProducts();
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      Notification("Error", error.response.data, 'danger');
    }
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [checkFilter, setfeatured] = useState({
    featured: false,
    onSale: false
  });

  const setChecked = (e) => {
    setfeatured({ ...checkFilter, [e.target.name]: e.target.checked });
    if (e.target.checked) {
      setFilter(allproducts.filter((pro) => {
        return pro[e.target.name] === true;
      }));
    } else {
      setFilter(allproducts);
    }
  }

  const [filter, setFilter] = useState([])

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchParams({ query: e.target.value });
  }

  useEffect(() => {
    if (query) {
      const newProducts = allproducts.filter((pro) => {
        return pro.title.toLowerCase().includes(query.toLowerCase());
      });
      setFilter(newProducts);
    } else {
      setFilter(allproducts);
    }
  }, [query, allproducts]);


  const csVDataDownload = filter.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category.name,
      skuNumber: item.skuNumber,
      stock: item.stock,
      wholesalePrice: item.wholesalePrice,
      discountedPriceW: item.discountedPriceW,
      featured: item.featured,
      onSale: item.onSale,
      weight: item.weight,
      image: item.photo.url,
      description: item.description
    }
  })

  const csv = Papa.unparse(csVDataDownload);
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = "products.csv";
    document.body.appendChild(element);
    element.click();
  }

  const ChangeActivation = async (e) => {
    try {
      setLoading(true);
      await axios.put(`${host}/api/product/changeActivation/${e.currentTarget.id}`);
      await GetAllProducts();
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      Notification("Error", error.response.data, 'danger');
    }
  }

  useEffect(() => {
    // getProducts();
    GetAllProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <div className="container-fluid">
      {loading ? null :
        <div className="row my-3 justify-content-center">
          <div className="col-md-4 justify-content-center">
            <input type="text" name='search' onChange={handleChange} value={query} className='form-control' placeholder='Search Product by Title' />
          </div>
          <div className="col-md-4 mt-2 text-center">All Products ({allproducts && allproducts.length})</div>
          <div className="col-md-4 text-center d-flex justify-content-evenly">
            <Link to="/admin/addProduct">
              <button className="btn btn-primary btn-sm">Add New</button>
            </Link>
            <Link to="/admin/addProduct/importproducts">
              <button className="btn btn-info btn-sm">Import</button>
            </Link>
            <button className="btn btn-primary btn-sm" onClick={download}>Export</button>
          </div>

        </div>

      }
      <ReactNotifications /><br />
      {loading ? <Loader /> :
        <>
          <div className="d-flex flex-row mt-2">
            <div className="ms-auto me-5">
              <div className="form-check">
                <input className="form-check-input" name="featured" value={checkFilter.featured} onChange={setChecked} type="checkbox" id="flexCheckDefault" />
                <small className="form-check-label" for="flexCheckDefault">
                  Only Featured
                </small>
              </div>
              <div className="form-check">
                <input className="form-check-input" name="onSale" value={checkFilter.onSale} onChange={setChecked} type="checkbox" id="flexCheckChecked" />
                <small className="form-check-label" for="flexCheckChecked">
                  Only On Sale
                </small>
              </div>
            </div>
          </div>
          <table className="table" width={"95%"}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Title</th>
                <th>Category</th>
                <th>SkuNumber</th>
                <th>Stock</th>
                <th>Wholeseller Price</th>
                <th>Featured</th>
                <th>Active</th>
                <th>OnSale</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Edit Activation</th>
              </tr>
            </thead>
            {filter && filter.map((item, ind) => {
              return (
                <tbody key={ind}>
                  <tr>
                    <td>{ind + 1}</td>
                    <td> <img src={item.photo.url} alt="" height="50px" width={"50px"} /> </td>
                    <td> {item.title} </td>
                    <td>{item.category.name}</td>
                    <td>{item.skuNumber}</td>
                    <td>{item.stock}</td>
                    <td>{item.wholesalePrice}</td>
                    <td>{item.featured ? `Yes` : `No`}</td>
                    <td>{item.deActivated ? `No` : `Yes`}</td>
                    <td>{item.onSale ? `Yes` : `No`}</td>
                    <td><Link to={`/admin/product/edit/${item._id}`}><button className="btn btn-info" id={item._id} >Edit</button> </Link> </td>
                    <td><button id={item._id} className="btn btn-danger" onClick={deleteProduct} >Delete</button> </td>
                    <td><button id={item._id} className={`btn ${item.deActivated ? 'btn-success' : 'btn-danger'}`} onClick={ChangeActivation} >{item.deActivated ? "Activate" : "Deactivate"}</button> </td>
                  </tr>
                </tbody>
              )
            })}

          </table>
        </>}
    </div >
  );
}

export default AdminProducts;