import React, { useEffect } from 'react'
// 
import '../STYLESHEETS/Dashboard.css'
import logo from '../PHOTOS/stock.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { dashGetContactEntries, dashGetPageViews, firebaseSignOut } from '../FIREBASE/firebase'
import { VscEye } from 'react-icons/vsc'

import { setLoadingState } from '../REDUX/SLICES/LoadingSlice'
import DashNavigation from './UTILITIES/DashNavigation'
import { RxHamburgerMenu } from 'react-icons/rx'

export default function About() {
    const dashUser = useSelector((state) => state.dashUser.value)
    const pageViewPages = useSelector((state) => state.pageViews.value)
    const contactEntries = useSelector((state) => state.contactEntries.value)

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

    useEffect(() => {
        if (dashUser.Email == undefined) {
            navigate("/login")
        }
        window.scrollTo(0, 0)
        dashGetPageViews(dispatch)
        dashGetContactEntries(dispatch)
        dispatch(setLoadingState(false))
    }, [])
    return (
        <div className='main font1'>
            {/* NAVGIATION */}
            <DashNavigation />

            <div className='top'>
                <Link to="/login"><img src={logo} /></Link>
                <RxHamburgerMenu className='top-icon' onClick={openNav} />
            </div>
            <div className='dashboard'>
                <h1 className='page-title-sm dashboard-head color3'>Dashboard</h1>
                <div className='dashboard-wrap'>
                    {/* COMPONENTS */}
                    <span className='dash-comp col1 bg1 border-red'>
                        <h1>Page Views</h1>
                        <p className='dash-comp-desc'>Discover which pages are getting the most views. This will determine which pages need to be optimized more often.</p>
                        <div className='page-views'>
                            {
                                pageViewPages.map((page, i) => {
                                    return (
                                        <div key={i} className='dash-pageviews-block color2 separate'>
                                            <h3>{page.Name}</h3>
                                            <div className='flex'>
                                                <p className='color2'>{page.Views}</p>
                                                <VscEye color="" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </span>
                    <span className='dash-comp col3 bg1 border-red'>
                        <h1>Contact Entries</h1>
                        <p className='dash-comp-desc'>These are the entries that are submitted by your users. All entries are filtered by Date.</p>
                        <table className='dash-contact-table'>
                            <tr>
                                <th className='bg1 color2 border1'>Name</th>
                                <th className='bg1 color2 border1'>Email</th>
                                <th className='bg1 color2 border1'>Reason</th>
                                <th className='bg1 color2 border1 dash-contact-msg'>Message</th>
                            </tr>
                            {
                                contactEntries.map((entry, i) => {
                                    return (
                                        <tr key={i} className="">
                                            <td className='border1'>{entry.Email}</td>
                                            <td className='border1'>{entry.Name}</td>
                                            <td className='border1'>{entry.Reason}</td>
                                            <td className='border1 dash-contact-msg'>{entry.Message}</td>
                                        </tr>
                                    )
                                })
                            }

                        </table>

                    </span>
                </div>
            </div>

        </div>
    )
}
