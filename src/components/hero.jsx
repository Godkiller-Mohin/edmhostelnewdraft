import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./hero.css";

const Hero = () => {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver for video play/pause logic
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
          videoSectionRef.current.classList.add("in-view");
        } else {
          videoRef.current.pause();
          videoSectionRef.current.classList.remove("in-view");
        }
      });
    }, options);

    if (videoSectionRef.current) {
      observer.observe(videoSectionRef.current);
    }

    return () => {
      if (videoSectionRef.current) {
        observer.unobserve(videoSectionRef.current);
      }
    };
  }, []);

  const imageLinks = [
    { path: "/events", className: "image1" },
    { path: "/events", className: "image2" },
    { path: "/events", className: "image3" },
    { path: "/events", className: "image4" },
  ];

  return (
    <div className="hero-container">
      <section className="video-section" ref={videoSectionRef}>
        <video ref={videoRef} className="reduced-video" loop muted playsInline>
          <source src="/videos/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-title-overlay">
          <span>INDIA'S FIRST</span>
          <br />
          <span>PARTY HOSTEL</span>
        </div>
      </section>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span>EVENTS</span>
          </h1>
        </div>
        {imageLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`image-container ${link.className}`}
          >
            <div className="overlay">
              <span className="overlay-text">
                {link.path.replace("/", "").replace("-", " ").toUpperCase()}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Hero;
