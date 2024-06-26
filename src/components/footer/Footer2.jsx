import React , {useState , useEffect} from 'react';

import { Link } from 'react-router-dom';
import './styles.scss';

import logo from '../../assets/images/logo/logo-footer.svg';


function Footer2(props) {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
     
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer style-2">
                <div className="footer-inner">
                    <div className="tf-container">
                        <div className="row">
                            <div className="col-md-12">
                                <h2 className="title">JOIN OUR COMMUNITY</h2>
                                <p className="content">Engage with us to help the community while having fun! </p>
                                <div className="group-btn">
                                    {/* <Link to="#" className="tf-button discord" data-toggle="modal" data-target="#popup_bid"><i className="icon-fl-vt"></i><span>DISCORD</span></Link> */}
                                    <Link to="/contact" className="tf-button">BECOME A RACIIT MEMBER</Link>
                                </div>
                                {/* <form action="#" id="subscribe-form">
                                    <input type="email" placeholder="Enter your email" required="" id="subscribe-email" />
                                    <button className="tf-button" type="submit" id="subscribe-button">JOIN</button>
                                </form> */}

                                <ul className="social-item">
                                  
                                    <li><Link to="https://www.facebook.com/iitrotaract"  target="_blank" rel="noopener noreferrer" ><i className="fab fa-facebook"></i></Link></li>
                                    <li><Link to="https://www.instagram.com/rotaract_iit"  target="_blank" rel="noopener noreferrer" ><i className="fab fa-instagram"></i></Link></li>
                                    <li><Link to="https://www.youtube.com/@iitrotaract" target="_blank" rel="noopener noreferrer" ><i className="fab fa-youtube"></i></Link></li>
                                    <li><Link to="https://www.linkedin.com/company/rotaract-club-of-iit" target="_blank" rel="noopener noreferrer" ><i className="fab fa-linkedin"></i></Link></li>
                                    <li><Link to="https://www.tiktok.com/@rotaract_iit" target="_blank" rel="noopener noreferrer" ><i className="icon-fl-tik-tok"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-inner">
                    <div className="tf-container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="bottom">
                                
                                   <div className="content-left">
                                        <img src={logo}  className='logo-dark' style={{width:"12rem"}} alt="RACIIT" />
                                        <p className="copy-right">Rotaract Club Of IIT {currentYear} - ALL rights reserved</p>
                                   </div>

                                    <ul className="menu-bottom">
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="/annualreport">About Us</Link></li>
                                        <li><Link to="/blog">Avenues</Link></li>
                                        <li><Link to="/contact">Contact Us</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                isVisible && 
                <Link onClick={scrollToTop}  to='#' id="scroll-top"></Link>
            }
            </footer>
    );
}

export default Footer2;