import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserBank = () => {
    const host = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [userBank, setUserBank] = useState({
        bankName: '',
        accountHolderName: '',
        iban: '',
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setUserBank({ ...userBank, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(`${host}/api/bankDetails/add`, userBank)
            .then(res => {
                alert('Bank Details Added Successfully')
                navigate('/user/profile')
            })
            .catch(err => {
                alert(err)
            })
    }

    return (
        <div className='conatiner my-5'>
            <div className='text-center'>
                <h1>Add Your Bank Deatis</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='form-group my-2'>
                        <label htmlFor='bankName'>Bank Name</label>
                        <input type='text' className='form-control' id='bankName' name='bankName' placeholder='Enter Bank Name' onChange={handleChange} />

                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor='accountHolderName'>Account Holder Name</label>
                        <input type='text' className='form-control' id='accountHolderName' name='accountHolderName' placeholder='Enter Account Holder Name' onChange={handleChange} />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor='iban'>IBAN</label>
                        <input type='text' className='form-control' id='iban' placeholder='Enter IBAN' onChange={handleChange} name='iban' />
                    </div>
                    <div className=''>
                        <button type='submit' className='btn btn-primary my-2'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserBank