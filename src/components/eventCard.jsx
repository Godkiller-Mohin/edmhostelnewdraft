import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./eventSelector.css";

const EventSelector = () => {
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

  const events = [
    {
      id: 1,
      name: "NEW YORK, NYC",
      image: "src/assets/image2.jpg",
      subtitle: "WELCOME HOME",
    },
    {
      id: 2,
      name: "AUSTIN, TX",
      image: "src/assets/image1.jpg",
      subtitle: "CÉAD MÍLE FÁILTE Y",
    },
    {
      id: 3,
      name: "WASHINGTON, D.C.",
      image: "src/assets/image3.jpg",
      subtitle: "COMING SOON",
    },
  ];
  return (
    <div className="event-selector" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          EVENTS
        </h2>
        <h2 className="main-heading">CHOOSE AN EVENT</h2>
      </div>
      <div className="event-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <Link to={`/event/${event.id}`}>
              <img src={event.image} alt={event.name} />
              <div className="event-info">
                <p className="subtitle">{event.subtitle}</p>
                <h3>{event.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSelector;
