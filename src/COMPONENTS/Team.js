import React, { useEffect } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import '../STYLESHEETS/Team.css'
import logo from '../PHOTOS/stock.png'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { Link } from 'react-router-dom'
import { firebaseGetPageViews } from '../FIREBASE/firebase'
// 
import img1 from '../PHOTOS/portrait1.jpeg'
import img2 from '../PHOTOS/portrait2.jpeg'
import img3 from '../PHOTOS/portrait3.jpeg'

export default function Team() {
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

    const team = [
        {
            id: 0,
            Name: "Camila Mendoza",
            Position: "Hair Extraordinaire",
            Img: img1
        },
        {
            id: 1,
            Name: "George Torres",
            Position: "Shaving Specialist",
            Img: img2
        },
        {
            id: 2,
            Name: "Benjamin Roland",
            Position: "Clipper Expert",
            Img: img3
        },
    ]

    useEffect(() => {
        closeNav()
        window.scrollTo(0, 0)
        firebaseGetPageViews({ Name: "Team", Views: 0 })
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
            <div className="padding font1">
                <h1 className='page-title color3'>Meet our team</h1>
                <p className='team-sub'>
                At Barber Knights, we pride ourselves on having an exceptional team of skilled barbers who are passionate about their craft. Our barbers are experienced in working with all hair types and styles, and they take the time to listen to our customers' needs and preferences. They are dedicated to providing a personalized and high-quality grooming experience, ensuring that every customer leaves our shop feeling confident and satisfied with their new look.
                </p>
                <br />
                <div className='team-members'>
                    {
                        team.map((mem, i) => {
                            return (
                                <div className='team-member' key={i}>
                                    <img src={mem.Img} />
                                    <h1 className=''>{mem.Name}</h1>
                                    <p>{mem.Position}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <br /><br />
            {/* FOOTER */}
            <div className='bottom'>
                <Footer />
            </div>
        </div>
    )
}
