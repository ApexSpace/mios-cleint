import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../context/User/UserContext';
import axios from 'axios';



const RequestedDS = ({ setUser }) => {
    const host = process.env.REACT_APP_API_URL;
    const { user, getUserDetails } = useContext(UserContext)




    const Navigate = useNavigate();
    const logout = async () => {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await axios.get(`${host}/api/auth/logout`, { withCredentials: true });
        await getUserDetails();
        setUser(user);
        Navigate('/login');
        window.location.reload();
    }


    return (
        <>
            <h1 className='header'>Currently, Your Request for a Dropshipper Account is under Process. You can Login After Your request is Entertained by our Team.</h1>
            <button className='btn btn-info' onClick={logout}>LOGOUT</button>
        </>
    )
}

export default RequestedDS