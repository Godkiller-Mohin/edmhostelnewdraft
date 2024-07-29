import React, { useState } from "react";
import "./navbar.css";

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo"></div>
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
