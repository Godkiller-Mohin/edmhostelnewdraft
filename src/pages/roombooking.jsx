import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from "../api/apiService";
import './room.css';

const RoomBooking = () => {
  const { roomId } = useParams(); // Get roomId from the URL parameters
  const navigate = useNavigate(); // For redirection
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
  });
  const [responseMessage, setResponseMessage] = useState(''); // State to store response message
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(''); // Clear previous messages
    setErrorMessage('');
  
    try {
      // Retrieve the token from local storage or any other secure place
      const token = localStorage.getItem('authToken'); // Replace with your token retrieval method
  
      // Include the Authorization header with the token
      const response = await ApiService.post(`/api/booking/placed-booking-order/${roomId}`, {
        ...bookingDetails,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the token here
        },
      });
  
      if (response.data && response.data.success) {
        // Redirect to the payment page, passing the booking ID or other details if necessary
        navigate(`/payment/${response.data.bookingId}`); // Assuming response contains a booking ID
      } else {
        setErrorMessage('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking room:', error);
      setErrorMessage('Failed to book the room. Please try again later.');
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

      {/* Display success or error messages */}
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RoomBooking;
