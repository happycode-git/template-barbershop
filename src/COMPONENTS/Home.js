import React, { useEffect } from 'react'
// 
import '../STYLESHEETS/Home.css'
// 
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import logo from '../PHOTOS/stock.png'
import img1 from '../PHOTOS/shop.jpg'
// 
import { Link, useNavigate } from 'react-router-dom'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { firebaseGetPageViews } from '../FIREBASE/firebase'

export default function Home() {
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
        firebaseGetPageViews({ Name: "Home", Views: 0 })
    }, [])
    return (
        <div className='main'>
            {/* NAGIVATION */}
            <Navigation />
            <div className='top'>
                <Link to="/"><img src={logo} /></Link>
                <RxHamburgerMenu className='top-icon ' onClick={openNav} />
            </div>
            {/* BODY */}
            <div className="home font1">
                <div className='home-panel1'>
                    <div>
                        <h1 className=''><span className='color3'>Barber Knights</span>,<br/> fresh haircuts and shaves.</h1>
                        <div className='home-panel1-img'></div>
                    </div>
                    <div className='home-right'>
                        <div className='home-panel1-img-right'></div>
                        <div className='home-panel1-right-info'>
                            <h2 className='home-panel1-sub color3'>A clean cut is everything.</h2>
                            <p className='home-panel1-text'>
                                Walk out our doors completely satisfied with a fresh look and outstanding experience. Barber Knights are tasked to perform art with our barber tools. We take it to the next level.
                            </p>
                            <button onClick={() => {navigate('/schedule')}} className='home-panel1-btn border-red color3 no-bg'>Schedule Now</button>
                        </div>
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
