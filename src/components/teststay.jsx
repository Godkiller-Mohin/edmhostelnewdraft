import React, { useState, useRef, useEffect } from "react";
import ApiService from "../api/apiService";
import AccommodationCard from "./teststay2";

const AccommodationSelectionPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const bookingFormRef = useRef(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await ApiService.get("/api/room/all-rooms-list");

        if (response && response.result && response.result.data) {
          setAccommodations(response.result.data.rows || []);
        } else {
          setAccommodations([]);
        }
      } catch (error) {
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  useEffect(() => {
    if (selectedAccommodation && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedAccommodation]);

  const handleAccommodationSelect = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setGuests(1);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = selectedAccommodation?.room_price * nights * guests;
    const taxes = Math.round(basePrice * 0.12);
    const serviceFee = 100;
    return basePrice + taxes + serviceFee;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="accommodation-container">
      <h1 className="text-4xl font-bold text-center mt-8 mb-4">Our Accommodations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {isLoading ? (
          <p>Loading accommodations...</p>
        ) : accommodations.length > 0 ? (
          accommodations.map((accommodation, index) => (
            <AccommodationCard
              key={index}
              accommodation={accommodation}
              onSelect={handleAccommodationSelect}
              isSelected={selectedAccommodation?.room_name === accommodation.room_name}
            />
          ))
        ) : (
          <p>No accommodations available.</p>
        )}
      </div>
      {selectedAccommodation && (
        <div ref={bookingFormRef} className="booking-form mt-8">
          <h2 className="text-center font-bold text-xl mb-4">
            Book "{selectedAccommodation.room_name}"
          </h2>
          <form className="bg-gray-800 text-white p-4 rounded-lg max-w-md mx-auto">
            <label>Check-in Date:</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <label>Check-out Date:</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <label>Guests:</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: selectedAccommodation.room_capacity }, (_, i) => i + 1).map(
                (guest) => (
                  <option key={guest} value={guest}>
                    {guest} {guest > 1 ? "Guests" : "Guest"}
                  </option>
                )
              )}
            </select>
            <div>
              <p>Price per night: ₹{selectedAccommodation.room_price}</p>
              <p>Number of nights: {calculateNights()}</p>
              <p>Taxes: ₹{Math.round(selectedAccommodation.room_price * 0.12)}</p>
              <p>Service Fee: ₹100</p>
              <p>Total: ₹{calculateTotal()}</p>
            </div>
            <button type="submit" disabled={!checkIn || !checkOut || calculateNights() <= 0}>
              Book Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccommodationSelectionPage;
