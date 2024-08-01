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
      <button className="explore-button">EXPLORE</button>
      <img src={image1} alt="Image 1" className="hero-image image1" />
      <img src={image2} alt="Image 2" className="hero-image image2" />
      <img src={image3} alt="Image 3" className="hero-image image3" />
      <img src={image4} alt="Image 4" className="hero-image image4" />
      <img src={image5} alt="Image 5" className="hero-image image5" />
    </div>
  );
};

export default Hero;
