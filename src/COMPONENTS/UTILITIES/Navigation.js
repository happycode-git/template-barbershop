import React, { useEffect } from 'react'
import { TfiClose } from 'react-icons/tfi'
// 
import '../../STYLESHEETS/Navigation.css'
// 
import logo from '../../PHOTOS/stock.png'
import { Link, useNavigate } from 'react-router-dom'
import { c_businessName } from '../../Constants'

export default function Navigation() {
    const navigate = useNavigate()
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
    }, [])
    return (
        <div className='nav-body bg1 color2'>
            <div className='nav-top'>
                <img onClick={() => { navigate('/') }} src={logo} />
                <TfiClose className='nav-icon' onClick={closeNav} />
            </div>
            <div className='nav-links font1'>
                <Link className='nav-link color2' to="/about">About Us</Link>
                <Link className='nav-link color2' to="/services">Services</Link>
                <Link className='nav-link color2' to="/team">Our Barbers</Link>
                <Link className='nav-link color2' to="/gallery">Gallery</Link>
                <Link className='nav-link color2' to="/blog">Blog</Link>
                <Link className='nav-link color2' to="/contact">Contact Us</Link>
            </div>
            <p className='copy font1'>&copy; {c_businessName} 2023. All Rights Reserved.</p>
        </div>
    )
}
