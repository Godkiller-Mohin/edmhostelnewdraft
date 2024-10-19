import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./accommodationSelector.css";

const AccommodationSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;

        // Calculate scroll progress
        let progress =
          (viewportHeight - rect.top) / (viewportHeight + elementHeight);
        progress = Math.min(Math.max(progress, 0), 1);

        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText) {
      const xPosition = (scrollProgress - 0.5) * 200; // Adjust multiplier for speed
      backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;
    }
  }, [scrollProgress]);

  const accommodations = [
    {
      id: 1,
      name: "PRIVATE ROOM",
      image: "/images/private-room.jpeg",
      subtitle: "COMFORT AND PRIVACY",
    },
    {
      id: 2,
      name: "FEMALE DORMITORY",
      image: "/images/female-dorm.jpeg",
      subtitle: "LADIES ONLY",
    },
    {
      id: 3,
      name: "MIXED DORMITORY",
      image: "/images/mixed-dorm.jpeg",
      subtitle: "SOCIAL AND AFFORDABLE",
    },
  ];

  return (
    <div className="accommodation-selector" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          STAYS
        </h2>
        <h2 className="main-heading">CHOOSE YOUR STAY</h2>
      </div>
      <div className="accommodation-grid">
        {accommodations.map((accommodation) => (
          <div key={accommodation.id} className="accommodation-card">
            <Link to={`/stays`}>
              <img src={accommodation.image} alt={accommodation.name} />
              <div className="accommodation-info">
                <p className="subtitle">{accommodation.subtitle}</p>
                <h3>{accommodation.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationSelector;
