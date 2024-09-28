import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './event.css'; // Assuming you'll use this for event-specific styling

const EventBooking = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    eventDate: '',
    numberOfTickets: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/bookings`, {
        ...bookingDetails,
        eventId,
      });
      alert('Booking Successful');
    } catch (error) {
      console.error('Error booking event:', error);
      alert('Failed to book the event');
    }
  };

  return (
    <div className="event-booking">
      <h2>Book This Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={bookingDetails.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={bookingDetails.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Event Date:</label>
          <input type="date" name="eventDate" value={bookingDetails.eventDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Number of Tickets:</label>
          <input type="number" name="numberOfTickets" value={bookingDetails.numberOfTickets} onChange={handleInputChange} min="1" required />
        </div>
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default EventBooking;
