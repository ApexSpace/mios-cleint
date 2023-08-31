import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductContext from '../../context/Product/ProductContext';
import Notification from '../../Notifications/Notifications';
import { ReactNotifications } from 'react-notifications-component';
import Loader from '../../Loader/Loader';


const EditCategory = () => {
  const host = process.env.REACT_APP_API_URL;
  const [name, setName] = useState("")
  const { getProducts } = useContext(ProductContext);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const getDetails = async () => {
      setLoading(true)
      const { data } = await axios.get(`${host}/api/category/category/${id}`);
      setName(data.category?.name)
      setLoading(false)
    }
    getDetails();
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => {
    setName(e.target.value)
  };

  const params = useParams();
  const { id } = params;


  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await axios.put(`${host}/api/category/editcategory/${id}`, { name });
      await getProducts();
      setLoading(false)
      Notification('Success', 'Updation Successful', 'success');
      setTimeout(() => {
        Navigate('/admin/categories');
      }, 2000);
    } catch (e) {
      setLoading(false)
      Notification('Error', e?.response?.data?.message, 'danger');
    }
  };

  return (
    <>
      <ReactNotifications />
      {loading ? <Loader /> :
        <div className="container">
          <div className="row">
            <div className="col-md-12">


              <div className='row mb-3 mt-5'>
                <h1 className='col'></h1>
                <h2 className='col'>Edit Category</h2>
                <div className="col text-end me-5">
                  <Link to="/admin/categories">
                    <button className="btn btn-info">Go Back</button>
                  </Link>
                </div>
              </div>


              <form
                method="post"
                onSubmit={handleSubmit}
                className="card py-4 px-4 rounded"
              >
                <div className="row mb-2  d-flex justify-content-center">
                  <div className="form-group col-sm-4">
                    <label htmlFor="pTitle">Category Title</label>
                    <br />
                    <br />
                    <input type="text" value={name} placeholder='Enter Category Title' className="form-control" id="pTitle" name="pTitle" onChange={onChange} required />
                  </div>
                  <div className='col-sm-4 align-self-end'>
                    <button type="submit" className="btn btn-success ">
                      Update Category
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default EditCategory