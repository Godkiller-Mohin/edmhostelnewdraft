import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './room.css'

const RoomBooking = () => {
  const { roomId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
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
        roomId,
      });
      alert('Booking Successful');
    } catch (error) {
      console.error('Error booking room:', error);
      alert('Failed to book the room');
    }
  };

  return (
    <div className="room-booking">
      <h2>Book This Room</h2>
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
          <label>Check-in Date:</label>
          <input type="date" name="checkInDate" value={bookingDetails.checkInDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Check-out Date:</label>
          <input type="date" name="checkOutDate" value={bookingDetails.checkOutDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Number of Guests:</label>
          <input type="number" name="guests" value={bookingDetails.guests} onChange={handleInputChange} min="1" required />
        </div>
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default RoomBooking;
