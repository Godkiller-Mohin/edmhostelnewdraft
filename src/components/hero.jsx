import React, { useEffect, useRef } from "react";
import "./hero.css";
import VerticalSocialBar from "./verticalSocialBar";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import Navigation from "./Navbar";

const Hero = () => {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const parallaxRefs = useRef([]);
  const socialBarRef = useRef(null);
  const scrollContainerRef = useRef(null);

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
          socialBarRef.current.classList.remove("hidden");
        } else {
          videoRef.current.pause();
          videoSectionRef.current.classList.remove("in-view");
          socialBarRef.current.classList.add("hidden");
        }
      });
    }, options);

    if (videoSectionRef.current) {
      observer.observe(videoSectionRef.current);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((el) => {
        const speed = 0.1;
        const yOffset = scrollY * speed;
        el.style.transform = `translateY(-${yOffset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (videoSectionRef.current) {
        observer.unobserve(videoSectionRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      }}
      watch={[]}
      containerRef={scrollContainerRef}
    >
      <div
        className="hero-container"
        data-scroll-container
        ref={scrollContainerRef}
      >
        {/* <Navigation /> */}
        <section className="video-section" ref={videoSectionRef}>
          <video
            ref={videoRef}
            className="reduced-video"
            loop
            muted
            playsInline
          >
            <source src="/src/assets/video.mp4" />
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
              <span>EXPLORE</span>
            </h1>
          </div>

          <div
            className="image-container image1"
            ref={(el) => (parallaxRefs.current[0] = el)}
          ></div>
          <div
            className="image-container image2"
            ref={(el) => (parallaxRefs.current[1] = el)}
          ></div>
          <div
            className="image-container image3"
            ref={(el) => (parallaxRefs.current[2] = el)}
          ></div>
          <div
            className="image-container image4"
            ref={(el) => (parallaxRefs.current[3] = el)}
          ></div>
          <div
            className="image-container image5"
            ref={(el) => (parallaxRefs.current[4] = el)}
          ></div>
        </section>
      </div>
    </LocomotiveScrollProvider>
  );
};

export default Hero;
