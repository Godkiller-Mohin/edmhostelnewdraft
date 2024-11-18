import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMusic, faUsers } from "@fortawesome/free-solid-svg-icons";
import ApiService from "../api/apiService"; // Backend service to make API requests
import "./events.css";

const EventCard = ({ event, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`event-card ${isFlipped ? "flipped" : ""}`} onClick={handleCardClick}>
      <div className="event-front">
        <img src={event.image} alt={event.name} className="event-image" />
        <div className="event-overlay">
          <button className="select-btn" onClick={(e) => { e.stopPropagation(); onSelect(event); }}>
            Select
          </button>
        </div>
      </div>
      <div className="event-back">
        <div className="event-details">
          <h3 className="event-name">{event.name}</h3>
          <div className="event-info">
            <div className="event-date">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{event.date}</span>
            </div>
            <div className="event-genre">
              <FontAwesomeIcon icon={faMusic} />
              <span>{event.genre}</span>
            </div>
          </div>
          <div className="event-pricing">
            <div className="event-price">
              <span>Price per Ticket</span>
              <strong>Rs {event.price}</strong>
            </div>
            <div className="event-capacity">
              <FontAwesomeIcon icon={faUsers} />
              <span>{event.maxAttendees} Capacity</span>
            </div>
          </div>
          <button className="select-btn" onClick={(e) => { e.stopPropagation(); onSelect(event); }}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [guests, setGuests] = useState(1);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ApiService.get('/api/event/list');  // Call backend to fetch events
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setGuests(1);
  };

  const handleGuestsChange = (e) => {
    setGuests(parseInt(e.target.value));
  };

  return (
    <div className="events-container">
      <h1 className="events-heading">Upcoming Events</h1>
      <p className="events-subheading">
        Explore our upcoming events and book your tickets now!
      </p>
      <div className="event-list">
        {events.map((event, index) => (
          <EventCard key={index} event={event} onSelect={handleEventSelect} />
        ))}
      </div>
      <div className="booking-component">
        <h2>Book This Event</h2>
        <div className="booking-form">
          <div className="form-group">
            <label>Number of Tickets</label>
            <select value={guests} onChange={handleGuestsChange}>
              {Array.from(
                { length: Math.min(10, selectedEvent?.maxAttendees || 1) },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num} Ticket{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="price-summary">
            <div className="row">
              <span>Price per ticket:</span>
              <span>Rs {selectedEvent?.price || 0}</span>
            </div>
            <div className="row">
              <span>Number of tickets:</span>
              <span>{guests}</span>
            </div>
            <div className="row">
              <span>Subtotal:</span>
              <span>Rs {(selectedEvent?.price || 0) * guests}</span>
            </div>
            <div className="row">
              <span>Taxes:</span>
              <span>Rs 50.00</span>
            </div>
            <div className="row">
              <span>Booking fee:</span>
              <span>Rs 25.00</span>
            </div>
            <div className="row total">
              <span>Total:</span>
              <span>Rs {(selectedEvent?.price || 0) * guests + 75}</span>
            </div>
          </div>
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Events;
