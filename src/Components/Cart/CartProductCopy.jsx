import { useState } from 'react';
import { ProdCart } from './cartStyles';

// export const CartProduct = ({Data})=> {   
//    //useState to count number of clicks
//    //update after every click
//     const [count, setCount] = useState(1);
//    let price=0;
//    let totalPrice=0;
//    let title='';

//     const addOne = () => {
//         setCount(count + 1);
//     }
//     const minusOne = () => {
//         setCount(count - 1);
//         //if count is less than 1, set count to 1
//         if(count <= 1){
//             setCount(1);
//         }

//     }

//     let cartD = Data.cart[0]

//     const Removeitem = (id) => {
//         let newData = Data.cart.filter((el) => {
//             return el.id !== id;
//         });
//         Data.setItem("Cart", JSON.stringify(newData));
//     }
//     //use math to round totalPrice to 2 decimal places
//     // const price=cartD.product.discountedPrice ? cartD.product.discountedPrice : cartD.product.wholesalePrice;
//     // const totalPrice = Math.round(price * count * 100) / 100;
//     return (
//         <ProdCart>
//                 <>
//                  {Data.cart.map((el,index)=>{    
//                 <div className='main' style={{display:'flex', flexDirection:"column"}}>
//                 <div key={index}>
//                     <div style={{ width: '110px' }}>
//                         <img style={{ border: "1px solid pink", height: "145px", width: "110px", justifyContent: 'left', marginRight: '-1px', position: 'fixed' }} src={Data.imageurl} alt={Data.name} />
//                     </div>
//                     <div>
//                         {title=el.product.title}
//                     <p style={{ fontSize: "15px", fontWeight: "bold", lineHeight: "30px", marginLeft: '119px', marginTop: '-147px', color: 'Black', textTransform: 'uppercase', position: 'fixed' }} key={'oks'}>{title.toUpperCase()}</p>
//                     </div>
//                     <div>
//                      <p style={{ fontSize: "12px", fontWeight: "bold", marginTop: '35px', marginLeft: '124px', color: 'Black', position: 'fixed' }} key={'ok'}>{el.product.description}</p>
//                     </div>
//                 </div>
//                     <br />
//                 <div>
//                     { price=cartD.product.discountedPrice ? cartD.product.discountedPrice : cartD.product.wholesalePrice}
//                     { totalPrice = Math.round(price * count * 100) / 100}
//                     <p style={{ fontWeight: "bold", fontSize: "20px", color: 'Black', position: 'static', height: '26px' }} key={totalPrice}>Rs.{totalPrice} </p><br />
//                 </div>
//                 <div style={{
//                     border: "1px solid #000",
//                     borderStyle: "solid",
//                     width: "25px",
//                     height: "auto",
//                     cursor: 'pointer',
//                     color: 'Black',
//                     // marginTop: '-30px',
//                     marginLeft: '-106px',
//                     transform: 'rotate(90deg)',
//                     }} key={count}>

//                     <h3 style={{ marginLeft: '3px', fontsize: '10px', marginBottom: '3px' }} onClick={addOne}>+</h3><hr />
//                     <h3 style={{ marginLeft: '7px', fontSize: '15px', transform: 'rotate(-90deg)' }}>{count}</h3><hr />
//                     <h3 style={{ marginLeft: '1px', fontSize: '19px', transform: 'rotate(-270deg)' }} onClick={minusOne}>-</h3>

//                 </div>
//                 <hr style={{ color: 'Black', marginLeft: '-380px', marginRight: '-23px', border: '1.5px solid Black', marginTop: '-28px' }} />
//                     </div>
//                 })}
//                 </>

//         </ProdCart>
//   )
// }
export const CartProduct = ({ Data }) => {


    const [count, setCount] = useState(1);
    let price = 0;
    // let totalPrice = 0;
    const addOne = () => {
        setCount(count + 1);
    }
    const minusOne = () => {
        setCount(count - 1);
        //if count is less than 1, set count to 1
        if (count <= 1) {
            setCount(1);
        }

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>
            {Data.map((el, index) => {
                price = el.product.discountedPrice ? el.product.discountedPrice : el.product.wholesalePrice
                price = price * count
                return (
                    <div key={index + 1}>
                        <ProdCart>
                            <div style={{ backgroundColor: "black", position: 'inherit' }}>
                                <img src={el.product.photo?.url || "https://i.imgur.com/xdbHo4E.png"} style={{ border: "1px solid pink", height: "145px", width: "110px", maxHeight: '145px', maxWidth: '110px' }} alt={el.product.title} />
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <p style={{ fontSize: "15px", fontWeight: "bold", lineHeight: "30px" }}>{el.product.title}</p>
                                <p style={{ fontSize: "14px", fontWeight: "bold", lineHeight: "30px" }}>hello shoes</p>
                            </div>
                            <div style={{ marginLeft: '230px' }}>

                                <p style={{ fontWeight: "bold", fontSize: "20px" }}>Rs. {el.product.discountedPrice ? el.product.discountedPrice * count : el.product.wholesalePrice * count}</p>
                                <br />
                            </div>
                            <div style={{
                                border: "1px solid #000",
                                borderStyle: "solid",
                                width: "25px",
                                cursor: 'pointer',
                                color: 'Black',
                                position: 'relative',
                                marginTop: '-15px',
                                top: '55px',
                                left: '-35px',
                                marginLeft: '-156px',
                                transform: 'rotate(90deg)',
                            }} key={count}>

                                <h3 style={{ marginLeft: '3px', fontsize: '10px', marginBottom: '3px' }} onClick={addOne}>+</h3><hr />
                                <h3 style={{ marginLeft: '7px', fontSize: '15px', transform: 'rotate(-90deg)' }}>{count}</h3><hr />
                                <h3 style={{ marginLeft: '1px', fontSize: '19px', transform: 'rotate(-270deg)' }} onClick={minusOne}>-</h3>

                            </div>
                        </ProdCart>
                        <hr />
                    </div>
                )
            })}
        </div>
    )
}