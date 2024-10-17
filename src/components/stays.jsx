import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChild } from "@fortawesome/free-solid-svg-icons";
import "./stays.css";

const Stays = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const roomTypes = [
    {
      name: "Mixed Dorm",
      image: "/images/mixed-dorm.jpeg",
      price: 599,
      maxAdults: 2,
      maxChildren: 0,
      type: "dorm",
    },
    {
      name: "Female Dorm 6 Bedded",
      image: "/images/mixed-dorm.jpeg",
      price: 129.99,
      maxAdults: 6,
      maxChildren: 0,
      type: "dorm",
    },
    {
      name: "Male Dorm 6 Bedded",
      image: "/images/mixed-dorm.jpeg",
      price: 129.99,
      maxAdults: 6,
      maxChildren: 0,
      type: "dorm",
    },
    {
      name: "Private Room Small",
      image: "/images/mixed-dorm.jpeg",
      price: 249.99,
      maxAdults: 2,
      maxChildren: 1,
      type: "private",
    },
    {
      name: "Private Room Big",
      image: "/images/mixed-dorm.jpeg",
      price: 349.99,
      maxAdults: 4,
      maxChildren: 2,
      type: "private",
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

  const renderRoomCard = (room) => (
    <div key={room.name} className="room-card">
      <img src={room.image} alt={room.name} />
      <div className="room-info">
        <h3>{room.name}</h3>
        <div className="room-capacity">
          <span>
            <FontAwesomeIcon icon={faUser} /> Max adults: {room.maxAdults}
          </span>
          <span>
            <FontAwesomeIcon icon={faChild} /> Max children: {room.maxChildren}
          </span>
        </div>
        <div className="room-price">
          <p>Prices From</p>
          <p className="price">Rs {room.price}</p>
        </div>
        <button className="select-btn" onClick={() => handleRoomSelect(room)}>
          Select
        </button>
      </div>
    </div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="stays-container">
        <div className="room-types">
          <div className="room-category">
            <h1>Dorms</h1>
            <div className="room-grid">
              {roomTypes
                .filter((room) => room.type === "dorm")
                .map(renderRoomCard)}
            </div>
          </div>
          <div className="room-category">
            <h1>Private Rooms</h1>
            <div className="room-grid">
              {roomTypes
                .filter((room) => room.type === "private")
                .map(renderRoomCard)}
            </div>
          </div>
        </div>
        <div className="booking-component">
          <h2>Book This Room</h2>
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
                <span>₹{selectedRoom?.price || 0}</span>
              </div>
              <div className="row">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="row">
                <span>Subtotal:</span>
                <span>₹{(selectedRoom?.price || 0) * guests}</span>
              </div>
              <div className="row">
                <span>Taxes:</span>
                <span>₹15.00</span>
              </div>
              <div className="row">
                <span>Fees:</span>
                <span>₹10.00</span>
              </div>
              <div className="row total">
                <span>Total:</span>
                <span>₹{(selectedRoom?.price || 0) * guests + 15 + 10}</span>
              </div>
            </div>
            <button className="book-now-btn">Book Now</button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Stays;
