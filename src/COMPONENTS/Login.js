import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import '../STYLESHEETS/Login.css'
import logo from '../PHOTOS/stock.png'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { Link, useNavigate } from 'react-router-dom'
// 
import { firebaseGetPageViews, firebaseLogin } from '../FIREBASE/firebase'
import { useDispatch } from 'react-redux'
import { setLoadingState } from '../REDUX/SLICES/LoadingSlice'

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    const [errorMsg, setErrorMsg] = useState("")
    const [showError, setShowError] = useState(false)

    const login = () => {
        dispatch(setLoadingState(true))
        const email = document.querySelector("#tbEmail").value
        const password = document.querySelector("#tbPass").value

        firebaseLogin(email, password, setErrorMsg, setShowError, navigate, dispatch)
        
    }

    useEffect(() => {
        closeNav()
        window.scrollTo(0, 0)
        firebaseGetPageViews({ Name: "Login", Views: 0 })
    }, [])
    return (
        <div className='main'>
            {/* NAGIVATION */}
            <Navigation />
            <div className='top'>
                <Link to="/"><img src={logo} /></Link>
                <RxHamburgerMenu className='top-icon color4' onClick={openNav} />
            </div>
            {/* BODY */}
            <div className="login font1">
                <h1 className='page-title'>Log In</h1>
                <div className='login-wrap'>
                    <div className='login-pair'>
                        <label>Email:</label>
                        <input className='color2 border2 no-bg' type="text" id="tbEmail" placeholder='jdoe@happycode.com' />
                    </div>
                    <div className='login-pair'>
                        <label>Password:</label>
                        <input className='border2 no-bg' type="password" id="tbPass" placeholder='********' />
                    </div>
                    <button onClick={login} className='login-btn color2 bg3 no-border'>Let's Go</button>
                    <p className="login-error red">{showError ? errorMsg : ""}</p>
                </div>
            </div>

            {/* FOOTER */}
            <div className='bottom' style={{ position: "absolute", bottom: "0", right: "0", left: "0" }}>
                <Footer />
            </div>
        </div>
    )
}
