import React, { useEffect, useState } from 'react'
// 
import '../STYLESHEETS/Services.css'
// 
import logo from '../PHOTOS/stock.png'
import img1 from '../PHOTOS/MAIN/barber11.jpg'
import img2 from '../PHOTOS/MAIN/barber24.jpg'
import img3 from '../PHOTOS/MAIN/barber3.jpg'
import img4 from '../PHOTOS/MAIN/barber5.jpg'
import img5 from '../PHOTOS/MAIN/barber27.jpeg'
import img6 from '../PHOTOS/MAIN/barber16.jpg'
import img7 from '../PHOTOS/MAIN/barber12.jpg'
import img8 from '../PHOTOS/MAIN/barber19.jpg'
import img9 from '../PHOTOS/MAIN/barber25.jpg'
import img10 from '../PHOTOS/MAIN/barber8.jpg'

import Navigation from './UTILITIES/Navigation'
import { RxHamburgerMenu } from 'react-icons/rx'
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs'
import Footer from './UTILITIES/Footer'
import { Link } from 'react-router-dom'
import { firebaseGetPageViews } from '../FIREBASE/firebase'
// 

export default function Services() {

    const [serviceID, setServiceID] = useState(-1)
    const services = [
        {
            id: 0,
            Name: "Haircuts", Img: img1,
            Desc: "Professional cutting and styling of hair, often with the use of scissors and clippers.",
            Details: ""
        },
        {
            id: 1,
            Name: "Beard trims", Img: img2,
            Desc: "Shaping, grooming, and maintaining facial hair to achieve a neat and polished look.",
            Details: ""
        },
        {
            id: 2,
            Name: "Hot towel shaves", Img: img3,
            Desc: "A classic grooming service that involves the use of hot towels and straight razors to provide a smooth and close shave.",
            Details: ""
        },
        {
            id: 3,
            Name: "Hair coloring", Img: img4,
            Desc: "Professional hair coloring services using high-quality dyes that are safe and gentle on the hair.",
            Details: ""
        },
        {
            id: 4,
            Name: "Facial treatments", Img: img5,
            Desc: "Cleansing, exfoliating, and moisturizing treatments to improve skin health and appearance.",
            Details: ""
        },
        {
            id: 5,
            Name: "Scalp treatments", Img: img6,
            Desc: "Massages and treatments designed to improve scalp health and promote hair growth.",
            Details: ""
        },
        {
            id: 6,
            Name: "Hair styling", Img: img7,
            Desc: "Styling services using a variety of products and techniques to create the desired look.",
            Details: ""
        },
        {
            id: 7,
            Name: "Hair removal", Img: img8,
            Desc: "Services such as waxing, threading, and sugaring to remove unwanted hair from various parts of the body.",
            Details: ""
        },
        {
            id: 8,
            Name: "Children's haircuts", Img: img9,
            Desc: "Haircuts for children that are tailored to their individual needs and preferences.",
            Details: ""
        },
        {
            id: 9,
            Name: "Grooming packages", Img: img10,
            Desc: "Bundled services that include haircuts, shaves, and other grooming treatments for a comprehensive grooming experience.",
            Details: ""
        },

    ]

    function openNav() {
        if (window.innerWidth < 600) {
            document.querySelector(".nav-body").style.width = "100vw";
        } else if (window.innerWidth < 800) {
            document.querySelector(".nav-body").style.width = "50vw";
        } else if (window.innerWidth < 1000) {
            document.querySelector(".nav-body").style.width = "40vw";
        } else if (window.innerWidth < 1200) {
            document.querySelector(".nav-body").style.width = "35vw";
        } else {
            document.querySelector(".nav-body").style.width = "20vw";
        }
    }
    function closeNav() {
        document.querySelector(".nav-body").style.width = "0";
    }

    useEffect(() => {
        closeNav()
        window.scrollTo(0, 0)
        firebaseGetPageViews({ Name: "Services", Views: 0 })
    }, [])
    return (
        <div className='main'>
            {/* NAGIVATION */}
            <Navigation />
            <div className='top'>
                <Link to="/"><img src={logo} /></Link>
                <RxHamburgerMenu className='top-icon' onClick={openNav} />
            </div>
            {/* BODY */}
            <div className="services font1">
                <h1 className='page-title color3'>Services</h1>
                <div className='services-split'>
                    <div className='services-left'>
                        {
                            services.map((service, i) => {
                                return (
                                    <div key={i} className="service-block">
                                        <h2>{service.Name}</h2>
                                        <img className='service-img' src={service.Img} />
                                        <p className='service-block-desc'>{service.Desc}</p>
                                        {
                                            service.id == serviceID ?
                                                <p className='service-block-deets border-top1'>{service.Details}</p> : <p></p>
                                        }
                                        {/* {
                                            service.id == serviceID ?
                                                <button className='service-btn no-border color2 no-bg' onClick={() => { setServiceID(-1) }}>Show Less</button> :
                                                <button className='service-btn no-border color2 bg3' onClick={() => { setServiceID(service.id) }}>Show More</button>
                                        } */}

                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='services-right'>
                        <div className='divider'></div>
                        <p>
                            Our tools are meant to provide the best haircuts and shaves you can find around town. Our craft is an art form. We plan on giving you the best experience at the best prices. Check out the many services we offer before you schedule an appointment.
                        </p>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className='bottom'>
                <Footer />
            </div>
        </div>
    )
}
