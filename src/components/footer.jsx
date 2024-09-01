import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import facebookIcon from "../assets/facebook-icon.png";
import instagramIcon from "../assets/instagram-icon.png";
import linkedinIcon from "../assets/linkedin-icon.png";
import twitterIcon from "../assets/twitter-icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>NEW YORK, NYC</h3>
          <ul>
            <li>
              <Link to="/austin">AUSTIN, TX</Link>
            </li>
            <li>
              <Link to="/washington">WASHINGTON, D.C.</Link>
            </li>
            <li>
              <Link to="/about">ABOUT US</Link>
            </li>
            <li>
              <Link to="/story">OUR STORY</Link>
            </li>
            <li>
              <Link to="/ny-menus">NEW YORK MENUS</Link>
            </li>
            <li>
              <Link to="/austin-menu">AUSTIN MENU</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>THAT'S DEADLY</h3>
          <ul>
            <li>
              <Link to="/awards">AWARDS & PRESS</Link>
            </li>
            <li>
              <Link to="/careers">CAREERS</Link>
            </li>
            <li>
              <Link to="/shop">MERCHANDISE SHOP</Link>
            </li>
            <li>
              <Link to="/gift-cards">GIFT CARDS - US</Link>
            </li>
            <li>
              <Link to="/wellness">WELLNESS</Link>
            </li>
            <li>
              <Link to="/artists">ARTISTS</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>NEW YORK</h3>
          <h4>THE PARLOR</h4>
          <p>TUE - SAT | 5PM - 1AM</p>
          <p>SUN | 4PM - 12AM</p>
          <h4>THE TAPROOM</h4>
          <p>SUN - THU | 11AM - 2AM</p>
          <p>FRI - SAT | 11AM - 3AM</p>
        </div>
        <div className="footer-section">
          <h3>AUSTIN, TX</h3>
          <h4>THE TAPROOM</h4>
          <p>MONDAY - SUNDAY | 11AM - 2AM</p>
          <h4>NEIGHBOURHOOD</h4>
          <p>MON - SUN | 7AM - 4PM</p>
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
        <p>COPYRIGHT THE DEAD RABBIT 2024</p>
        <div className="footer-links">
          <Link to="/privacy">PRIVACY POLICY</Link>
          <span>WEBSITE BY CROWN CREATIVE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
