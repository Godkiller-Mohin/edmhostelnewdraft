import React, { useState, useRef, useEffect } from "react";
import ApiService from "../api/apiService";
import AccommodationCard from "./teststay2";
import { Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faReceipt,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

const AccommodationSelectionPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const bookingFormRef = useRef(null);
  const pageTopRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (guests <= 0 || calculateNights() <= 0) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const response = await ApiService.post(
        "/api/booking/placed-booking-order/:id",
        {
          roomId: selectedAccommodation.room_id,
          checkIn,
          checkOut,
          guests,
          totalAmount: calculateTotal(),
          customerDetails: {
            name: "John Doe",
            email: "johndoe@example.com",
          },
        }
      );

      alert(response.data.message);
      setSelectedAccommodation(null);
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      // Scroll back to top after successful booking
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setBookingError("Failed to submit the booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          :root {
            --theme-color: #1B3936;
            --theme-color-light: #264D49;
            --theme-color-lighter: #31615C;
            --theme-color-hover: #152E2B;
          }
          
          .booking-card {
            perspective: 1000px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(27, 57, 54, 0.1), 0 2px 4px -1px rgba(27, 57, 54, 0.06);
            transition: transform 0.3s ease;
          }
          .booking-card:hover {
            transform: scale(1.02);
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background-color: rgba(27, 57, 54, 0.05);
            border-radius: 8px;
            transition: background-color 0.2s ease;
          }
          .info-item:hover {
            background-color: rgba(27, 57, 54, 0.08);
          }
          .icon {
            width: 1.25rem;
            height: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--theme-color);
          }
          .theme-button {
            background-color: var(--theme-color);
            transition: background-color 0.2s ease;
          }
          .theme-button:hover:not(:disabled) {
            background-color: var(--theme-color-hover);
          }
          .theme-gradient {
            background: linear-gradient(to bottom, var(--theme-color), var(--theme-color-light));
          }
          .theme-text {
            color: var(--theme-color);
          }
          .theme-border:focus {
            border-color: var(--theme-color);
            box-shadow: 0 0 0 2px rgba(27, 57, 54, 0.2);
          }
        `}
      </style>

      <div className="w-full px-4 py-24" ref={pageTopRef}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            Our Accommodations
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin theme-text" />
            </div>
          ) : accommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((accommodation, index) => (
                <AccommodationCard
                  key={index}
                  accommodation={accommodation}
                  onSelect={handleAccommodationSelect}
                  isSelected={
                    selectedAccommodation?.room_name === accommodation.room_name
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No accommodations available at this time.
              </p>
            </div>
          )}

          {selectedAccommodation && (
            <div ref={bookingFormRef} className="mt-16 max-w-lg mx-auto">
              <div className="booking-card bg-white">
                <div className="theme-gradient py-6 px-6">
                  <h2 className="text-2xl font-bold text-white">
                    Book "{selectedAccommodation.room_name}"
                  </h2>
                </div>

                <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg theme-border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          min={checkIn || today}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg theme-border focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">
                      Number of Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-lg theme-border focus:outline-none"
                    >
                      {Array.from(
                        { length: selectedAccommodation.room_capacity },
                        (_, i) => i + 1
                      ).map((guest) => (
                        <option key={guest} value={guest}>
                          {guest} {guest > 1 ? "Guests" : "Guest"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="info-item">
                      <span className="icon">
                        <FontAwesomeIcon icon={faCreditCard} />
                      </span>
                      <span className="text-gray-700">
                        Price per night: ₹{selectedAccommodation.room_price}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="icon">
                        <FontAwesomeIcon icon={faTag} />
                      </span>
                      <span className="text-gray-700">
                        Number of nights: {calculateNights()}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="icon">
                        <FontAwesomeIcon icon={faReceipt} />
                      </span>
                      <span className="text-gray-700">
                        Taxes (12%): ₹
                        {Math.round(
                          selectedAccommodation.room_price *
                            calculateNights() *
                            guests *
                            0.12
                        )}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="icon">
                        <FontAwesomeIcon icon={faReceipt} />
                      </span>
                      <span className="text-gray-700">Service Fee: ₹100</span>
                    </div>

                    <div
                      className="mt-4 p-4 rounded-lg"
                      style={{ backgroundColor: "rgba(27, 57, 54, 0.05)" }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-xl font-bold theme-text">
                          ₹{calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">{bookingError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      guests <= 0 || calculateNights() <= 0 || isSubmitting
                    }
                    className="theme-button w-full py-4 px-6 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Booking...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccommodationSelectionPage;
