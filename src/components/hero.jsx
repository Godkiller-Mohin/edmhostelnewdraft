import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./hero.css"
const Hero = () => {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const welcomeOverlayRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    const welcomePlayed = sessionStorage.getItem("welcomeAnimationPlayed");

    if (!welcomePlayed) {
      const welcomeOverlay = document.createElement("div");
      welcomeOverlayRef.current = welcomeOverlay;
      welcomeOverlay.classList.add("welcome-overlay");
      const welcomeText = document.createElement("div");
      welcomeText.classList.add("welcome-text");
      welcomeText.textContent = "WELCOME TO EDM HOSTEL";
      welcomeOverlay.appendChild(welcomeText);
      document.body.appendChild(welcomeOverlay);

      setTimeout(() => {
        welcomeOverlay.remove();
        sessionStorage.setItem("welcomeAnimationPlayed", "true");
      }, 5000);

      return () => {
        if (welcomeOverlayRef.current) {
          welcomeOverlayRef.current.remove();
        }
      };
    } else {
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer) {
        heroContainer.style.animation = 'none';
        heroContainer.style.opacity = '1';
      }
      const videoSection = document.querySelector('.video-section');
      if (videoSection) {
        videoSection.classList.add('in-view');
      }
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  }, []);

  const imageLinks = [
    { path: "/test", className: "image1" },
    { path: "/test", className: "image2" },
    { path: "/test", className: "image3" },
    { path: "/test", className: "image4" },
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
      <section className="hero" id="events">
        <div className="hero-content">
          <h1 className="hero-title">
            <span>EVENTS</span>
          </h1>
        </div>
        <div className="events-grid">
          {imageLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`image-container ${link.className}`}
            >
              <div className="overlay">
                <span className="overlay-text">RESERVE YOUR SPOT</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;