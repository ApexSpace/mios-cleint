import React, { useState, useEffect } from 'react'
import ReactQuill from "react-quill";
import axios from "axios";

const ContactPage = () => {
    const host = process.env.REACT_APP_API_URL
    const [quillValue, setQuillValue] = useState("");

    const getContactPage = async () => {
        await axios.get(`${host}/page/contact`).then((res) => {
            setQuillValue(res.data[0].content)
        }).catch((err) => {
            // console.log(err);
        })
    }

    useEffect(() => {
        getContactPage();

        // eslint-disable-next-line
    }, [])

    const handleSave = () => {
        const data = {
            page: "contact",
            content: quillValue
        }
        axios.put(`${host}/page/contact`, data).then((res) => {
            setQuillValue(res.data.content)
        }).catch((err) => {
            // console.log(err);
        })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3 card p-5">
                        <div className='d-flex justify-content-between mb-3'>
                            <span className="form-label">
                                Contact Page Content
                            </span>
                            <button className='btn btn-primary' onClick={handleSave}>
                                Save
                            </button>
                        </div>

                        <ReactQuill
                            theme="snow"
                            value={quillValue}
                            onChange={setQuillValue}
                            placeholder={"Description here..."}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ContactPage
