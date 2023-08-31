import { React, useContext, } from 'react'
import { Link, } from 'react-router-dom'
import ProductContext from '../../context/Product/ProductContext';
import UserContext from '../../context/User/UserContext';
import axios from 'axios';
import Loader from '../../Loader/Loader';

const Sidebar = () => {
    const host = process.env.REACT_APP_API_URL;
    // const Navigate = useNavigate();
    const { categories, CartItems } = useContext(ProductContext);
    const { user, loading, setLoading } = useContext(UserContext);




    const logout = async () => {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await axios.get(`${host}/api/auth/logout`, {
            withCredentials: true
        });
        window.location.reload();
    }

    return (
        <>
            {loading ? <Loader /> : <>
                <header className="header">
                    <div className="header__container">
                        <Link to="/" className="header__logo">MIOS</Link>
                        <div className='nav-link'>
                            <span className='mx-2'>
                                <Link className='nav__name' to='/featured'>Featured</Link>
                            </span>
                            <span className='mx-2'>
                                <Link className='nav__name' to='/sale'>Sale</Link>
                            </span>
                            <span className='mx-2'>
                                <Link className='nav__name' to='/in-stock'>In Stock</Link>
                            </span>
                            <span className='mx-2'>
                                <Link className='nav__name' to='/out-of-stock'>Out of Stock</Link>
                            </span>
                        </div>
                        <div className='signup-btn'>
                            {user._id && <Link to='/login' onClick={logout} className='btn btn-primary'>Logout</Link>}
                            {!user._id && <Link to='/login' className='btn btn-primary'>Login</Link>}
                        </div>
                        <div className='d-flex'>
                            {/* <div className="header__search">
                    <input type="search" placeholder="Search" className="header__input"/>
                    <i className='bx bx-search header__icon'></i>
                </div> */}
                            <div className="header__cart">
                                <Link to='/cart' className='header__cart-link'>
                                    <i className='bx bx-cart-alt header__icon'></i>
                                    <span className='header__cart-count'>{CartItems ? CartItems?.cart?.length : 0}</span>
                                </Link>
                            </div>

                            <div className="dropdown text-primary" style={{ cursor: "pointer" }}>
                                <div className="dropdown-toggle ms-5" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    <i className='bx bx-user-circle'></i>
                                </div>
                                <div className="dropdown-menu" aria-labelledby="triggerId">
                                    <Link to="/UserProfile"><div className="dropdown-item" href="#">Profile</div></Link>
                                    <Link to="/Dashboard"><div className="dropdown-item" href="#">Dashboard</div></Link>
                                </div>
                            </div>


                        </div>

                        <div className="header__toggle">
                            <i className='bx bx-menu' id="header-toggle"></i>
                        </div>
                    </div>
                </header>
                <div className="nav" id="navbar">
                    <nav className="nav__container">
                        <div>
                            <Link to="/" className="nav__link nav__logo">
                                <i className='bx bxs-disc nav__icon' ></i>
                                <span className="nav__logo-name">MIOS</span>
                            </Link>

                            <div className="nav__list">
                                <div className="nav__items">
                                    <Link to="/Dashboard" className="nav__link active"><h3 className='nav__name'>Dashboard</h3></Link>
                                    <h3 className="nav__subtitle">Categories</h3>

                                    <Link to="/" className="nav__link active">
                                        {/* <i className='bx bx-home nav__icon' ></i> */}
                                        <span className="nav__name">All Categories</span>
                                    </Link>
                                    {categories.map(category => (
                                        <Link to={`/categories/${category._id}
                            `} className="nav__link" key={category._id}>
                                            <span className="nav__name">{category.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </nav>
                </div>
            </>}
        </>
    )
}

export default Sidebar