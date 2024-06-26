import React from 'react';
import { Link } from 'react-router-dom';

import img from '../assets/images/background/bg-comming-soon.png'
import logo from '../assets/images/logo/logo-footer.svg';
function CommingSoon(props) {
    return (
        <section className="comming-soon error-page">
                <img src={img} alt="RACIIT" className="bg-comming-soon" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                <div className="comming-soon-inner">
                    <div className="logo">
                        <Link to="/" ><img src={logo} style={{width: "20rem", height: " auto"}} alt="RACIIT" id="logo_header" /></Link>
                    </div>
                    <h2 className="custom-title">COMING SOON</h2>
                    <div className="countdown">
                        <span className="js-countdown" data-timer="1655555" data-labels=" DAYS,  HOURS  , MINUTES  , SECONDS "></span>
                    </div>

                    <form action="#" id="subscribe-form">
                        <input type="email" placeholder="Enter your email" required="" id="subscribe-email" />
                        <button className="tf-button" type="submit" id="subscribe-button">SIGN UP</button>
                    </form>


                    {/* <div className="group-btn">
                        <Link to="/collection" className="tf-button">WHITELIST NOW</Link>
                    </div> */}


                    <ul className="social-item">
                        <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-facebook"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-youtube"></i></Link></li>
                        <li><Link to="#"><i className="icon-fl-tik-tok-2"></i></Link></li>
                    </ul>
                </div>
        </section>
    );
}

export default CommingSoon;