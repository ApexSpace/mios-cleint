import { Component } from 'react';
import './checkoutExtra.css';
import styles from './sop_address.module.css';
// import { v4 as uuidv4 } from 'uuid';
export class ShippingAddress extends Component {
    constructor() {
      super();
  
      this.state = {
        name: '',
        email: '',
        phoneNo: '',
        address: '',
        city: '',
        zipCode: '',
      
      };
      this.onChange = this.onChange.bind(this);
    }

    host = process.env.REACT_APP_API_URL;
onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            name,
            city,
            address,
            email,
            phoneNo,
            zipCode,
            
        } = this.state;
        const shippingdetails = {
    
            "name":name,
            "city":city,
            "address":address,
            "email":email,
            "phoneNo":phoneNo,
            "zipCode":zipCode,
        };
        this.setState({ loading: true });
        const response = await fetch(`${this.host}/api/shipping/addshipping`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NjY1OTllNmYxZGIwNWQ4NzVjZDM3In0sImlhdCI6MTY1MTkyNjQyNn0.4sT98Nu8Q5ad87buKzYarR8KzpPyeL_9RWf8q7JdjQk",

          },
          body: JSON.stringify(shippingdetails),
        });

        const body = await response.json();
        this.setState({ added : body.msg, loading: false });
        alert("Order Placed Successfully");
      };


      async componentDidMount() {
        let url = `${this.host}/api/shipping/addshipping`;
        this.setState({ loading: true });
        let data = await fetch(url);
        data = await data.json();
        this.setState({ loading: false, categories: data });
      }
  render() {
    return (
    <>
    <div className={styles.mainCont}> 
        <h2>1. Shipping Address</h2>
        <div className='address_cont'>
            <h2>New Shipping Address</h2>
            <hr/>
            <form className='address_form' >
                <div>
                    <label>Country</label>
                    <input id='country' className={styles.inputFied} name='country'  onChange={this.onChange} placeholder='Country' required />
                </div>
                
            <div >
                <label>Full Name</label>
                <input id='name' className={styles.inputFied} name='name'  onChange={this.onChange} placeholder='First and last name' required />
            </div>
               
            <div>
                <label >Address</label>
                <input id='address' className={styles.inputFied} name='address'  onChange={this.onChange} placeholder='Address' required />
            </div>    
                <div style={{display : "flex"}} >
                    <div>
                        <label style={{display : "block"}} >City</label>
                        <input id='city' name='city' className={styles.smallInput}  onChange={this.onChange} placeholder='Lahore' required/>
                    </div>    
                <div>
                    <label style={{display : "block"}} >email</label>
                    <input id='email' name='email' className={styles.smallInput}  onChange={this.onChange} type="email" placeholder='abc@gmail.com' required/>
                </div>
                <div>
                    <label style={{display : "block"}} >zipCode</label>
                    <input id='zipCode' name='zipCode' className={styles.smallInput}  onChange={this.onChange} type="number" placeholder='12345' required/>
                </div>

                </div>
                <div>
                    <label>Phone Number</label>
                    <input id='phoneNo' className={styles.inputFied} name='phoneNo' onChange={this.onChange} type="number" placeholder="Including area code" required/>
                </div>
                 
            <div>
                <input type="submit" className="saveAddressBtn"   onClick={this.handleSubmit} value="SHIP TO THIS ADDRESS"/>
            </div>
                
            </form>
            

        </div>
        
    </div>
    </>
  )
}
}

export default ShippingAddress 