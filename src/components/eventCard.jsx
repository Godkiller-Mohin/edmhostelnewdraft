import React from "react";
import "./eventSelector.css"; // We'll create this file for styling

const EventSelector = () => {
  const events = [
    {
      name: "NEW YORK, NYC",
      image: "src/assets/image2.jpg",
      subtitle: "WELCOME HOME",
    },
    {
      name: "AUSTIN, TX",
      image: "src/assets/image1.jpg",
      subtitle: "CÉAD MÍLE FÁILTE Y",
    },
    {
      name: "WASHINGTON, D.C.",
      image: "src/assets/image3.jpg",
      subtitle: "COMING SOON",
    },
  ];

  return (
    <div className="event-selector">
      <h2>CHOOSE AN EVENT</h2>
      <div className="event-grid">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <a href="#">
              <img src={event.image} alt={event.name} />
            </a>
            <div className="event-info">
              <p className="subtitle">{event.subtitle}</p>
              <h3>{event.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSelector;
