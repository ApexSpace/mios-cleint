import React, { Component, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import image from "../assets/images/logo_sml 1.png";
import Notification from "../../Notifications/Notifications";
import { ReactNotifications } from "react-notifications-component";
import Loader from "../../Loader/Loader";

function Login() {
  const host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login(email, password);
  };
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${host}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (response?.data?.authtoken) {
        setUser(response.data.authtoken);
      }
      navigate("/");
      setLoading(false);
    } catch (e) {
      setEmail(email);
      setPassword(password);
      setLoading(false);
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
    <>
      <ReactNotifications />
      {loading ? (
        <Loader />
      ) : (
        <section className="area-login">
          {/* {user ? <Navigate to="/productMain" replace={true} /> : null} */}

          <div className="login">
            <div>
              <img className="logo_mios" src={image} alt="logo" />
            </div>

            <form method="post" onSubmit={() => onSubmit()} autoComplete="off">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                autoFocus
                onChange={onChangeEmail}
                required
                autoComplete="off"
              />
              <input
                className="mb-3"
                type="password"
                name="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={onChangePassword}
                required
                autoComplete="off"
              />
              <br /> <input type="submit" value="Login" />
              <span>
                <center>
                  <br />
                  Don't Have an Account? <Link to="/signup">SIGN UP</Link>
                </center>
              </span>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Login;

// export class Login extends Component {
//   constructor() {
//     super();
//     this.state = {
//       loading: false,
//       email: "",
//       password: "",
//       errors: {},
//       user: "",
//     };
//   }
// }
