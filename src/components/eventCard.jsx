import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ApiService from "../api/apiService";
import "./eventSelector.css";

const EventSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [events, setEvents] = useState([]); // State to hold events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch events from the backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ApiService.get("/api/event/list"); // Fetch events from the backend
        const fetchedEvents = response.data?.result?.data?.rows || []; // Access events from the response
        setEvents(fetchedEvents); // Update the state with event data
        setLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Scroll effect for background text
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

  // Move background text based on scroll progress
  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText && typeof scrollProgress === "number") {
      const xPosition = (scrollProgress - 0.5) * 200; // Adjust multiplier for speed
      backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;
    }
  }, [scrollProgress]);

  return (
    <div className="event-selector" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          EVENTS
        </h2>
        <h2 className="main-heading">CHOOSE AN EVENT</h2>
      </div>
      <div className="event-grid">
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>{error}</p>
        ) : events.length === 0 ? (
          <p>No events available</p>
        ) : (
          events.map((event) => {
            // Extract the image URL (splitting on '||' if necessary)
            const eventImage = event.event_images?.[0]?.url.split("||")[0].trim();

            return (
              <div key={event.id} className="event-card">
                <Link to={`/event/${event.id}`}>
                  <img src={eventImage} alt={event.event_name} />
                  <div className="event-info">
                    <p className="subtitle">{event.event_type}</p>
                    <h3>{event.event_name}</h3>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventSelector;
