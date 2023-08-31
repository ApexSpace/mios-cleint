import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserBankUpdate = () => {
  const host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [userBank, setUserBank] = useState(null);

  const getUserBank = async () => {
    await axios
      .get(`${host}/api/bankDetails`)
      .then(res => {
        const data = res.data;
        if (data && data.length > 0) {
          setUserBank({
            bankName: data[0].bankName,
            accountHolderName: data[0].accountHolderName,
            iban: data[0].iban,
          });
        } else {
          setUserBank(null);
        }
      })
      .catch(err => {
        alert('Something Went Wrong');
      });
  };

  useEffect(() => {
    getUserBank();

    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserBank(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`${host}/api/bankDetails/update`, userBank)
      .then(res => {
        setUserBank({
            bankName: res.data.bankName,
            accountHolderName: res.data.accountHolderName,
            iban: res.data.iban,
        })
        navigate('/user/profile');
      })
      .catch(err => {
        alert('Something Went Wrong');
      });
  };

  return (
    <div className='conatiner my-5'>
      <div className='text-center'>
        <h1>Update Your Bank Details</h1>
      </div>
      {userBank !== null ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div className='form-group my-2'>
              <label htmlFor='bankName'>Bank Name</label>
              <input
                type='text'
                className='form-control'
                id='bankName'
                name='bankName'
                placeholder='Enter Bank Name'
                onChange={handleChange}
                value={userBank.bankName}
              />
            </div>
            <div className='form-group my-2'>
              <label htmlFor='accountHolderName'>Account Holder Name</label>
              <input
                type='text'
                className='form-control'
                id='accountHolderName'
                name='accountHolderName'
                placeholder='Enter Account Holder Name'
                onChange={handleChange}
                value={userBank.accountHolderName}
              />
            </div>
            <div className='form-group my-2'>
              <label htmlFor='iban'>IBAN</label>
              <input
                type='text'
                className='form-control'
                id='iban'
                placeholder='Enter IBAN'
                onChange={handleChange}
                name='iban'
                value={userBank.iban}
              />
            </div>
            <div className=''>
              <button type='submit' className='btn btn-primary my-2'>
                Update
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>Please add bank details.</div>
      )}
    </div>
  );
};

export default UserBankUpdate;
