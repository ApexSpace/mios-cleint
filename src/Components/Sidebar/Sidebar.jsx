import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import image from "../assets/images/logo_sml 1.png";
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import "./SideBar.css";
import { arr, navArr, orderStatuses } from "./SidebarData";
// import Loader from "../../Loader/Loader";
import OrderContext from "../../context/Order/OrderContext";

export default function Sidebar() {
  const host = process.env.REACT_APP_API_URL;
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const Navbar = styled(AppBar)`
    background-color: white;

    color: black;
  `;
  // backdrop-filter: blur(10px);
  const location = useLocation();
  const Navigate = useNavigate();
  const Navigation = (e) => {
    Navigate(e.target.id);
    setOpen(false);
  };
  let [numbers, setNumbers] = useState({
    pending: 0,
    shipped: 0,
    delivered: 0,
    returned: 0,
  });
  // eslint-disable-next-line
  let [count, setCount] = useState({});
  // const { userOrders, orderLoading, getMyOrders } = useContext(OrderContext);
  const { userOrders, getMyOrders } = useContext(OrderContext);
  const [pending, setPending] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [returned, setReturned] = useState(0);
  const { CartItems, categories, Cart } = useContext(ProductContext);
  const { user, loading } = useContext(UserContext);
  const [categoryState, setCategoryState] = useState(categories);

  useEffect(() => {
    setCategoryState(categories);
  }, [categories]);

  //capitalize first letter of a word and also after space in a string
  const capitalizeFirstWord = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // const capitalizeFirstWord = (str) => {
  //     return str.charAt(0).toUpperCase() + str.slice(1);
  // }

  useEffect(() => {
    //window.scrollTo(0, 0);
    if (
      location.pathname === "/" ||
      userOrders.length !==
        numbers.pending + numbers.delivered + numbers.returned
    ) {
      // getMyOrders();
      Cart();
      // setPending(
      //   userOrders.filter((order) => order.orderStatus === "Pending").length
      // );
      // setDelivered(
      //   userOrders.filter((order) => order.orderStatus === "Delivered").length
      // );
      // setReturned(
      //   userOrders.filter((order) => order.orderStatus === "Returned").length
      // );
      // setNumbers({ pending, delivered, returned });
    }
    const getNumbers = async () => {
      const { data } = await axios.get(`${host}/api/product/catcount`);
      setCount(data.count);
    };
    getNumbers();

    // eslint-disable-next-line
  }, []);

  const logout = async () => {
    await axios.get(`${host}/api/auth/logout`, {
      withCredentials: true,
    });
    Navigate("/");
    window.location.reload();
  };

  const search = (e) => {
    setCategoryState([]);
    categories.forEach((i) => {
      if (i?.name?.toLowerCase().includes(e.target.value.toLowerCase())) {
        setCategoryState((prevVal) => [...prevVal, i]);
      }
    });
  };

  const bodyStyles =
    user.isAdmin === false && user.name && window.innerWidth >= 750
      ? {
          paddingLeft: "220px",
          width: "95%",
        }
      : {};
  document.body.style.paddingLeft = bodyStyles.paddingLeft;
  document.body.style.width = bodyStyles.width;

  return (
    <>
      {!location.pathname.includes("admin") && window.innerWidth <= 750 ? (
        <Box sx={{ display: "flex" }}>
          {loading ? null : (
            <Navbar position="fixed" open={open}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ marginRight: 5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="css-1170n61"
                  >
                    <rect
                      x="1"
                      y="5"
                      width="14"
                      height="1.5"
                      rx="1"
                      fill="#ffffff"
                    ></rect>
                    <rect
                      x="1"
                      y="9"
                      width="14"
                      height="1.5"
                      rx="1"
                      fill="#ffffff"
                    ></rect>
                  </svg>{" "}
                </IconButton>
                <center style={{ flexGrow: 1 }}>
                  <Link to="/" className="header__logo">
                    <img className="logo_mios" src={image} alt="logo" />
                  </Link>
                </center>
                <div
                  className="dropdown smooth-drop text-primary"
                  style={{ cursor: "pointer", justifySelf: "flex-end" }}
                >
                  <div
                    className="dropdown-toggle ms-5"
                    id="triggerId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <AccountCircleIcon fontSize="large" />
                  </div>
                  <div
                    className="dropdown-menu loggedin"
                    aria-labelledby="triggerId"
                  >
                    <Link style={{ textDecoration: "none" }} to="/user/Profile">
                      <div className="dropdown-item">Profile</div>
                    </Link>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/user/dashboard"
                    >
                      <div className="dropdown-item">Dashboard</div>
                    </Link>
                    <div onClick={logout} className="dropdown-item">
                      Logout
                    </div>
                  </div>
                </div>
              </Toolbar>
            </Navbar>
          )}
          <Drawer
            anchor="left"
            PaperProps={{
              style: {
                backgroundColor: "transparent",
                backdropFilter: "blur(5px)",
              },
            }}
            BackdropProps={{
              invisible: false,
              style: { opacity: 1, backgroundColor: "white !important" },
            }}
            open={open}
            onClose={handleDrawerClose}
          >
            <div style={{ alignSelf: "flex-end", cursor: "pointer" }}>
              <CloseIcon
                sx={{
                  color: "white !important",
                  height: "40px",
                  width: "40px",
                  backgroundColor: "#1976d2",
                }}
                onClick={handleDrawerClose}
              >
                Close
              </CloseIcon>
            </div>

            <div
              style={{
                backgroundColor: "transparent",
                height: "100vh",
                width: "300px",
              }}
            >
              <ul>
                {/* Menu */}
                {arr.map((item, ind) => {
                  return (
                    <li
                      key={ind}
                      id={item.path}
                      className="AdminSideBarLink py-1"
                      style={
                        location.pathname.toLowerCase() ===
                        item.path.toLowerCase()
                          ? {
                              // backgroundColor: "#1a4d84 !important",
                              color: "white !important",
                            }
                          : null
                      }
                      onClick={Navigation}
                    >
                      &nbsp;&nbsp;{item.title}
                    </li>
                  );
                })}
                <Divider />
                {/* Order Statuses */}
                <div>
                  <h4 style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                    Orders
                  </h4>
                  {orderStatuses.map((item, ind) => {
                    return (
                      <p
                        key={ind}
                        id={item.path}
                        className="AdminSidebarSubHead m-0 py-1"
                        style={
                          location.pathname.toLowerCase() ===
                          item.path.toLowerCase()
                            ? {
                                backgroundColor: "#1a4d84 !important",
                                color: "white !important",
                              }
                            : null
                        }
                        onClick={Navigation}
                      >
                        &nbsp;&nbsp;{item.title}
                      </p>
                    );
                  })}
                </div>
                <Divider />
                {user?.role === "dropshipper" && (
                  <div>
                    <h4 style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                      Profits
                    </h4>
                    <p className="mt-1 ps-2 py-1">
                      <Link
                        to="/user/mypaidprofits"
                        className="AdminSidebarSubHead"
                        style={
                          location.pathname.toLowerCase() ===
                          "/user/mypaidprofits"
                            ? {
                                backgroundColor: "#1a4d84 !important",
                                color: "white !important",
                              }
                            : null
                        }
                      >
                        Paid Profits
                      </Link>
                    </p>
                    <p className="mt-1 ps-2 py-1">
                      <Link
                        to="/user/mypendingprofits"
                        className="AdminSidebarSubHead"
                        style={
                          location.pathname.toLowerCase() ===
                          "/user/mypendingprofits"
                            ? {
                                backgroundColor: "#1a4d84 !important",
                                color: "white !important",
                              }
                            : null
                        }
                      >
                        Pending Profits
                      </Link>
                    </p>
                    <Divider />
                  </div>
                )}
                {/* Types of Product Sales */}
                <div>
                  <h4 style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                    Products
                  </h4>
                  {navArr.map((item, ind) => {
                    return (
                      <p
                        id={item.path}
                        key={ind}
                        className="AdminSidebarSubHead m-0 py-1"
                        style={
                          location.pathname.toLowerCase() ===
                          item.path.toLowerCase()
                            ? {
                                backgroundColor: "#1a4d84 !important",
                                color: "white !important",
                              }
                            : null
                        }
                        onClick={Navigation}
                      >
                        &nbsp;&nbsp;{item.title}
                      </p>
                    );
                  })}
                </div>
                <Divider />

                {/* Categories */}
                <div>
                  <h6 style={{ paddingTop: "10px", paddingLeft: "6px" }}>
                    Categories
                  </h6>
                  {categories.map((item, ind) => {
                    return (
                      <Typography
                        onClick={() => {
                          handleDrawerClose();
                        }}
                      >
                        <Link key={ind} to={`/category/${item._id}`}>
                          <p
                            className="AdminSidebarSubHead m-0 py-1 px-2"
                            style={
                              location.pathname.toLowerCase() ===
                              `/category/${item._id}`
                                ? {
                                    backgroundColor: "#1a4d84 !important",
                                    color: "white !important",
                                  }
                                : null
                            }
                          >
                            {capitalizeFirstWord(item.name)}
                            {/* ({count[item._id]}) */}
                          </p>
                        </Link>
                      </Typography>
                    );
                  })}
                </div>
              </ul>
            </div>
          </Drawer>
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
          {loading ? null : (
            <Navbar position="fixed" open={open}>
              <Toolbar>
                <div
                  className="nav-link"
                  style={
                    user.isAdmin === false && user
                      ? { marginLeft: "200px", flexGrow: 1 }
                      : null
                  }
                >
                  <span className="mx-2">
                    <Link className="nav__name" to="/">
                      Home
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/user/dashboard">
                      Dashboard
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/myshop">
                      Myshop
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/featured">
                      Featured
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/onSale">
                      Sale
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/instock">
                      In Stock
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/outofstock">
                      Out of Stock
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/contact">
                      Contact
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/about">
                      About
                    </Link>
                  </span>
                  <span className="mx-2">
                    <Link className="nav__name" to="/dropship-policy">
                      Dropship Policy
                    </Link>
                  </span>
                </div>

                <div className="header__cart">
                  <Link to="/cart" className="header__cart-link">
                    <i className="bx bx-cart-alt header__icon"></i>
                    <span className="header__cart-count">
                      {CartItems ? CartItems?.cart?.length : 0}
                    </span>
                  </Link>
                </div>
                <div
                  className="dropdown smooth-drop text-primary"
                  style={{ cursor: "pointer", justifySelf: "flex-end" }}
                >
                  <div
                    className="dropdown-toggle ms-5"
                    id="triggerId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <AccountCircleIcon fontSize="large" />
                  </div>
                  <div
                    className="dropdown-menu loggedin"
                    aria-labelledby="triggerId"
                  >
                    <Link style={{ textDecoration: "none" }} to="/user/Profile">
                      <div className="dropdown-item">Profile</div>
                    </Link>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/user/dashboard"
                    >
                      <div className="dropdown-item">Dashboard</div>
                    </Link>
                    <div onClick={logout} className="dropdown-item">
                      Logout
                    </div>
                  </div>
                </div>
              </Toolbar>
            </Navbar>
          )}
          <Drawer
            variant="permanent"
            open={true}
            ModalProps={{ keepMounted: true }}
          >
            <div
              style={{
                backgroundColor: "transparent",
                height: "100vh",
                marginTop: "2vh",
                width: "200px",
              }}
            >
              <center style={{ fontSize: "30px" }}>
                <Link to="/" className="header__logo">
                  <img className="logo_mios" src={image} alt="logo" />
                </Link>
              </center>
              <ul>
                {/* Menu */}
                {location.pathname !== "/" &&
                  location.pathname.toLowerCase() !== "/featured" &&
                  location.pathname.toLowerCase() !== "/onsale" &&
                  location.pathname.toLowerCase() !== "/instock" &&
                  location.pathname.toLowerCase() !== "/outofstock" &&
                  location.pathname.toLowerCase() !== "/myshop" &&
                  location.pathname.toLowerCase() !== "/cart" &&
                  !location.pathname.includes("/product/") &&
                  !location.pathname.includes("/category/") &&
                  !location.pathname.includes("/search/") &&
                  arr.map((item, ind) => {
                    return (
                      <li
                        key={ind}
                        id={item.path}
                        className="AdminSideBarLink my-0 py-1"
                        style={
                          location.pathname.toLowerCase() ===
                          item.path.toLowerCase()
                            ? {
                                // backgroundColor: "#1a4d84 !important",
                                color: "white !important",
                              }
                            : null
                        }
                        onClick={Navigation}
                      >
                        &nbsp;&nbsp;{item.title}
                      </li>
                    );
                  })}
                <Divider />
                {/* Order Statuses */}
                {location.pathname !== "/" &&
                  location.pathname.toLowerCase() !== "/featured" &&
                  location.pathname.toLowerCase() !== "/onsale" &&
                  location.pathname.toLowerCase() !== "/instock" &&
                  location.pathname.toLowerCase() !== "/outofstock" &&
                  location.pathname.toLowerCase() !== "/myshop" &&
                  location.pathname.toLowerCase() !== "/cart" &&
                  !location.pathname.includes("/product/") &&
                  !location.pathname.includes("/category/") &&
                  !location.pathname.includes("/search/") && (
                    <div>
                      <h4 style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                        Orders
                      </h4>
                      {orderStatuses.map((item, ind) => {
                        // const num = numbers[item.title.toLowerCase()];
                        return (
                          <p
                            key={ind}
                            id={item.path}
                            className="AdminSidebarSubHead my-0 py-0"
                            style={
                              location.pathname.toLowerCase() ===
                              item.path.toLowerCase()
                                ? {
                                    backgroundColor: "#1a4d84",
                                    color: "white !important",
                                  }
                                : null
                            }
                            onClick={Navigation}
                          >
                            &nbsp;&nbsp;{item.title}
                          </p>
                        );
                      })}
                      <Divider />
                    </div>
                  )}
                {location.pathname !== "/" &&
                  location.pathname.toLowerCase() !== "/featured" &&
                  location.pathname.toLowerCase() !== "/onsale" &&
                  location.pathname.toLowerCase() !== "/instock" &&
                  location.pathname.toLowerCase() !== "/outofstock" &&
                  location.pathname.toLowerCase() !== "/myshop" &&
                  location.pathname.toLowerCase() !== "/cart" &&
                  !location.pathname.includes("/category/") &&
                  !location.pathname.includes("/product/") &&
                  user?.role === "dropshipper" && (
                    <div>
                      <h4 style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                        Profits
                      </h4>
                      <p className="mt-3 ps-2">
                        <Link
                          to="/user/mypaidprofits"
                          className="AdminSidebarSubHead"
                          style={
                            location.pathname.toLowerCase() ===
                            "/user/mypaidprofits"
                              ? {
                                  backgroundColor: "#1a4d84",
                                  color: "white !important",
                                }
                              : null
                          }
                        >
                          Paid Profits
                        </Link>
                      </p>
                      <p className="mt-2 ps-2">
                        <Link
                          to="/user/mypendingprofits"
                          className="AdminSidebarSubHead"
                          style={
                            location.pathname.toLowerCase() ===
                            "/user/mypendingprofits"
                              ? {
                                  backgroundColor: "#1a4d84",
                                  color: "white !important",
                                }
                              : null
                          }
                        >
                          Pending Profits
                        </Link>
                      </p>
                      <Divider />
                    </div>
                  )}

                {/* Categories */}
                <div>
                  {(location.pathname === "/" ||
                    location.pathname.toLowerCase() !== "/featured" ||
                    location.pathname.toLowerCase() !== "/onsale" ||
                    location.pathname.toLowerCase() !== "/instock" ||
                    location.pathname.toLowerCase() !== "/outofstock" ||
                    location.pathname.includes("/category/")) &&
                    !location.pathname.includes("/user/") &&
                    !location.pathname.includes("/myOrders") &&
                    !location.pathname.includes("/orders/") &&
                    !location.pathname.includes("/checkout") &&
                    !location.pathname.includes("/about") &&
                    !location.pathname.includes("/contact") &&
                    !location.pathname.includes("/dropship-policy") && (
                      <div>
                        <h6 style={{ paddingTop: "10px", paddingLeft: "6px" }}>
                          Categories
                        </h6>
                        <input
                          type="text"
                          onChange={search}
                          className="form-control"
                          placeholder="Search categories"
                        />
                        {categoryState &&
                          categoryState.map((item, ind) => {
                            return (
                              <Link key={ind} to={`/category/${item._id}`}>
                                <p
                                  className="AdminSidebarSubHead mt-0 mb-0 px-2"
                                  style={
                                    location.pathname.toLowerCase() ===
                                    `/category/${item._id}`
                                      ? {}
                                      : null
                                  }
                                >
                                  {capitalizeFirstWord(item?.name)}
                                  {/* ({count[item._id]}) */}
                                </p>
                              </Link>
                            );
                          })}
                      </div>
                    )}
                </div>
              </ul>
            </div>
          </Drawer>
        </Box>
      )}
    </>
  );
}
