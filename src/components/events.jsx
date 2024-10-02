import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUsers } from "@fortawesome/free-solid-svg-icons";
import "./events.css";

// EventCard component integrated directly into the file
const EventCard = ({ event, onSelect }) => {
  return (
    <div className="event-card">
      <img src={event.image} alt={event.name} className="event-image" />
      <div className="event-details">
        <div className="event-date">
          <FontAwesomeIcon icon={faCalendar} />
          <span>{event.date}</span>
        </div>
        <div className="event-price">
          <span>Price per Ticket</span>
          <strong>Rs {event.price}</strong>
        </div>
        <button className="select-btn" onClick={() => onSelect(event)}>
          Select
        </button>
      </div>
    </div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const events = [
    {
      name: "Summer Music Festival",
      image: "../src/assets/events.jpg",
      price: 599,
      date: "29-09-2024",
      maxAttendees: 1000,
    },
    {
      name: "Tech Conference",
      image: "../src/assets/events.jpg",
      price: 799,
      date: "15-10-2024",
      maxAttendees: 500,
    },
    {
      name: "Food and Wine Expo",
      image: "../src/assets/events.jpg",
      price: 399,
      date: "05-11-2024",
      maxAttendees: 750,
    },
    // Add more events as needed
  ];

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setGuests(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGuestsChange = (e) => {
    setGuests(parseInt(e.target.value));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="events-container">
        <div className="event-list">
          {events.map((event, index) => (
            <EventCard key={index} event={event} onSelect={handleEventSelect} />
          ))}
        </div>
        <div className="booking-component">
          <h2>Book This Event</h2>
          <div className="booking-form">
            <div className="form-group">
              <label>Select Date</label>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
                className="date-picker"
                minDate={dayjs()}
                disablePast
              />
            </div>
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
    </LocalizationProvider>
  );
};

export default Events;
