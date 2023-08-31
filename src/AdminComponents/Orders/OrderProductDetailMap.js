import React, { useState } from 'react'
import axios from 'axios'

const OrderProductDetailMap = ({ product, orderID, otherdata }) => {
    const host = process.env.REACT_APP_API_URL;
    const el = product;
    const orderProduct = otherdata
    const [dropshipPrice, setDropshipPrice] = useState(el.product.dropshipperPrice)
    const [dropPriceButton, setDropPriceButton] = useState(true)
    const [forupdateDropshipPrice, setForupdateDropshipPrice] = useState(el.product.dropshipperPrice)
    const mimimumDropshipPrice = (el.product.discountedPriceW > 0 ? el.product.discountedPriceW : el.product.wholesalePrice)

    const handleDropshipPriceChange = (e) => {
        const newPrice = parseInt(e.target.value);
        setDropshipPrice(newPrice);
        setDropPriceButton(false);
    }

    const updateDropshipPrice = (id, price) => {
        axios.put(`${host}/api/order/dropshippriceupdateadmin/${orderID}`, { productID: id, dropshipperPrice: price })
            .then(res => {
                setForupdateDropshipPrice(res.data)
            })
            .catch(err => {

            })
    }


    const handleDropshipPriceUpdate = (id, price) => {
        if (dropshipPrice > mimimumDropshipPrice) {
            updateDropshipPrice(id, price);
            setDropPriceButton(true)
        } else {
            alert("Dropship price must be greater than wholesale price")
        }
    }



    return (

        <tr key={el.product._id}>
            <td className="table-product-images">
                <img src={el.product.photo.url} alt={el.product.title} />
            </td>
            <td width='40%'>
                {el.product.title}
            </td>
            <td className='text-center'>
                {
                    el.product.discountedPriceW > 0 ? el.product.discountedPriceW : el.product.wholesalePrice
                }
            </td>
            {
                orderProduct?.user?.role == "dropshipper" &&
                <td scope="col" className='text-center'>
                    <div className="d-flex justify-content-between">

                        <input
                            style={{
                                border: "1px solid lightgrey",
                                width: "80px",
                                background: "white",
                            }}
                            value={dropshipPrice}
                            type="number"
                            onChange={handleDropshipPriceChange}
                            name="dropshipPrice"
                            min={mimimumDropshipPrice}
                        />
                        <div>
                            <button
                                disabled={dropPriceButton}
                                style={{ border: "1px solid lightgrey" }}
                                onClick={() => handleDropshipPriceUpdate(el.product._id, dropshipPrice)}
                            >
                                ✓
                            </button>
                        </div>
                    </div>
                </td>
            }
            <td className='text-center' width="90px">
                {el.quantity}
            </td>
            <td className='text-center'>
                {orderProduct.orderType === "Wholesale" ? (el.product.discountedPriceW > 0 ? el.product.discountedPriceW * el.quantity : el.product.wholesalePrice * el.quantity)
                    : (forupdateDropshipPrice * el.quantity)
                }
            </td>
        </tr>
    );
}

export default OrderProductDetailMap