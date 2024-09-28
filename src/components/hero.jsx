// import React, { useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import "./hero.css";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const Hero = () => {
//   const videoRef = useRef(null);
//   const videoSectionRef = useRef(null);
//   const parallaxRefs = useRef([]);
//   const heroSectionRef = useRef(null);

//   useEffect(() => {
//     // IntersectionObserver for video play/pause logic
//     const options = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.5,
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           videoRef.current.play();
//           videoSectionRef.current.classList.add("in-view");
//         } else {
//           videoRef.current.pause();
//           videoSectionRef.current.classList.remove("in-view");
//         }
//       });
//     }, options);

//     if (videoSectionRef.current) {
//       observer.observe(videoSectionRef.current);
//     }

//     // GSAP Parallax Effect with Smooth Scrolling on Images
//     const images = parallaxRefs.current;
//     const heroSection = heroSectionRef.current;

//     images.forEach((image, i) => {
//       const depth = (i + 1) * 0.6; // Adjust depth for different speeds

//       gsap.to(image, {
//         y: () => -100 * depth, // Apply parallax effect
//         ease: "power1.out", // Smooth easing effect
//         scrollTrigger: {
//           trigger: heroSection,
//           start: "top top",
//           end: "bottom top",
//           scrub: 0.5, // Smooth scrubbing tied to scroll position
//           invalidateOnRefresh: true,
//         },
//       });
//     });

//     return () => {
//       if (videoSectionRef.current) {
//         observer.unobserve(videoSectionRef.current);
//       }
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, []);

//   const imageLinks = [
//     { path: "/introduction", className: "image1" },
//     { path: "/events", className: "image2" },
//     { path: "/restaurant-and-bar", className: "image3" },
//     { path: "/stays", className: "image4" },
//   ];

//   return (
//     <div className="hero-container">
//       <section className="video-section" ref={videoSectionRef}>
//         <video ref={videoRef} className="reduced-video" loop muted playsInline>
//           <source src="/src/assets/video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <div className="hero-title-overlay">
//           <span>INDIA'S FIRST</span>
//           <br />
//           <span>PARTY HOSTEL</span>
//         </div>
//       </section>
//       <section className="hero" ref={heroSectionRef}>
//         <div className="hero-content">
//           <h1 className="hero-title">
//             <span>EXPLORE</span>
//           </h1>
//         </div>

//         {imageLinks.map((link, index) => (
//           <Link
//             key={link.path}
//             to={link.path}
//             className={`image-container ${link.className}`}
//             ref={(el) => (parallaxRefs.current[index] = el)}
//           />
//         ))}
//       </section>
//     </div>
//   );
// };

// export default Hero;

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./hero.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const parallaxRefs = useRef([]);
  const heroSectionRef = useRef(null);

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

    // GSAP Parallax Effect with Smooth Scrolling on Images
    const images = parallaxRefs.current;
    const heroSection = heroSectionRef.current;

    images.forEach((image, i) => {
      const depth = (i + 1) * 0.5; // Adjust depth for different speeds

      gsap.to(image, {
        y: () => -100 * depth, // Apply parallax effect
        ease: "power1.out", // Smooth easing effect
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Smooth scrubbing tied to scroll position
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      if (videoSectionRef.current) {
        observer.unobserve(videoSectionRef.current);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const imageLinks = [
    { path: "/introduction", className: "image1" },
    { path: "/events", className: "image2" },
    { path: "/restaurant-and-bar", className: "image3" },
    { path: "/stays", className: "image4" },
  ];

  return (
    <div className="hero-container">
      <section className="video-section" ref={videoSectionRef}>
        <video ref={videoRef} className="reduced-video" loop muted playsInline>
          <source src="/src/assets/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-title-overlay">
          <span>INDIA'S FIRST</span>
          <br />
          <span>PARTY HOSTEL</span>
        </div>
      </section>
      <section className="hero" ref={heroSectionRef}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span>EXPLORE</span>
          </h1>
        </div>
        {imageLinks.map((link, index) => (
          <Link
            key={link.path}
            to={link.path}
            className={`image-container ${link.className}`}
            ref={(el) => (parallaxRefs.current[index] = el)}
          >
            <div className="overlay">
              <span className="overlay-text">
                {link.path.replace("/", "").replace("-", " ").toUpperCase()}
              </span>
            </div>
          </Link>
        ))}{" "}
      </section>
    </div>
  );
};

export default Hero;
