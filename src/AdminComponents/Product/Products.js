import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { ReactNotifications } from "react-notifications-component";
import { Link, useSearchParams } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import Loader from "../../Loader/Loader";
import Notification from "../../Notifications/Notifications";
import Papa from "papaparse";

const AdminProducts = () => {
  const host = process.env.REACT_APP_API_URL;
  const { loading, setLoading, GetAllProducts } = useContext(ProductContext);
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/api/product/deleteProduct/${id}`);

      // Optimistically update state: remove product with matching id
      setFilter((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      Notification("Success", "Product Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Notification(
        "Error",
        error?.response?.data || "Something went wrong",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [allproducts, setAllProducts] = useState([]);
  const itemsPerPage = 50; // Change this to the number of items you want to show per page
  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [checkFilter, setfeatured] = useState({
    featured: false,
    onSale: false,
  });
  const [filter, setFilter] = useState([]);

  const setChecked = (e) => {
    setLoading(true);
    setfeatured({ ...checkFilter, [e.target.name]: e.target.checked });
    if (e.target.checked) {
      setFilter(
        allproducts.filter((pro) => {
          return pro[e.target.name] === true;
        })
      );
    } else {
      setFilter(allproducts);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);

    // If the query is filled
    if (query) {
      const queryLower = query.toLowerCase();
      // Filter products based on title or skuNumber matching the query
      const newProducts = allproducts.filter((pro) => {
        return (
          pro.title.toLowerCase().includes(queryLower) ||
          pro.skuNumber.toLowerCase().includes(queryLower)
        );
      });

      setFilter(newProducts); // Update the filter state with the new products
    } else {
      // If no query, show all products
      setFilter(allproducts);
    }

    setLoading(false); // Stop the loading state
    setCurrentPage(1); // Reset the page to 1 when search is performed
  };

  // Get the number of pages based on the number of items and items per page
  const totalPages = Math.ceil(filter.length / itemsPerPage);

  // Get the items to display based on the current page
  const paginatedItems = filter.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const { data } = await axios.get(`${host}/api/product/allactiveproducts`);
      setAllProducts(data?.products);
      setFilter(data?.products);
      setLoading(false);
    };
    loadProducts();
  }, []);

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
      description: item.description,
    };
  });

  const csv = Papa.unparse(csVDataDownload);
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = "products.csv";
    document.body.appendChild(element);
    element.click();
  };

  // Function to generate pagination buttons with ellipses
  const generatePagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2; // Maximum number of page buttons to show
    const range = 2; // Number of pages before and after the current page to display

    // First pages
    for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
      pageNumbers.push(i);
    }

    // Ellipses before current page if needed
    if (currentPage > range + 1) {
      pageNumbers.push("...");
    }

    // Pages around current page
    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Ellipses after current page if needed
    if (currentPage < totalPages - range) {
      pageNumbers.push("...");
    }

    // Last pages
    if (totalPages > maxPagesToShow) {
      const startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      for (let i = startPage; i <= totalPages; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };
  const ChangeActivation = async (id) => {
    try {
      setLoading(true);

      const { data: updatedProduct } = await axios.put(
        `${host}/api/product/changeActivation/${id}`
      );

      // Update activation status in filtered products
      setFilter((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, ...updatedProduct } : product
        )
      );

      Notification("Success", "Product activation status updated", "success");
    } catch (error) {
      Notification(
        "Error",
        error?.response?.data || "Something went wrong",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setFilter(allproducts);

    // Stop the loading state
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid">
      {loading ? null : (
        <div className="row my-3 align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <input
              type="text"
              name="search"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="form-control"
              placeholder="Search by Product Title or Sku"
            />
            {query && (
              <button
                onClick={() => {
                  handleClearSearch();
                }}
                className="btn btn-outline-secondary btn-sm ms-2"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => handleSearch()}
              className="btn btn-primary btn-sm ms-2"
            >
              Search
            </button>
          </div>

          <div className="col-md-2 text-center fw-bold">
            All Products ({allproducts?.length || 0})
          </div>

          <div className="col-md-4 d-flex justify-content-end">
            <Link to="/admin/addProduct">
              <button className="btn btn-primary btn-sm ms-2">Add New</button>
            </Link>
            <Link to="/admin/addProduct/importproducts">
              <button className="btn btn-info btn-sm ms-2">Import</button>
            </Link>
            <button className="btn btn-primary btn-sm ms-2" onClick={download}>
              Export
            </button>
          </div>
        </div>
      )}
      <ReactNotifications />
      <br />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="d-flex flex-row mt-2">
            <div className="ms-auto me-5">
              <div className="form-check">
                <input
                  className="form-check-input"
                  name="featured"
                  value={checkFilter.featured}
                  onChange={setChecked}
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <small className="form-check-label" for="flexCheckDefault">
                  Only Featured
                </small>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  name="onSale"
                  value={checkFilter.onSale}
                  onChange={setChecked}
                  type="checkbox"
                  id="flexCheckChecked"
                />
                <small className="form-check-label" for="flexCheckChecked">
                  Only On Sale
                </small>
              </div>
            </div>
          </div>
          <div>
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
              <tbody>
                {paginatedItems.map((item, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>
                        <img
                          src={item.photo.url}
                          alt=""
                          height="50px"
                          width={"50px"}
                          loading="lazy"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.category.name}</td>
                      <td>{item.skuNumber}</td>
                      <td>{item.stock}</td>
                      <td>{item.wholesalePrice}</td>
                      <td>{item.featured ? "Yes" : "No"}</td>
                      <td>{item.deActivated ? "No" : "Yes"}</td>
                      <td>{item.onSale ? "Yes" : "No"}</td>
                      <td>
                        <Link to={`/admin/product/edit/${item._id}`}>
                          <button className="btn btn-info" id={item._id}>
                            Edit
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          id={item._id}
                          className="btn btn-danger"
                          onClick={() => deleteProduct(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          id={item._id}
                          className={`btn ${
                            item.deActivated ? "btn-success" : "btn-danger"
                          }`}
                          onClick={() => ChangeActivation(item._id)}
                        >
                          {item.deActivated ? "Activate" : "Deactivate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Display page numbers with ellipses */}
              {generatePagination().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={index} className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
