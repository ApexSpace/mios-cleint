import React, { useState, useEffect } from 'react'
import axios from "axios";

const About = () => {
    const host = process.env.REACT_APP_API_URL;
    const [pageContent, setPageContent] = useState("")

    const getAboutPage = async () => {
        await axios.get(`${host}/page/about`).then((res) => {
            setPageContent(res.data[0].content)
        }).catch((err) => {
            console.log(err);
        })
    };

    useEffect(() => {
        getAboutPage();

        // eslint-disable-next-line
    }, []);

    return (
        <div className='container-fluid my-3'>
            <div className='row'>
                <div className='col-md-12'>
                    <h3 className='text-center mb-2'>About Us</h3>
                    <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
                </div>
            </div>
        </div>
    )
}

export default About
