import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./accommodationSelector.css";
import ApiService from "../api/apiService";

const AccommodationSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await ApiService.get("/api/room/all-rooms-list");
    
        // Check if response has 'result' and 'data' properties
        if (response && response.result && response.result.data) {
    
          // Access rows array from result.data
          const rows = response.result.data.rows;
    
          // Check if the response contains valid rows
          if (Array.isArray(rows)) {
            setAccommodations(rows); // Set the rows array to state
          } else {
            setAccommodations([]); // Ensure we handle this case
          }
        } else {
          setAccommodations([]); // Ensure we handle this case
        }
      } catch (error) {
        setAccommodations([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };
    
    
    

    fetchAccommodations();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;

        let progress =
          (viewportHeight - rect.top) / (viewportHeight + elementHeight);
        progress = Math.min(Math.max(progress, 0), 1);

        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText) {
      const xPosition = (scrollProgress - 0.5) * 200;
      backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;

      const viewportWidth = window.innerWidth;
      const fontSize = Math.min(150, viewportWidth * 0.2);
      backgroundText.style.fontSize = `${fontSize}px`;
    }
  }, [scrollProgress]);

  return (
    <div className="accommodation-selector" ref={sectionRef} id="stay">
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          STAYS
        </h2>
        <h2 className="main-heading">CHOOSE YOUR STAY</h2>
      </div>
      <div className="accommodation-grid">
        {isLoading ? (
          <p>Loading accommodations...</p>
        ) : accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <div key={accommodation.id} className="accommodation-card">
              <Link to={`/teststay`}>
                <div className="image-container-accod">
                  <img
                    src={accommodation.room_images?.[0]?.url?.split(" || ")[0] || "/default-image.jpg"} // Fallback image
                    alt={accommodation.room_name}
                    loading="lazy" // Improve performance
                  />
                </div>
                <div className="accommodation-info">
                  <p className="subtitle">{accommodation.room_description}</p>
                  <h3>{accommodation.room_name}</h3>
                  <p>Price: ₹{accommodation.room_price}</p>
                  <p>Capacity: {accommodation.room_capacity} people</p>
                  <p>Room Type: {accommodation.room_type}</p>
                  <ul>
                    {accommodation.extra_facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No accommodations available.</p>
        )}
      </div>
    </div>
  );
};

export default AccommodationSelector;
