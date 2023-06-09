import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import '../STYLESHEETS/ScheduleAdmin.css'
import logo from '../PHOTOS/stock.png'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseCreateAppointmentType, firebaseGetPageViews, firebaseUpdateAppointmentType, getEventTypes, removeAppointmentType } from '../FIREBASE/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { getScheduledEvents } from '../FIREBASE/firebase'
import { setScheduledEventsState } from '../REDUX/SLICES/ScheduledEventsSlice'
import { BsClockHistory } from 'react-icons/bs'
import DashNavigation from './UTILITIES/DashNavigation'
import { doc } from 'firebase/firestore'
import { setLoadingState } from '../REDUX/SLICES/LoadingSlice'
import { setSuccessState } from '../REDUX/SLICES/SuccessSlice'
import { setFailureState } from '../REDUX/SLICES/FailureSlice'
import { HiXMark } from 'react-icons/hi2'
import { c_mainURL } from '../Constants'
// import { Helmet } from 'react-helmet'
import { randomString } from '../Global'

export default function ScheduleAdmin() {
    const dashUser = useSelector((state) => state.dashUser.value)
    const scheduledEvents = useSelector((state) => state.scheduledEvents.value)
    const types = useSelector((state) => state.eventTypes.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [chosenDate, setChosenDate] = useState(new Date())
    const [myScheduledEvents, setMyScheduledEvents] = useState([])
    const [current, setCurrent] = useState(new Date())
    const [showForm, setShowForm] = useState(false)
    const [showMissing, setShowMissing] = useState(false)
    const [showTypes, setShowTypes] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [chosenID, setChosenID] = useState("")
    const [chosenType, setChosenType] = useState({})

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

    const getDate = () => {
        var date = document.querySelector("#dpDay").value
        var dateEnd = new Date(date.replace(/-/g, '\/'))
        dateEnd = parseInt(dateEnd.getTime() / 1000) + 86400
        dateEnd = new Date(dateEnd * 1000)
        date = new Date(date.replace(/-/g, '\/'))
        setChosenDate(date)
        getScheduledEvents(dispatch, date, dateEnd)
            .then(() => {
                var tempEves = []
                for (var i in scheduledEvents) {
                    const temp = {
                        ...scheduledEvents[i],
                        StartString: `${new Date(scheduledEvents[i].Start.seconds * 1000).getHours()}:${new Date(scheduledEvents[i].Start.seconds * 1000).getMinutes() < 10 ? "0" : ""}${new Date(scheduledEvents[i].Start.seconds * 1000).getMinutes()}`,
                        EndString: `${new Date(scheduledEvents[i].End.seconds * 1000).getHours()}:${new Date(scheduledEvents[i].End.seconds * 1000).getMinutes() < 10 ? "0" : ""}${new Date(scheduledEvents[i].End.seconds * 1000).getMinutes()}`,
                    }
                    tempEves.push(temp)
                    console.log(current > temp.Start.seconds)
                    console.log("-----")
                }
                setMyScheduledEvents(tempEves)
            })
    }
    function currentTime() {
        let date = new Date();
        setCurrent(new Date(date / 1000).getTime())
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        // let session = "AM";

        // if (hh == 0) {
        //     hh = 12;
        // }
        // if (hh > 12) {
        //     hh = hh - 12;
        //     session = "PM";
        // }

        hh = (hh < 10) ? "0" + hh : hh;
        mm = (mm < 10) ? "0" + mm : mm;
        ss = (ss < 10) ? "0" + ss : ss;

        const hours = (hh > 12 ? hh - 12 : hh) + 2

        // let time = hh + ":" + mm + ":" + ss + " " + session;
        let time = hours + ":" + mm + ":" + ss;

        document.getElementById("clock").innerText = time;
        let t = setTimeout(function () { currentTime() }, 1000);
    }
    const createApptType = () => {
        dispatch(setLoadingState(true))

        const start = document.querySelector("#tpStart").value
        const end = document.querySelector("#tpEnd").value
        const type = document.querySelector("#tbType").value
        const duration = document.querySelector("#tbDuration").value
        const price = document.querySelector("#tbPrice").value
        const desc = document.querySelector("#tbDesc").value
        const dow = document.querySelector("#tbDOW").value.replaceAll(" ", "")
        const workers = document.querySelector('#tbWorkers').value

        var newStart = new Date().setHours(start.split(":")[0], start.split(":")[1], 0, 0) / 1000
        newStart = new Date(newStart * 1000)
        var newEnd = new Date().setHours(end.split(":")[0], end.split(":")[1], 0, 0) / 1000
        newEnd = new Date(newEnd * 1000)

        if (start != "" && end != "" && type != "" && duration != "" && desc != "" && dow != "" && workers != "" && price != "") {
            setShowMissing(false)
            const args = {
                Start: newStart,
                End: newEnd,
                Type: type,
                Duration: duration,
                Price: price,
                Desc: desc,
                DOW: dow,
                Workers: workers
            }
            firebaseCreateAppointmentType(args)
                .then(() => {
                    dispatch(setLoadingState(false))
                    dispatch(setSuccessState(true))
                    getEventTypes(dispatch)
                    document.querySelector("#tpStart").value = ""
                    document.querySelector("#tpEnd").value = ""
                    document.querySelector("#tbType").value = ""
                    document.querySelector("#tbDuration").value = ""
                    document.querySelector("#tbPrice").value = ""
                    document.querySelector("#tbDesc").value = ""
                    document.querySelector("#tbDOW").value = ""
                    document.querySelector('#tbWorkers').value = ""
                    setShowForm(false)
                    setTimeout(() => {
                        dispatch(setSuccessState(false))
                    }, 3000);
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(setLoadingState(false))
                    dispatch(setFailureState(true))
                    setTimeout(() => {
                        dispatch(setFailureState(false))
                    }, 3000);
                })
        } else {
            setShowMissing(true)
            dispatch(setLoadingState(false))
        }
    }
    const setEditDetails = (chosenType) => {
        setChosenID(chosenType.id)
        dispatch(setLoadingState(true))
        const start = `${new Date(chosenType.StartHour.seconds * 1000).getHours() >= 10 ? '' : '0'}${new Date(chosenType.StartHour.seconds * 1000).getHours()}:${new Date(chosenType.StartHour.seconds * 1000).getMinutes()}${new Date(chosenType.StartHour.seconds * 1000).getMinutes() >= 10 ? '' : '0'}`
        const end = `${new Date(chosenType.EndHour.seconds * 1000).getHours() >= 10 ? '' : '0'}${new Date(chosenType.EndHour.seconds * 1000).getHours()}:${new Date(chosenType.EndHour.seconds * 1000).getMinutes()}${new Date(chosenType.EndHour.seconds * 1000).getMinutes() >= 10 ? '' : '0'}`

        document.querySelector("#tpEditStart").value = start
        document.querySelector("#tpEditEnd").value = end
        document.querySelector("#tbEditType").value = chosenType.Type
        document.querySelector("#tbEditDuration").value = chosenType.Duration
        document.querySelector("#tbEditPrice").value = chosenType.Price
        document.querySelector("#tbEditDesc").value = chosenType.Desc
        document.querySelector("#tbEditDOW").value = chosenType.DOW
        document.querySelector('#tbEditWorkers').value = chosenType.Workers
        dispatch(setLoadingState(false))
        setShowTypes(false)
    }
    const updateApptType = () => {
        dispatch(setLoadingState(true))

        const start = document.querySelector("#tpEditStart").value
        const end = document.querySelector("#tpEditEnd").value
        const type = document.querySelector("#tbEditType").value
        const duration = document.querySelector("#tbEditDuration").value
        const price = document.querySelector("#tbEditPrice").value
        const desc = document.querySelector("#tbEditDesc").value
        const dow = document.querySelector("#tbEditDOW").value.replaceAll(" ", "")
        const workers = document.querySelector('#tbEditWorkers').value


        var newStart = new Date().setHours(start.split(":")[0], start.split(":")[1], 0, 0) / 1000
        newStart = new Date(newStart * 1000)
        var newEnd = new Date().setHours(end.split(":")[0], end.split(":")[1], 0, 0) / 1000
        newEnd = new Date(newEnd * 1000)

        if (start != "" && end != "" && type != "" && duration != "" && desc != "" && dow != "" && workers != "" && price != "") {
            setShowMissing(false)
            const args = {
                id: chosenID,
                Start: newStart,
                End: newEnd,
                Type: type,
                Duration: duration,
                Price: price,
                Desc: desc,
                DOW: dow,
                Workers: workers
            }
            firebaseUpdateAppointmentType(args)
                .then(() => {
                    dispatch(setLoadingState(false))
                    dispatch(setSuccessState(true))
                    getEventTypes(dispatch)
                    document.querySelector("#tpEditStart").value = ""
                    document.querySelector("#tpEditEnd").value = ""
                    document.querySelector("#tbEditType").value = ""
                    document.querySelector("#tbEditDuration").value = ""
                    document.querySelector("#tbEditPrice").value = ""
                    document.querySelector("#tbEditDesc").value = ""
                    document.querySelector("#tbEditDOW").value = ""
                    document.querySelector('#tbEditWorkers').value = ""
                    setShowEdit(false)
                    setTimeout(() => {
                        dispatch(setSuccessState(false))
                    }, 3000);
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(setLoadingState(false))
                    dispatch(setFailureState(true))
                    setTimeout(() => {
                        dispatch(setFailureState(false))
                    }, 3000);
                })
        } else {
            setShowMissing(true)
            dispatch(setLoadingState(false))
        }
    }
    const duplicateApptType = () => {
        console.clear()
        console.log(chosenType)
        dispatch(setLoadingState(true))

        const temp = {
            ...chosenType,
            Start: chosenType.StartHour,
            End: chosenType.EndHour,
            id: randomString(25)
        }
        dispatch(setLoadingState(false))
        firebaseCreateAppointmentType(temp)
            .then(() => {
                dispatch(setLoadingState(false))
                dispatch(setSuccessState(true))
                getEventTypes(dispatch)
                setShowEdit(false)
                setTimeout(() => {
                    dispatch(setSuccessState(false))
                }, 3000);
            })
            .catch((error) => {
                console.log(error)
                dispatch(setLoadingState(false))
                dispatch(setFailureState(true))
                setTimeout(() => {
                    dispatch(setFailureState(false))
                }, 3000);
            })
    }
    const removeApptType = () => {
        removeAppointmentType(chosenType)
        .then(() => {
            dispatch(setLoadingState(false))
            dispatch(setSuccessState(true))
            getEventTypes(dispatch)
            setShowEdit(false)
            setTimeout(() => {
                dispatch(setSuccessState(false))
            }, 3000);
        })
        .catch((error) => {
            console.log(error)
            dispatch(setLoadingState(false))
            dispatch(setFailureState(true))
            setTimeout(() => {
                dispatch(setFailureState(false))
            }, 3000);
        })
    }

    useEffect(() => {
        if (dashUser.Email == undefined) {
            navigate("/login")
        }
        window.scrollTo(0, 0)
        closeNav()
        window.scrollTo(0, 0)
        firebaseGetPageViews({ Name: "ScheduleAdmin", Views: 0 })
        currentTime()
    }, [])

    return (
        <div className='main'>
            {/* <Helmet>
                <title>Schedule Admin | Happy Code Template</title>
                <meta name="description" content="Happy Code is a top-rated web development company that specializes in creating professional websites for small businesses. Our services are affordable, and we offer great maintenance benefits to ensure your website stays up-to-date and secure. Contact us today to learn more about our services and how we can help your business grow online." />
                <meta name="keywords" content="web development, small business, low cost, maintenance benefits, Happy Code" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${c_mainURL}`} />
                <meta property="og:title" content="Schedule Admin | Happy Code Template" />
                <meta property="og:description" content="Happy Code is a top-rated web development company that specializes in creating professional websites for small businesses. Our services are affordable, and we offer great maintenance benefits to ensure your website stays up-to-date and secure. Contact us today to learn more about our services and how we can help your business grow online." />
                <meta property="og:url" content={`${c_mainURL}`} />
                <meta property="og:image" content={`${c_mainURL}/src/PHOTOS/stock.png`} />
            </Helmet> */}
            {/* NAGIVATION */}
            <DashNavigation />
            <div className='top'>
                <Link to="/login"><img src={logo} /></Link>
                <RxHamburgerMenu className='top-icon' onClick={openNav} />
            </div>
            {/* BODY */}
            {
                showForm ?
                    <div className='schedule-admin-form font1'>
                        <div className='schedule-admin-form-wrap bg1 color2 border-red'>
                            <div className='separate'>
                                <h1>Please enter all information to create an appointment type.</h1>
                                <HiXMark className='schedule-xmark' onClick={() => { setShowForm(false) }} />
                            </div>
                            <br />
                            <div className='split'>
                                <div className='schedule-admin-form-pair'>
                                    <label>Start of Day:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tpStart" type="time" max="24" onChange={() => { console.log(document.querySelector("#tpStart").value) }} />
                                </div>
                                <div className='schedule-admin-form-pair'>
                                    <label>End of Day:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tpEnd" type="time" />
                                </div>
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Appointment Type Name:</label>
                                <input className={`${showMissing ? "border-red" : ""} border1`} id="tbType" placeholder="Manicure/Pedicure" type="text" />
                            </div>
                            <div className='split'>
                                <div className='schedule-admin-form-pair'>
                                    <label>Duration:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tbDuration" placeholder="30" type="text" />
                                </div>
                                <div className='schedule-admin-form-pair'>
                                    <label>Price:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tbPrice" placeholder="$50" type="text" />
                                </div>
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Description:</label>
                                <textarea className={`${showMissing ? "border-red" : ""} border1`} id="tbDesc" placeholder="30 minute haircut with shave and full shampoo service. Perfect for special occasions."></textarea>
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Days of Week:</label>
                                <input className={`${showMissing ? "border-red" : ""} border1`} id="tbDOW" placeholder="Monday,Tuesday,Friday" type="text" />
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Workers:</label>
                                <input className={`${showMissing ? "border-red" : ""} border1`} id="tbWorkers" placeholder="Joshua,Megan,Ben" type="text" />
                            </div>

                            <button onClick={createApptType} className='bg3 color2 no-border schedule-admin-form-btn'>Create Appt. Type</button>
                        </div>
                    </div> : <div></div>
            }
            {
                showTypes ?
                    <div className='appt-types-wrap bg1 border-red font1'>
                        <div className='appt-types-top'>
                            <h1>Appointment Types</h1>
                            <HiXMark className='appt-types-x' onClick={() => { setShowTypes(false); setShowEdit(false) }} />
                        </div>
                        <p>Click on any appointment type to edit details.</p>
                        <div className='appt-types font1'>
                            {
                                types.map((type, i) => {
                                    return (
                                        <div key={i}>
                                            <button onClick={() => { setEditDetails(type); setChosenType(type) }} className='border1 color2 no-bg'>{type.Type}</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    : <div></div>
            }
            {
                showEdit ?
                    <div className='schedule-admin-form font1'>
                        <div className='schedule-admin-form-wrap bg1 color2 border-red'>
                            <div className='separate'>
                                <h1>Please enter all information to create an appointment type.</h1>
                                <HiXMark className='schedule-xmark' onClick={() => { setShowEdit(false) }} />
                            </div>
                            <br />
                            <div className='split'>
                                <div className='schedule-admin-form-pair'>
                                    <label>Start of Day:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tpEditStart" type="time" max="24" onChange={() => { console.log(document.querySelector("#tpStart").value) }} />
                                </div>
                                <div className='schedule-admin-form-pair'>
                                    <label>End of Day:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tpEditEnd" type="time" />
                                </div>
                            </div>
                            <div className='big-split'>
                                <div className='schedule-admin-form-pair'>
                                    <label>Appointment Type Name:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tbEditType" placeholder="Manicure/Pedicure" type="text" />
                                </div>

                            </div>
                            <div className='split'>
                                <div className='schedule-admin-form-pair'>
                                    <label>Duration:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tbEditDuration" placeholder="30" type="text" />
                                </div>
                                <div className='schedule-admin-form-pair'>
                                    <label>Price:</label>
                                    <input className={`${showMissing ? "border-red" : ""} border1`} id="tbEditPrice" placeholder="$50" type="text" />
                                </div>
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Description:</label>
                                <textarea className={`${showMissing ? "border-red" : ""} border1`} id="tbEditDesc" placeholder="30 minute haircut with shave and full shampoo service. Perfect for special occasions."></textarea>
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Days of Week:</label>
                                <input className={`${showMissing ? "border-red" : ""} border1`} id="tbEditDOW" placeholder="Monday,Tuesday,Friday" type="text" />
                            </div>
                            <div className='schedule-admin-form-pair'>
                                <label>Workers:</label>
                                <input className={`${showMissing ? "border-red" : ""} border1`} id="tbEditWorkers" placeholder="Joshua,Megan,Ben" type="text" />
                            </div>

                            <button onClick={updateApptType} className='bg1 color2 border1 schedule-admin-form-btn'>Update</button>
                            <br />
                            <br />
                            <div className='split'>
                                <button onClick={duplicateApptType} className='bg4 color2 no-border schedule-admin-form-btn'>Duplicate</button>

                                <button onClick={removeApptType} className='bg3 color2 no-border schedule-admin-form-btn'>Remove</button>
                            </div>
                        </div>
                    </div> : <div></div>
            }
            <div className='schedule-admin font1'>
                <div className='relative'>
                    <h1 className='page-title-sm'>Schedule Admin</h1>
                    <br />
                    <div className='clock-wrap'>
                        <BsClockHistory className='clock-icon' />
                        <h1 className='color3 schedule-clock' id="clock">0:00:00</h1>
                    </div>
                    <br />
                    <input type="date" className='schedule-admin-date border2' id="dpDay" />
                    <br />
                    <br />
                    <button onClick={getDate} className='schedule-admin-btn bg3 color2 no-border'>Get Scheduled Appointments</button>
                    <br />
                    <div className='divider'></div>
                    <div className='schedule-admin-btns'>
                        <button onClick={() => { setShowForm(true) }} className='bg4 color2 no-border schedule-admin-create'>Create New Appointment Type</button>
                        <br />
                        <button onClick={() => { setShowTypes(true); setShowEdit(true); getEventTypes(dispatch); }} className='bg4 color2 no-border schedule-admin-create'>View Appointment Types</button>
                    </div>
                </div>
                <div className='schedule-admin-wrap'>
                    <div className='schedule-admin-times'>
                        {
                            myScheduledEvents.map((eve, i) => {
                                return (
                                    <div className={`schedule-admin-eve ${eve.Start.seconds > current ? "border2 border-green" : "border3 bg3 color3"}`} key={i}>
                                        <div className='separate'>
                                            <div>
                                                <h2>{eve.Name}</h2>
                                                <p>{eve.Type}</p>
                                            </div>
                                            <div className=''>
                                                <h4>{eve.StartString}</h4>
                                                <p>{eve.Worker}</p>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            {/* FOOTER */}
            <div className='bottom'>
                <Footer />
            </div>
        </div >
    )
}
