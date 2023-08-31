import React from "react";
import { ShippingAddress } from "./ShippingAddress";
const Checkout = () => {
  return (
    <div style={{ display: "flex",marginTop:"100px", width:'100%' }}
    
    >
      <div>
        <ShippingAddress style={{
          width:'100%'}}
        />
        {/* <Payment style={{
          width:'100%'}}/> */}
      </div>
     
    </div>
  );
};

export  {Checkout} ;
