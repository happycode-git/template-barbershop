import React, { useEffect } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import '../STYLESHEETS/About.css'
import logo from '../PHOTOS/stock.png'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { Link } from 'react-router-dom'
import { firebaseGetPageViews } from '../FIREBASE/firebase'

export default function About() {
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
        firebaseGetPageViews({ Name: "About", Views: 0 })
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
            <div className="about font1">
                <h1 className='page-title color3'>About Us</h1>
                <div className='about-wrap'>
                    <div className='about-section'>
                        <div>
                            <h2 className='about-sub'>Bringing Back the Classic Barber Shop Experience: Introducing Barber Knights.</h2>
                            <div className='about-img'></div>
                        </div>
                        <div className='about-text'>
                            <p>Barber Knights is a barbershop that has been serving the community for over a decade. Located in the heart of downtown, they are known for their top-notch grooming services and welcoming environment. Their team of experienced barbers takes pride in providing excellent services that cater to various hair types and styles.</p>
                            <p>The barbers at Barber Knights are skilled in their craft, with years of experience under their belts. They stay up to date with the latest trends and techniques in grooming, ensuring that their customers receive the best possible service. Whether it's a classic haircut, a hot towel shave, or a beard trim, their barbers are equipped to handle any request. </p>
                            <p>Barber Knights is more than just a place to get a haircut. It's a community hub where customers can socialize, relax, and unwind. The shop has a comfortable and inviting atmosphere, with vintage decor and comfortable seating. Customers are welcomed with a smile and offered a beverage while they wait for their appointment. </p>
                        </div>
                    </div>
                    <div className='about-section'>
                        
                        <div className='about-text'>
                            <p>At Barber Knights, customer satisfaction is the top priority. Their barbers take the time to listen to each customer's needs and offer suggestions based on their hair type, face shape, and personal style. They go the extra mile to ensure that every customer leaves feeling confident and refreshed. Barber Knights has built a loyal following of customers who appreciate their attention to detail and commitment to quality.</p>
                            <p>In summary, Barber Knights is a barbershop that offers top-notch grooming services in a friendly and welcoming environment. With their experienced barbers and range of services, they cater to various hair types and styles. Customers can enjoy traditional and modern haircuts, beard grooming, hot towel shaves, hair coloring, and kids haircuts at Barber Knights. Book your appointment today and experience their excellent services for yourself.</p>
                        </div>
                        <div>
                            <h2 className='about-sub'>Join the Brotherhood: Experience the Welcoming Atmosphere of Barber Knights</h2>
                            <div className='about-img2'></div>
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
