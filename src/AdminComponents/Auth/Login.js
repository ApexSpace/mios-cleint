import React, { useContext, useState, useEffect } from 'react'
import './Login.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import image from "../assets/images/logo_sml 1.png";
// import User from '../../context/User/User';
import UserContext from '../../context/User/UserContext';
import Notification from '../../Notifications/Notifications';
import { ReactNotifications } from 'react-notifications-component';
import Loader from '../../Loader/Loader';

const AdminLogin = ({ setUser }) => {
  const host = process.env.REACT_APP_API_URL;
  const { user, getUserDetails, loading, setLoading } = useContext(UserContext);
  const [admin, setAdmin] = useState({ email: '', password: '' })
  const { email, password } = admin;
  const Navigate = useNavigate();


  const onChange = (e) => {
    setAdmin((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value
    }))
  }


  useEffect(() => {
    if (user._id && user.isAdmin === true) {
      setUser(user);
      Navigate('/admin/Dashboard');
    }
  }, [user])// eslint-disable-line react-hooks/exhaustive-deps



  const login = async (e) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line
      setLoading(true)
      await axios.post(`${host}/api/auth/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        email, password
      });
      await getUserDetails();
      setLoading(false)
    } catch (e) {
      setAdmin({ email, password })
      setLoading(false)
      if (e.response?.data?.errors[0]?.msg) {
        Notification("Error", e.response.data.errors[0].msg, "danger");
      } else if (e.response?.data?.errors?.msg) {
        Notification("Error", e.response.data.errors.msg, "danger");
      } else {
        Notification("Error", e.message, "danger");
      }
    }
  };


  return (
    <><ReactNotifications />
      <section className="area-login">
        <div className="login">
          <div>
            <img className='logo_mios' src={image} alt='logo' />
          </div>
          {loading ? <Loader /> :
            <form method='post' autoComplete="off">
              <input type="email" name="email" id='email' placeholder="E-mail" autoFocus onChange={onChange} required />
              <input className="mb-3" type="password" name="password" id='password' placeholder="Password" onChange={onChange} required />
              <input type="submit" value="Login" onClick={login} />
            </form>}
        </div>
      </section>

    </>
  )
}

export default AdminLogin;