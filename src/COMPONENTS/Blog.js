import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
// 
import '../STYLESHEETS/Blog.css'
import logo from '../PHOTOS/stock.png'
import Footer from './UTILITIES/Footer'
import Navigation from './UTILITIES/Navigation'
import { Link, useNavigate } from 'react-router-dom'
import img1 from '../PHOTOS/barber1.jpeg'
import img2 from '../PHOTOS/barber2.jpeg'
import img3 from '../PHOTOS/barber3.jpeg'

import blog1img1 from '../PHOTOS/MAIN/barber13.jpg'

import blog2img1 from '../PHOTOS/MAIN/barber9.jpg'
import blog2img2 from '../PHOTOS/MAIN/barber11.jpg'
import blog2img3 from '../PHOTOS/MAIN/barber17.jpg'

import blog3img1 from '../PHOTOS/MAIN/barber23.jpg'

// 
import { setBlogPostState } from '../REDUX/SLICES/BlogPostSlice'
import { useDispatch } from 'react-redux'
import { firebaseGetPageViews } from '../FIREBASE/firebase'

export default function Blog() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const testBlogs = [
        {
            id: 0,
            Date: "January 21, 2023",
            Title: "Barbering 101: A Complete Guide to Mastering the Art of Haircutting",
            Desc: "Barbering is more than just a job; it's a craft. It takes skill, patience, and attention to detail to become a successful barber. From classic haircuts to modern styling techniques, a barber's job is to help their clients look and feel their best. In this blog post, we'll explore the craft of being a barber and what it takes to become a master in the field.",
            ImgPath: img1,
            Author: "Master Bagel Jr.",
            Tags: "Haircut, Shave, Barber, Blade",
            HTML: <div className='blogpost-wrap'>
                <p>
                    Barbering is more than just a job; it's a craft. It takes skill, patience, and attention to detail to become a successful barber. From classic haircuts to modern styling techniques, a barber's job is to help their clients look and feel their best. In this blog post, we'll explore the craft of being a barber and what it takes to become a master in the field.
                </p>
                <p>The history of barbering dates back to ancient times, with evidence of barbering practices found in Egyptian tombs. Barbers were not only responsible for haircuts and shaving but also for performing surgeries and dental work. As time went on, the profession evolved into what we know it as today: a place for grooming and socializing.</p>
                <p>
                    The first step in becoming a barber is to attend a barber school or an apprenticeship program. In these programs, aspiring barbers learn the basics of hair cutting, shaving, and styling. They also learn about sanitation, hygiene, and customer service. After completing their training, barbers can obtain their license and begin practicing.
                </p>
                <p>
                    One of the most important skills a barber must possess is the ability to communicate effectively with their clients. Barbers need to listen carefully to their clients' requests and provide recommendations based on their hair type, face shape, and personal style. A skilled barber can offer suggestions that help their clients achieve their desired look.
                </p>
                <p>
                    Another essential skill for barbers is attention to detail. Barbers must be meticulous in their work to ensure that every hair is in place and every line is precise. A single mistake can ruin a haircut, and that's not something any barber wants.
                </p>
                <p>
                    Barbers must also keep up with the latest trends and techniques in the industry. They must stay current with new products, styles, and equipment. Continuing education is critical in the field of barbering, and many barbers attend seminars and workshops to improve their skills.
                </p>
                <p>In addition to technical skills, a successful barber must also have excellent customer service skills. A barber must create a welcoming and comfortable atmosphere for their clients. They must be friendly, personable, and attentive to their clients' needs.</p>
                <img src={blog1img1} className="blogpost-img" alt='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' />
                <h3>In conclusion, being a barber is a craft that requires skill, patience, and attention to detail. A successful barber must possess excellent communication skills, attention to detail, and be up-to-date with the latest trends and techniques. They must also be friendly and personable to create a welcoming environment for their clients. Being a barber is not just a job, it's a passion for creating great looks and helping people feel their best.</h3>

            </div>
        },
        {
            id: 1,
            Date: "May 4, 2023",
            Title: "Top 5 Grooming Services at Barber Knights: From Haircuts to Hot Towel Shaves",
            Desc: "As a barbershop, Barber Knights provides excellent grooming services that cater to various hair types and styles. They have experienced barbers who take the time to listen to their customers' needs and offer suggestions based on their hair type, face shape, and personal style. Here are the top 5 services that Barber Knights offers:",
            ImgPath: blog2img1,
            Author: "Master Bagel Jr.",
            Tags: "Haircut, Shave, Barber, Blade",
            HTML: <div className='blogpost-wrap'>

                <img src={blog2img1} className="blogpost-img" alt='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' />
                <h3>Haircuts</h3>
                <p>
                    Barber Knights provides traditional and modern haircuts that are tailored to each customer's individual preferences. Their skilled barbers use scissors, clippers, and other tools to create the perfect haircut for each customer.
                </p>
                <br />
                <img src={blog2img2} className="blogpost-img" alt='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' />
                <br />
                <h3>Beard Grooming</h3>
                <p>
                    For customers who have facial hair, Barber Knights offers a range of beard grooming services. Their barbers help customers achieve a neat and polished look through beard trims and shaves. They also offer beard oil treatments to keep the beard soft and conditioned.
                </p>
                <br />
                <h3>Hot Towel Shave</h3>
                <p>Barber Knights' hot towel shave is a classic grooming service that is both relaxing and refreshing. The use of hot towels and straight razors gives customers a smooth and close shave. They also provide beard lineups and detailing to complete the look.</p>
                <br />
                <h3>Hair Coloring</h3>
                <p>Barber Knights offers professional hair coloring services using high-quality hair dyes that are safe and gentle on the hair. Customers can achieve a natural look or something more bold and daring with the help of their experienced barbers.</p>
                <br />
                <h3>Kids Haircuts</h3>
                <p>
                    Barber Knights provides haircuts for children. Their barbers are patient and skilled in working with children, making the experience as comfortable and enjoyable as possible.
                </p>
                <br />
                <img src={blog2img3} className="blogpost-img" alt='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' />
                <br />
                <p>
                    Barber Knights is a one-stop-shop for all your grooming needs. From haircuts to beard grooming, hot towel shaves, hair coloring, and kids haircuts, their experienced barbers provide top-notch services that cater to various hair types and styles. With their attention to detail and personalized approach, customers can trust that they will leave the shop looking and feeling their best. Visit Barber Knights and see for yourself why they are the go-to barbershop for quality grooming services in a friendly and welcoming environment. Book your appointment today and get ready for an exceptional grooming experience.
                </p>
            </div>
        },
        {
            id: 0,
            Date: "January 21, 2023",
            Title: "Introducing Our Brand New Website for Barber Knights: The Ultimate Guide to Our Services, Prices, and More",
            Desc: "As a trusted and experienced barbershop, Barber Knights has always been dedicated to providing top-notch grooming services for our clients. Today, we are thrilled to announce the launch of our brand new website, which is designed to make it easier than ever for our clients to access our services and stay up-to-date on the latest trends and styles.",
            ImgPath: blog3img1,
            Author: "Master Bagel Jr.",
            Tags: "Haircut, Shave, Barber, Blade",
            HTML: <div className='blogpost-wrap'>
                <p>
                    As a trusted and experienced barbershop, Barber Knights has always been dedicated to providing top-notch grooming services for our clients. Today, we are thrilled to announce the launch of our brand new website, which is designed to make it easier than ever for our clients to access our services and stay up-to-date on the latest trends and styles.
                </p>
                <h3>Our new website is packed with features that we think our clients will love. Here are just a few of the highlights:</h3>
                <h4>Easy Online Booking</h4>
                <p>
                    One of the biggest improvements we have made to our website is the addition of an online booking system. Now, clients can easily schedule their appointments with just a few clicks, making it easier than ever to fit a grooming session into their busy schedules.
                </p>
                <h4>Detailed Service Descriptions</h4>
                <p>
                    We understand that not everyone is familiar with the different types of haircuts and grooming services that we offer. That's why our website now includes detailed descriptions of each of our services, along with photos to give clients a better idea of what they can expect.
                </p>
                <h4>Style Inspiration</h4>
                <p>
                    Our new website also features a gallery of photos showcasing the latest styles and trends in men's grooming. Whether you're looking for a classic look or something more modern and daring, our stylists can help you achieve the perfect look.
                </p>
                <h4>News and Updates</h4>
                <p>
                    Stay up-to-date on the latest news and promotions at Barber Knights with our news and updates section. We'll be sharing tips and tricks for maintaining your look, as well as exclusive deals for our clients.
                </p>
                <h4>Online Store</h4>
                <p>
                    Finally, we're excited to offer an online store where clients can purchase their favorite grooming products from the comfort of their own homes. From beard oils to hair styling products, we have everything you need to keep looking your best.
                </p>
                <p>We are so excited to share our new website with our clients, and we hope that you find it helpful and easy to use. As always, we remain committed to providing the highest level of service and quality to our clients. Book your appointment online today and come experience the Barber Knights difference for yourself!</p>

            </div>
        },

    ]
    testBlogs.reverse()
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
    const [firstBlog, setFirstBlog] = useState({})

    useEffect(() => {
        closeNav()
        window.scrollTo(0, 0)
        setFirstBlog(testBlogs[0])
        testBlogs.shift()
        firebaseGetPageViews({ Name: "Blog", Views: 0 })
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
            <div className="blog font1">
                <h1 className='page-title color3'>Blog</h1>
                <div className='blog-wrap'>
                    <div className='blog-left'>
                        <div className='first-blog-block' onClick={() => {
                            dispatch(setBlogPostState(firstBlog));
                            navigate('/blogpost')
                        }}>
                            <img src={firstBlog.ImgPath} className="first-blog-img" />
                            <div className='first-blog-text'>
                                <p className='first-blog-date'>{firstBlog.Date}</p>
                                <h1 className='first-blog-title'>{firstBlog.Title}</h1>
                                <p className='first-blog-desc'>{firstBlog.Desc}</p>
                                <div className='first-blog-tags'>
                                    {/* {
                                        firstBlog.Tags.length > 0 ?
                                            firstBlog.Tags.split(",").map((tag, j) => {
                                                return (
                                                    <p key={j} className='first-blog-tag border2'>{tag}</p>
                                                )
                                            }) : <div></div>
                                    } */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='blog-right'>
                        {
                            testBlogs.map((blog, i) => {
                                if (i > 0) {
                                    return (
                                        <div key={i} className='blog-block' onClick={() => {
                                            dispatch(setBlogPostState(blog));
                                            navigate('/blogpost')
                                        }}>
                                            <img src={blog.ImgPath} className="blog-img" />
                                            <div className='blog-text'>
                                                <p className='blog-date'>{blog.Date}</p>
                                                <h1 className='blog-title'>{blog.Title}</h1>
                                                <p className='blog-desc'>{blog.Desc}</p>
                                                <div className='blog-tags'>
                                                    {/* {
                                                            blog.Tags.split(",").map((tag, j) => {
                                                                return (
                                                                    <p key={j} className='blog-tag border2'>{tag}</p>
                                                                )
                                                            })
                                                        } */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
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
