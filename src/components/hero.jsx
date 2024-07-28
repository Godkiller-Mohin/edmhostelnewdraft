import React from "react";
import "./hero.css";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";

const Hero = () => {
  return (
    <div className="hero">
      <h1 className="hero-title">
        INDIA'S FIRST
        <br />
        PARTY
        <br />
        HOSTEL
      </h1>
      <div className="image-grid">
        <div
          className="grid-image"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
        <div
          className="grid-image"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
        <div
          className="grid-image"
          style={{ backgroundImage: `url(${image3})` }}
        ></div>
        <div
          className="grid-image"
          style={{ backgroundImage: `url(${image4})` }}
        ></div>
        <div
          className="grid-image"
          style={{ backgroundImage: `url(${image5})` }}
        ></div>
      </div>
      <button className="explore-button">EXPLORE</button>
    </div>
  );
};

export default Hero;
