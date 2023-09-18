import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import "./Customers.css"
import { ReactNotifications } from 'react-notifications-component';
import Notification from '../../Notifications/Notifications';
import UserContext from '../../context/User/UserContext';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '../../Loader/Loader';



const Requests = () => {
  const host = process.env.REACT_APP_API_URL;
  const [allUsers, setAllUser] = useState([])
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    address: "",
    phone: "",
    company: "",
  })
  const [show, setShow] = useState(true)
  const { getAndSetUsers, loading, setLoading } = useContext(UserContext);
  const { name, email, password, address, phone, company, city } = user;

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const [filterUsers, setFilterUsers] = useState([])

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchParams({ query: e.target.value });
  }

  useEffect(() => {
    if (query) {
      const newUsers = allUsers.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase());
      });
      setFilterUsers(newUsers);
    } else {
      setFilterUsers(allUsers);
    }
  }, [query, allUsers]);



  //UseEffect
  useEffect(() => {
    window.scrollTo(0, 0);
    getUsers();
  }, [])


  //Change Input
  const onChange = (e) => {
    setUser((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value
    }))
  }

  //Get All Users on Change
  const getUsers = async () => {
    setLoading(true)
    const { data } = await axios.get(`${host}/api/auth/allrequests`);
    if (allUsers.length !== data.length) {
      setAllUser(data);
    }
    setLoading(false)
  }

  //Create Account
  const signedUp = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password || !address || !phone || !company || !city) {
        window.alert('Enter Complete Details');
      } else {
        setLoading(true)
        await axios.post(`${host}/api/auth/createrequest`, { headers: { 'Content-Type': 'application/json' }, name, email, password, address, phone, company, city })
        setUser({
          name: "",
          email: "",
          password: "", city: "",
          address: "",
          phone: "",
          company: "",
        })
        await getAndSetUsers();
        setLoading(false)
        Notification("Success", "Dropshipper(Request) Account Created Successfully", "success");
      }
    } catch (e) {
      setLoading(false)
      if (e.response?.data?.errors[0]?.msg) {
        Notification("Error", e.response.data.errors[0].msg, "danger");
      } else if (e.response?.data?.error?.msg) {
        Notification("Error", e.response.data.error.msg, "danger");
      } else if (e.response?.data?.errors?.msg) {
        Notification("Error", e.response.data.errors.msg, "danger");
      } else {
        Notification("Error", e.message, "danger");
      }
    }
  }

  //Delete Account
  const deleteAccount = async (e) => {
    setLoading(true)
    await axios.delete(`${host}/api/auth/delete/${e.currentTarget.id}`);
    await getAndSetUsers();
    setLoading(false)
  }

  //Approve Account
  const approveAccount = async (e) => {
    setLoading(true)
    await axios.put(`${host}/api/auth/approve/${e.currentTarget.id}`);
    await getUsers();
    await getAndSetUsers();
    setLoading(false)
  }


  return (
    <center>
      <ReactNotifications />
      <br />
      {loading ? <Loader /> : <>
        <br />
        {show ?
          <div className='container-fluid'>
            <br />
            <div className='row mb-3'>
              <div className='col'>
                <label className='text-start mt-3'></label><input type="text" name='search' onChange={handleChange} value={query} className='form-control' placeholder='Search Customer by name' />
              </div>
              <h1 className='col'>All Dropshippers Requests({filterUsers && filterUsers.length})</h1>
              <div className="col text-end me-5">
                <button className='btn btn-info' onClick={() => setShow(!show)}>{show ? `Add New Dropshipper(Request) Account` : `Show All Dropshippers Requests`}</button>
              </div>
            </div>
            <br />
            <table className='table' width={'90%'} >
              <thead>
                <tr >
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Delete</th>
                  <th>Approve</th>
                  <th>Edit</th>
                </tr>
              </thead>
              {filterUsers && filterUsers.map((item, ind) => {
                return (
                  <tbody key={ind}>
                    <tr>
                      <td>{ind + 1}</td>
                      <td> {item.name} </td>
                      <td> {item.email} </td>
                      <td> {item.phone} </td>
                      <td> {item.city && item.city} </td>
                      <td> {item.address && item.address} </td>
                      <td> {item.role} </td>
                      <td> {item.role === "wholeseller" && item.wholesellerStatus ? 'True' : (item.role === "dropshipper" && item.dropShipperStatus ? 'true' : 'false')}</td>
                      <td><button className='btn btn-danger' id={item._id} onClick={deleteAccount}>Delete</button> </td>
                      <td><button className='btn btn-info' id={item._id} onClick={approveAccount}>Approve</button> </td>
                      <td id='Edit'><Link to={`/admin/customer/edit/${item._id}`}><button className='btn btn-info' id={item._id} >Edit</button> </Link> </td>
                    </tr>
                  </tbody>
                )
              })}

            </table>
          </div>
          :
          <section className="" style={{ marginTop: '2%' }}>
            {/* Create New Dropshipper Account */}
            <button className='btn btn-info mb-5' onClick={() => setShow(!show)}>{show ? `Add New Dropshipper(Request) Account` : `Show All Dropshippers Requests`}</button>
            <h1>Create Dropshipper(Requested) Account</h1>
            <div className="login">
              <form method='post'  >

                <label className='text-start mt-3'>name</label><input value={name} type="name" name="name" id='name' placeholder="Name" autoFocus onChange={onChange} required />
                <label className='text-start mt-3'>email</label><input value={email} type="email" name="email" id='email' placeholder="E-mail" autoFocus onChange={onChange} required />
                <label className='text-start mt-3'>password</label><input value={password} className="mb-3" type="password" name="password" id='password' placeholder="Password" onChange={onChange} required />
                <label className='text-start mt-3'>phone</label><input value={phone} type="phone" name="phone" id='phone' placeholder="Phone Number" autoFocus onChange={onChange} required /><br />
                <label className='text-start mt-3'>city</label><select name="city" className='input-group' style={{ height: "35px", fontSize: "20px" }} value={city} onChange={onChange} id="Location" required>
                  <option value="" disabled selected>Select The City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="" disabled>Punjab Cities</option>
                  <option value="Ahmed Nager Chatha">Ahmed Nager Chatha</option>
                  <option value="Ahmadpur East">Ahmadpur East</option>
                  <option value="Ali Khan Abad">Ali Khan Abad</option>
                  <option value="Alipur">Alipur</option>
                  <option value="Arifwala">Arifwala</option>
                  <option value="Attock">Attock</option>
                  <option value="Bhera">Bhera</option>
                  <option value="Bhalwal">Bhalwal</option>
                  <option value="Bahawalnagar">Bahawalnagar</option>
                  <option value="Bahawalpur">Bahawalpur</option>
                  <option value="Bhakkar">Bhakkar</option>
                  <option value="Burewala">Burewala</option>
                  <option value="Chillianwala">Chillianwala</option>
                  <option value="Chakwal">Chakwal</option>
                  <option value="Chichawatni">Chichawatni</option>
                  <option value="Chiniot">Chiniot</option>
                  <option value="Chishtian">Chishtian</option>
                  <option value="Daska">Daska</option>
                  <option value="Darya Khan">Darya Khan</option>
                  <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                  <option value="Dhaular">Dhaular</option>
                  <option value="Dina">Dina</option>
                  <option value="Dinga">Dinga</option>
                  <option value="Dipalpur">Dipalpur</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Ferozewala">Ferozewala</option>
                  <option value="Fateh Jhang">Fateh Jang</option>
                  <option value="Ghakhar Mandi">Ghakhar Mandi</option>
                  <option value="Gojra">Gojra</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Gujrat">Gujrat</option>
                  <option value="Gujar Khan">Gujar Khan</option>
                  <option value="Hafizabad">Hafizabad</option>
                  <option value="Haroonabad">Haroonabad</option>
                  <option value="Hasilpur">Hasilpur</option>
                  <option value="Haveli Lakha">Haveli Lakha</option>
                  <option value="Jatoi">Jatoi</option>
                  <option value="Jalalpur">Jalalpur</option>
                  <option value="Jattan">Jattan</option>
                  <option value="Jampur">Jampur</option>
                  <option value="Jaranwala">Jaranwala</option>
                  <option value="Jhang">Jhang</option>
                  <option value="Jhelum">Jhelum</option>
                  <option value="Kalabagh">Kalabagh</option>
                  <option value="Karor Lal Esan">Karor Lal Esan</option>
                  <option value="Kasur">Kasur</option>
                  <option value="Kamalia">Kamalia</option>
                  <option value="Kamoke">Kamoke</option>
                  <option value="Khanewal">Khanewal</option>
                  <option value="Khanpur">Khanpur</option>
                  <option value="Kharian">Kharian</option>
                  <option value="Khushab">Khushab</option>
                  <option value="Kot Addu">Kot Addu</option>
                  <option value="Jauharabad">Jauharabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Lalamusa">Lalamusa</option>
                  <option value="Layyah">Layyah</option>
                  <option value="Liaquat Pur">Liaquat Pur</option>
                  <option value="Lodhran">Lodhran</option>
                  <option value="Malakwal">Malakwal</option>
                  <option value="Mamoori">Mamoori</option>
                  <option value="Mailsi">Mailsi</option>
                  <option value="Mandi Bahauddin">Mandi Bahauddin</option>
                  <option value="Mian Channu">Mian Channu</option>
                  <option value="Mianwali">Mianwali</option>
                  <option value="Multan">Multan</option>
                  <option value="Murree">Murree</option>
                  <option value="Muridke">Muridke</option>
                  <option value="Mianwali Bangla">Mianwali Bangla</option>
                  <option value="Muzaffargarh">Muzaffargarh</option>
                  <option value="Narowal">Narowal</option>
                  <option value="Nankana Sahib">Nankana Sahib</option>
                  <option value="Okara">Okara</option>
                  <option value="Renala Khurd">Renala Khurd</option>
                  <option value="Pakpattan">Pakpattan</option>
                  <option value="Pattoki">Pattoki</option>
                  <option value="Pir Mahal">Pir Mahal</option>
                  <option value="Qaimpur">Qaimpur</option>
                  <option value="Qila Didar Singh">Qila Didar Singh</option>
                  <option value="Rabwah">Rabwah</option>
                  <option value="Raiwind">Raiwind</option>
                  <option value="Rajanpur">Rajanpur</option>
                  <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Sadiqabad">Sadiqabad</option>
                  <option value="Safdarabad">Safdarabad</option>
                  <option value="Sahiwal">Sahiwal</option>
                  <option value="Sangla Hill">Sangla Hill</option>
                  <option value="Sarai Alamgir">Sarai Alamgir</option>
                  <option value="Sargodha">Sargodha</option>
                  <option value="Shakargarh">Shakargarh</option>
                  <option value="Sheikhupura">Sheikhupura</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Sohawa">Sohawa</option>
                  <option value="Soianwala">Soianwala</option>
                  <option value="Siranwali">Siranwali</option>
                  <option value="Talagang">Talagang</option>
                  <option value="Taxila">Taxila</option>
                  <option value="Toba Tek Singh">Toba Tek Singh</option>
                  <option value="Vehari">Vehari</option>
                  <option value="Wah Cantonment">Wah Cantonment</option>
                  <option value="Wazirabad">Wazirabad</option>
                  <option value="" disabled>Sindh Cities</option>
                  <option value="Badin">Badin</option>
                  <option value="Bhirkan">Bhirkan</option>
                  <option value="Rajo Khanani">Rajo Khanani</option>
                  <option value="Chak">Chak</option>
                  <option value="Dadu">Dadu</option>
                  <option value="Digri">Digri</option>
                  <option value="Diplo">Diplo</option>
                  <option value="Dokri">Dokri</option>
                  <option value="Ghotki">Ghotki</option>
                  <option value="Haala">Haala</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Islamkot">Islamkot</option>
                  <option value="Jacobabad">Jacobabad</option>
                  <option value="Jamshoro">Jamshoro</option>
                  <option value="Jungshahi">Jungshahi</option>
                  <option value="Kandhkot">Kandhkot</option>
                  <option value="Kandiaro">Kandiaro</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Kashmore">Kashmore</option>
                  <option value="Keti Bandar">Keti Bandar</option>
                  <option value="Khairpur">Khairpur</option>
                  <option value="Kotri">Kotri</option>
                  <option value="Larkana">Larkana</option>
                  <option value="Matiari">Matiari</option>
                  <option value="Mehar">Mehar</option>
                  <option value="Mirpur Khas">Mirpur Khas</option>
                  <option value="Mithani">Mithani</option>
                  <option value="Mithi">Mithi</option>
                  <option value="Mehrabpur">Mehrabpur</option>
                  <option value="Moro">Moro</option>
                  <option value="Nagarparkar">Nagarparkar</option>
                  <option value="Naudero">Naudero</option>
                  <option value="Naushahro Feroze">Naushahro Feroze</option>
                  <option value="Naushara">Naushara</option>
                  <option value="Nawabshah">Nawabshah</option>
                  <option value="Nazimabad">Nazimabad</option>
                  <option value="Qambar">Qambar</option>
                  <option value="Qasimabad">Qasimabad</option>
                  <option value="Ranipur">Ranipur</option>
                  <option value="Ratodero">Ratodero</option>
                  <option value="Rohri">Rohri</option>
                  <option value="Sakrand">Sakrand</option>
                  <option value="Sanghar">Sanghar</option>
                  <option value="Shahbandar">Shahbandar</option>
                  <option value="Shahdadkot">Shahdadkot</option>
                  <option value="Shahdadpur">Shahdadpur</option>
                  <option value="Shahpur Chakar">Shahpur Chakar</option>
                  <option value="Shikarpaur">Shikarpaur</option>
                  <option value="Sukkur">Sukkur</option>
                  <option value="Tangwani">Tangwani</option>
                  <option value="Tando Adam Khan">Tando Adam Khan</option>
                  <option value="Tando Allahyar">Tando Allahyar</option>
                  <option value="Tando Muhammad Khan">Tando Muhammad Khan</option>
                  <option value="Thatta">Thatta</option>
                  <option value="Umerkot">Umerkot</option>
                  <option value="Warah">Warah</option>
                  <option value="" disabled>Khyber Cities</option>
                  <option value="Abbottabad">Abbottabad</option>
                  <option value="Adezai">Adezai</option>
                  <option value="Alpuri">Alpuri</option>
                  <option value="Akora Khattak">Akora Khattak</option>
                  <option value="Ayubia">Ayubia</option>
                  <option value="Banda Daud Shah">Banda Daud Shah</option>
                  <option value="Bannu">Bannu</option>
                  <option value="Batkhela">Batkhela</option>
                  <option value="Battagram">Battagram</option>
                  <option value="Birote">Birote</option>
                  <option value="Chakdara">Chakdara</option>
                  <option value="Charsadda">Charsadda</option>
                  <option value="Chitral">Chitral</option>
                  <option value="Daggar">Daggar</option>
                  <option value="Dargai">Dargai</option>
                  <option value="Darya Khan">Darya Khan</option>
                  <option value="Dera Ismail Khan">Dera Ismail Khan</option>
                  <option value="Doaba">Doaba</option>
                  <option value="Dir">Dir</option>
                  <option value="Drosh">Drosh</option>
                  <option value="Hangu">Hangu</option>
                  <option value="Haripur">Haripur</option>
                  <option value="Karak">Karak</option>
                  <option value="Kohat">Kohat</option>
                  <option value="Kulachi">Kulachi</option>
                  <option value="Lakki Marwat">Lakki Marwat</option>
                  <option value="Latamber">Latamber</option>
                  <option value="Madyan">Madyan</option>
                  <option value="Mansehra">Mansehra</option>
                  <option value="Mardan">Mardan</option>
                  <option value="Mastuj">Mastuj</option>
                  <option value="Mingora">Mingora</option>
                  <option value="Nowshera">Nowshera</option>
                  <option value="Paharpur">Paharpur</option>
                  <option value="Pabbi">Pabbi</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Saidu Sharif">Saidu Sharif</option>
                  <option value="Shorkot">Shorkot</option>
                  <option value="Shewa Adda">Shewa Adda</option>
                  <option value="Swabi">Swabi</option>
                  <option value="Swat">Swat</option>
                  <option value="Tangi">Tangi</option>
                  <option value="Tank">Tank</option>
                  <option value="Thall">Thall</option>
                  <option value="Timergara">Timergara</option>
                  <option value="Tordher">Tordher</option>
                  <option value="" disabled>Balochistan Cities</option>
                  <option value="Awaran">Awaran</option>
                  <option value="Barkhan">Barkhan</option>
                  <option value="Chagai">Chagai</option>
                  <option value="Dera Bugti">Dera Bugti</option>
                  <option value="Gwadar">Gwadar</option>
                  <option value="Harnai">Harnai</option>
                  <option value="Jafarabad">Jafarabad</option>
                  <option value="Jhal Magsi">Jhal Magsi</option>
                  <option value="Kacchi">Kacchi</option>
                  <option value="Kalat">Kalat</option>
                  <option value="Kech">Kech</option>
                  <option value="Kharan">Kharan</option>
                  <option value="Khuzdar">Khuzdar</option>
                  <option value="Killa Abdullah">Killa Abdullah</option>
                  <option value="Killa Saifullah">Killa Saifullah</option>
                  <option value="Kohlu">Kohlu</option>
                  <option value="Lasbela">Lasbela</option>
                  <option value="Lehri">Lehri</option>
                  <option value="Loralai">Loralai</option>
                  <option value="Mastung">Mastung</option>
                  <option value="Musakhel">Musakhel</option>
                  <option value="Nasirabad">Nasirabad</option>
                  <option value="Nushki">Nushki</option>
                  <option value="Panjgur">Panjgur</option>
                  <option value="Pishin Valley">Pishin Valley</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sherani">Sherani</option>
                  <option value="Sibi">Sibi</option>
                  <option value="Sohbatpur">Sohbatpur</option>
                  <option value="Washuk">Washuk</option>
                  <option value="Zhob">Zhob</option>
                  <option value="Ziarat">Ziarat</option>
                </select>
                <label className='text-start mt-3'>address</label><input value={address} type="text" name="address" id='address' placeholder="Address" autoFocus onChange={onChange} required />
                <label className='text-start mt-3'>company</label><input value={company} type="text" style={{ marginBottom: "20px" }} name="company" id='company' placeholder="Company Name" autoFocus onChange={onChange} />
                <input type="submit" value="create account" onClick={signedUp} />
              </form>
            </div>
          </section>
        }</>}
    </center >
  )
}

export default Requests