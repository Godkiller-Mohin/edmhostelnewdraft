import React from "react";
import "./navbar.css";
import logoImage from "../assets/logo.png";

function Navigation() {
  return (
    <nav
      className="navigation"
      data-scroll
      data-scroll-sticky
      data-scroll-target=".App"
    >
      <div className="logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <div className="nav-links">
        <a href="#locations">LOCATIONS</a>
        <a href="#about">ABOUT</a>
        <a href="#shop">SHOP</a>
        <a href="#contact">CONTACT</a>
        <button className="reserve-button">RESERVE A TABLE</button>
      </div>
    </nav>
  );
}

export default Navigation;
