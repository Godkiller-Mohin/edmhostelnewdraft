import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./stays.css";

const Stays = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const roomTypes = [
    {
      name: "Mixed Dorm",
      image: "../src/assets/mixed-dorm.jpeg",
      price: 149.99,
      maxAdults: 8,
    },
    {
      name: "Female Dorm 6 Bedded",
      image: "../src/assets/mixed-dorm.jpeg",
      price: 129.99,
      maxAdults: 6,
    },
    {
      name: "Male Dorm 6 Bedded",
      image: "../src/assets/mixed-dorm.jpeg",
      price: 129.99,
      maxAdults: 6,
    },
    {
      name: "Private Room Small",
      image: "../src/assets/mixed-dorm.jpeg",
      price: 249.99,
      maxAdults: 2,
    },
    {
      name: "Private Room Big",
      image: "../src/assets/mixed-dorm.jpeg",
      price: 349.99,
      maxAdults: 4,
    },
  ];

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setGuests(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGuestsChange = (e) => {
    setGuests(parseInt(e.target.value));
  };

  return (
    <div className="stays-container">
      <div className="room-types">
        {roomTypes.map((room, index) => (
          <div
            key={index}
            className={`room-card ${
              selectedRoom?.name === room.name ? "selected" : ""
            }`}
            onClick={() => handleRoomSelect(room)}
          >
            <img src={room.image} alt={room.name} />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>Price: ${room.price}</p>
              <p>Max Adults: {room.maxAdults}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="booking-component">
        <h2>Book This Room</h2>
        <div className="booking-form">
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="date-picker"
            />
          </div>
          <div className="form-group">
            <label>Guests</label>
            <select value={guests} onChange={handleGuestsChange}>
              {Array.from(
                { length: selectedRoom?.maxAdults || 1 },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="price-summary">
            <div className="row">
              <span>Price per person:</span>
              <span>${selectedRoom?.price || 149.99}</span>
            </div>
            <div className="row">
              <span>Guests:</span>
              <span>{guests}</span>
            </div>
            <div className="row">
              <span>Subtotal:</span>
              <span>${(selectedRoom?.price || 149.99) * guests}</span>
            </div>
            <div className="row">
              <span>Taxes:</span>
              <span>$15.00</span>
            </div>
            <div className="row">
              <span>Fees:</span>
              <span>$10.00</span>
            </div>
            <div className="row total">
              <span>Total:</span>
              <span>${(selectedRoom?.price || 149.99) * guests + 15 + 10}</span>
            </div>
          </div>
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Stays;
