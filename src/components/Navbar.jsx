import React, { useState } from "react";
import "./navbar.css";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-links">
        <a href="#locations">LOCATIONS</a>
        <a href="#about">ABOUT</a>
        <a href="#shop">SHOP</a>
        <a href="#contact">CONTACT</a>
      </div>
      <button className="reserve-button">RESERVE A TABLE</button>
    </nav>
  );
}

export default Navigation;
