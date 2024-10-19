import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import facebookIcon from "/images/facebook-icon.png";
import instagramIcon from "/images/instagram-icon.png";
import linkedinIcon from "/images/linkedin-icon.png";
import twitterIcon from "/images/twitter-icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>EDM HOSTEL</h3>
          <ul>
            <p>
              EDM Hostel in Dharamshala offers a peaceful place with modern
              amenities amidst the spiritual ambiance of the sacred town.
              Comfortable rooms, in house restaurant, and warm hospitality make
              it an ideal choice for pilgrims and tourists seeking a tranquil
              stay near major attractions like the Aghanjar Temple and Triund
              Hill
            </p>
          </ul>
        </div>
        <div className="footer-section contact-us">
          <h3>CONTACT US</h3>
          <ul>
            <li>
              ADDRESS: EDM Hostel, Upper Dharamkot, Dharamshala, HP. 176219
            </li>
            <li>
              PHONE NUMBER: <br></br>+91 8091977846
            </li>
            <li>EMAIL ID : edmhostel@gmail.com</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>WEATHER</h3>
          <h3 className="remove-mb">DHARAMSHALA</h3>
          <p>Rainy</p>
          <p>22°C</p>
        </div>
        <div className="footer-section">
          <h3>MAPS</h3>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="social-icons">
          <a
            href="https://www.facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
          <a
            href="https://www.linkedin.com/company/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
          </a>
          <a
            href="https://twitter.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitterIcon} alt="Twitter" className="social-icon" />
          </a>
        </div>
        <p>© 2024 EDM Hostel</p>
        <div className="footer-links">
          <Link to="/privacy">PRIVACY POLICY</Link>
          <span>WEBSITE BY ----</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
