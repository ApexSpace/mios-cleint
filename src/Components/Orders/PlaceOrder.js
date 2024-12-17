import axios from "axios";
import "./Order.css";
import React, { useContext, useEffect, useState } from "react";
import { ReactNotifications } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import OrderContext from "../../context/Order/OrderContext";
import ProductContext from "../../context/Product/ProductContext";
import UserContext from "../../context/User/UserContext";
import Loader from "../../Loader/Loader";
import Notification from "../../Notifications/Notifications";

const PlaceOrder = () => {
  const host = process.env.REACT_APP_API_URL;

  const { CartItems, subTotal, Cart, shippCat } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const { getMyOrders } = useContext(OrderContext);
  let [loading, setLoading] = useState(false);
  let [shipping, setShipping] = useState(0);
  let [diff, setdiff] = useState(false);
  let [img, setImg] = useState("");
  let [weight, setWeight] = useState(0);
  let [total, setTotal] = useState(0);
  let [productTotal, setProductTotal] = useState(0);

  const Navigate = useNavigate();

  useEffect(() => {
    if (!(CartItems?.cart?.length >= 1) || !subTotal) {
      Navigate("/Cart");
    }
    console.log("city", city);

    if (
      user.isAdmin === false &&
      user.role === "dropshipper" &&
      user.dropShipperStatus === true
    ) {
      setTotal(subTotal);
      calcProductTotal();
    }

    let w = 0;
    CartItems?.cart?.forEach((item) => {
      w += item.product.weight * item.quantity;
    });
    setWeight(w);
  }, [CartItems?.cart, subTotal, Navigate]);

  const billingDetails = {
    address: user && user.address,
    name: user && user.name,
    email: user && user.email,
    phone: user && user.phone,
    city: user && user.city,
  };

  const calcProductTotal = async () => {
    let tot = 0;

    let cart = CartItems.cart;
    await cart.forEach((index) => {
      tot += index.product.wholesalePrice * index.quantity;
    });
    setProductTotal(tot);
  };

  let [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (img) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setorderDetails((prevValue) => ({
          ...prevValue,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(img);
    }
  }, [img]);

  const handleImage = (e) => {
    setImg(e.target.files[0]);
  };

  let [orderDetails, setorderDetails] = useState({
    billingDetails,
    shippingDetails,
    products: CartItems && CartItems?.cart,
    paymentOption: "",
    photo: "",
    transactionId: "",
  });

  const { paymentOption, transactionId, photo, products } = orderDetails;
  const { name, phone, email, address, city } = shippingDetails;

  const choosePayment = (e) => {
    setorderDetails((prevValue) => ({
      ...prevValue,
      shippingDetails,
      [e.target.name]: e.target.value,
    }));
    if (e.target.value === "COD") {
      setorderDetails((prevValue) => ({
        ...prevValue,
        shippingDetails,
        photo: "",
        transactionId: "",
      }));
    }
  };

  const calculateShippingcost = (city) => {
    if (
      user.isAdmin === false &&
      user.role === "dropshipper" &&
      user.dropShipperStatus === true
    ) {
      setTotal(subTotal);
      if (parseFloat(weight / 1) <= 0.5) {
        const data = shippCat.find((item) => item.weight === "half");
        if (city === "Lahore") {
          setShipping(data.incity);
          // setTotal(subTotal + data.incity);
        } else {
          setShipping(data.outcity);
          // setTotal(subTotal + data.outcity);
        }
      } else if (parseFloat(weight / 1) == 1.0) {
        const data = shippCat.find((item) => item.weight === "one");
        if (city === "Lahore") {
          setShipping(data.incity);
          setTotal(subTotal + data.incity);
        } else {
          setShipping(data.outcity);
          // setTotal(subTotal + data.outcity);
        }
      } else if (parseFloat(weight / 1) > 1.0) {
        const Priceforone = shippCat.find((item) => item.weight === "one");
        const additionalPrice = shippCat.find(
          (item) => item.weight === "greater"
        );
        if (city === "Lahore") {
          const additionalWeight = Math.ceil(weight) - 1;
          const additionalPriceforWeight =
            additionalWeight * additionalPrice.incity;
          const shppingTotal = Priceforone.incity + additionalPriceforWeight;
          setShipping(shppingTotal);
          // setTotal(subTotal + shppingTotal);
        } else {
          const additionalWeight = Math.ceil(weight) - 1;
          const additionalPriceforWeight =
            additionalWeight * additionalPrice.outcity;
          const shppingTotal = Priceforone.outcity + additionalPriceforWeight;
          setShipping(shppingTotal);
          // setTotal(subTotal + shppingTotal);
        }
      }
    } else {
      if (parseFloat(weight / 1) <= 0.5) {
        const data = shippCat.find((item) => item.weight === "half");
        if (city === "Lahore") {
          setShipping(data.incity);
          setTotal(subTotal + data.incity);
        } else {
          setShipping(data.outcity);
          setTotal(subTotal + data.outcity);
        }
      } else if (parseFloat(weight / 1) == 1.0) {
        const data = shippCat.find((item) => item.weight === "one");
        if (city === "Lahore") {
          setShipping(data.incity);
          setTotal(subTotal + data.incity);
        } else {
          setShipping(data.outcity);
          setTotal(subTotal + data.outcity);
        }
      } else if (parseFloat(weight / 1) > 1.0) {
        const Priceforone = shippCat.find((item) => item.weight === "one");
        const additionalPrice = shippCat.find(
          (item) => item.weight === "greater"
        );
        if (city === "Lahore") {
          const additionalWeight = Math.ceil(weight) - 1;
          const additionalPriceforWeight =
            additionalWeight * additionalPrice.incity;
          const shppingTotal = Priceforone.incity + additionalPriceforWeight;
          setShipping(shppingTotal);
          setTotal(subTotal + shppingTotal);
        } else {
          const additionalWeight = Math.ceil(weight) - 1;
          const additionalPriceforWeight =
            additionalWeight * additionalPrice.outcity;
          const shppingTotal = Priceforone.outcity + additionalPriceforWeight;
          setShipping(shppingTotal);
          setTotal(subTotal + shppingTotal);
        }
      }
    }
  };

  const changeShippingDetails = (e) => {
    setShippingDetails((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "city") {
      calculateShippingcost(e.target.value);
    }
  };

  const differentShipping = (e) => {
    if (diff) {
      setShippingDetails((prevVal) => ({
        ...prevVal,
        ...emptyDetails,
      }));
    } else if (!diff) {
      setShippingDetails((prevVal) => ({
        ...prevVal,
        ...billingDetails,
      }));

      calculateShippingcost(user && user.city);
    }
    setdiff(!diff);
  };

  const placeOrder = async () => {
    setorderDetails((prevVal) => ({
      ...prevVal,
      shippingDetails,
    }));
    console.log(city);
    if (!products) {
      Notification("Error", "Cart is Empty.", "danger");
    } else if (
      !name ||
      !city ||
      !address ||
      !phone ||
      !paymentOption ||
      !total ||
      !shipping ||
      (paymentOption === "Receipt" && (!transactionId || !photo))
    ) {
      Notification(
        "Error",
        `Enter your ${!name ? "name," : ""}${!city ? " city," : ""}${
          !address ? " address," : ""
        }${!phone ? " phone," : ""}${!paymentOption ? "Payment Option," : ""}${
          paymentOption === "Receipt" && !photo ? " receipt" : ""
        }${
          paymentOption === "Receipt" && !transactionId ? " Transaction Id" : ""
        }   `,
        "danger"
      );
    } else if (
      total - shipping < productTotal &&
      user.isAdmin === false &&
      user.role === "dropshipper" &&
      user.dropShipperStatus === true
    ) {
      Notification(
        "Error",
        "To proceed, the dropship price plus shipping charges must exceed the product price. Please adjust your dropship price accordingly!",
        "danger"
      );
    } else {
      if (phone.length <= 10) {
        Notification(
          "Error",
          "Phone Number Should be at least 11 digits long.",
          "danger"
        );
      } else {
        let orderType = "";
        orderType =
          user.role === "dropshipper"
            ? (orderType = "Dropship")
            : (orderType = "Wholesale");
        const orderValues = { ...orderDetails, total, shipping, orderType };

        try {
          setLoading(true);
          await axios.post(`${host}/api/order/placeOrder`, orderValues);
          setLoading(false);
          Notification("Success", "Ordered Successfully", "success");
          setShippingDetails((prevVal) => ({
            ...emptyDetails,
          }));
          await Cart();
          setorderDetails({
            products: CartItems && CartItems?.cart,
            paymentOption: "",
            photo: "",
            transactionId: "",
          });
          await getMyOrders();
          Navigate("/myOrders");
        } catch (e) {
          setLoading(false);
          if (e.response?.data?.message) {
            Notification("Error", e.response.data.message, "danger");
          } else if (e.response?.data) {
            Notification("Error", e.response.data, "danger");
          } else if (e.response?.data?.errors[0]?.message) {
            Notification("Error", e.response.data.errors[0].message, "danger");
          } else if (e.response?.data?.errors?.message) {
            Notification("Error", e.response.data.errors.message, "danger");
          } else {
            Notification("Error", e.message, "danger");
          }
        }
      }
    }
  };

  const emptyDetails = {
    address: "",
    name: "",
    city: "",
    email: "",
    phone: "",
  };

  return (
    <>
      <ReactNotifications />
      {loading ? (
        <Loader />
      ) : (
        <div className="checkout-main">
          <div className="checkout-details">
            <div className="checkout-left">
              <div className="shipping-form">
                <center>
                  <h3>Checkout</h3>
                  <br />
                </center>
                <div className="ship-form">
                  <form className="formtag">
                    <h5 className="checkout-heading">Shipping Details</h5>

                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      onChange={changeShippingDetails}
                      name="name"
                      value={name}
                      className="form-control"
                      placeholder="Enter name."
                      autoComplete="off"
                    />

                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      onChange={changeShippingDetails}
                      name="phone"
                      value={phone}
                      className="form-control"
                      placeholder="Enter phone."
                      autoComplete="off"
                    />

                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      onChange={changeShippingDetails}
                      name="email"
                      value={email}
                      className="form-control"
                      placeholder="Enter email."
                      autoComplete="off"
                      required="false"
                    />

                    <label className="form-label">Address</label>
                    <input
                      onChange={changeShippingDetails}
                      type="text"
                      name="address"
                      value={address}
                      className="form-control"
                      placeholder="Enter address."
                      autoComplete="off"
                    />

                    <label className="form-label">City</label>
                    <select
                      name="city"
                      style={{ height: "35px", fontSize: "20px" }}
                      className="input-group"
                      onChange={changeShippingDetails}
                      value={city}
                      id="Location"
                      required
                    >
                      <option value="" disabled selected>
                        Select The City
                      </option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="" disabled>
                        Punjab Cities
                      </option>
                      <option value="Ahmed Nager Chatha">
                        Ahmed Nager Chatha
                      </option>
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
                      <option value="" disabled>
                        Sindh Cities
                      </option>
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
                      <option value="Tando Muhammad Khan">
                        Tando Muhammad Khan
                      </option>
                      <option value="Thatta">Thatta</option>
                      <option value="Umerkot">Umerkot</option>
                      <option value="Warah">Warah</option>
                      <option value="" disabled>
                        Khyber Cities
                      </option>
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
                      <option value="" disabled>
                        Balochistan Cities
                      </option>
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
                    <br />
                  </form>
                </div>
                <div className="payment-method">
                  <h5 className="checkout-heading">Payment Methods</h5>

                  <div className="method-1">
                    <label className="pay-method">
                      <input
                        className="payment-method-input "
                        type="radio"
                        checked={paymentOption === "COD"}
                        onChange={choosePayment}
                        name="paymentOption"
                        value="COD"
                      />
                      <div className="payment-method-label">
                        Cash on Delivery (COD)
                      </div>
                    </label>
                  </div>
                  <div className="method-2">
                    <label className="pay-method">
                      <input
                        className="payment-method-input "
                        type="radio"
                        checked={paymentOption === "Receipt"}
                        onChange={choosePayment}
                        name="paymentOption"
                        value="Receipt"
                      />
                      <div className="payment-method-label">Bank Deposit</div>
                    </label>

                    {paymentOption === "Receipt" && (
                      <div className="bank-receipt-details">
                        <div className="bank-details">
                          <div>Faysal bank</div> <div>Ahtsham Aslam</div>
                          <div>Account no. 0334007000002523</div>
                          <div>IBAN No. PK98FAYS0334007000002523</div>
                        </div>
                        <div className="bank-receipt">
                          <label className="form-label">Transaction Id</label>
                          <input
                            onChange={choosePayment}
                            type="text"
                            value={transactionId}
                            name="transactionId"
                            className="form-control"
                            placeholder="Enter Your Transaction ID."
                          />
                          <label className="form-label">
                            Transaction Receipt
                          </label>

                          <input
                            type="file"
                            name="photo"
                            onChange={handleImage}
                            accept="image/*"
                            className="form-control"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="place-order">
                  <div className="">
                    <button
                      onClick={placeOrder}
                      type="submit"
                      className="place-order-btn"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-details">
              <div className="product-details">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Product Name</th>
                      {/* <th scope="col">Price</th>
                      <th scope="col">Qty</th> */}
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CartItems?.cart.map((i, ind) => {
                      return (
                        <tr key={ind}>
                          <td>
                            <img
                              src={i?.product?.photo?.url}
                              width="60px"
                              alt="Product image"
                            />
                          </td>
                          <td>
                            {i.product.title.length > 20
                              ? i.product.title.substring(0, 20) + "..."
                              : i.product.title}
                            <div>Qty: {i.quantity}</div>
                            <div>
                              Price: Rs.
                              {user.isAdmin === false &&
                              user.role === "dropshipper" &&
                              user.dropShipperStatus === true ? (
                                <span className="product-price">
                                  <span>
                                    {i.product.onSale &&
                                    i.product.dropshipperPrice
                                      ? i.product.dropshipperPrice
                                      : i.product.dropshipperPrice}
                                  </span>
                                </span>
                              ) : null}
                              {user.isAdmin === false &&
                              user.role === "wholeseller" ? (
                                <span className="product-price">
                                  <span>
                                    {i.product.onSale &&
                                    i.product.discountedPriceW
                                      ? i.product.discountedPriceW
                                      : i.product.wholesalePrice}{" "}
                                  </span>
                                </span>
                              ) : null}
                            </div>
                          </td>
                          {/* <td>
                            Rs.
                            {user.isAdmin === false &&
                            user.role === "dropshipper" &&
                            user.dropShipperStatus === true ? (
                              <span className="product-price">
                                <span>
                                  {i.product.onSale &&
                                  i.product.dropshipperPrice
                                    ? i.product.dropshipperPrice
                                    : i.product.dropshipperPrice}
                                </span>
                              </span>
                            ) : null}
                            {user.isAdmin === false &&
                            user.role === "wholeseller" ? (
                              <span className="product-price">
                                <span>
                                  {i.product.onSale &&
                                  i.product.discountedPriceW
                                    ? i.product.discountedPriceW
                                    : i.product.wholesalePrice}{" "}
                                </span>
                              </span>
                            ) : null}
                          </td>
                          <td>{i.quantity}</td> */}
                          <td>
                            Rs.
                            {user.isAdmin === false &&
                            user.role === "dropshipper" &&
                            user.dropShipperStatus === true ? (
                              <span className="product-price">
                                <span>
                                  {i.product.onSale &&
                                  i.product.dropshipperPrice
                                    ? i.product.dropshipperPrice * i.quantity
                                    : i.product.dropshipperPrice *
                                      i.quantity}{" "}
                                </span>
                              </span>
                            ) : null}
                            {user.isAdmin === false &&
                            user.role === "wholeseller" ? (
                              <span className="product-price">
                                <span>
                                  {i.product.onSale &&
                                  i.product.discountedPriceW
                                    ? i.product.discountedPriceW * i.quantity
                                    : i.product.wholesalePrice *
                                      i.quantity}{" "}
                                </span>
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                    {user.isAdmin === false &&
                    user.role === "dropshipper" &&
                    user.dropShipperStatus === true ? null : (
                      <tr className="product-price">
                        <td colspan="2">Subtotal</td>
                        <td>Rs.{subTotal}</td>
                      </tr>
                    )}
                    {city ? (
                      <tr className="product-price">
                        <td colspan="2">Shipping</td>
                        <td>Rs.{shipping}</td>
                      </tr>
                    ) : (
                      <tr className="product-price">
                        <td colspan="2">Shipping</td>
                        <td>Select city</td>
                      </tr>
                    )}
                    {user.isAdmin === false &&
                    user.role === "dropshipper" &&
                    user.dropShipperStatus === true ? (
                      <tr className="product-price">
                        <td colspan="2">Total</td>
                        <td>Rs.{subTotal}</td>
                      </tr>
                    ) : city ? (
                      <tr className="product-price">
                        <td colspan="2">Total</td>
                        <td>Rs.{total}</td>
                      </tr>
                    ) : (
                      <tr className="product-price">
                        <td colspan="2">Total</td>
                        <td>Select city</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="place-order-mb">
                <div className="">
                  <button
                    onClick={placeOrder}
                    type="submit"
                    className="place-order-btn"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;
