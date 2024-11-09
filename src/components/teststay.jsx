import React, { useState, useRef, useEffect } from 'react';
import AccommodationCard from './teststay2';

const AccommodationSelectionPage = () => {
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const bookingFormRef = useRef(null);

  const accommodations = [
    {
      name: 'Male Dormitory',
      image: '/src/assets/male-dorm.jpg',
      pricePerNight: 499,
      maxGuests: 8,
      type: 'dormitory',
      amenities: ['Shared Bathroom', 'Locker', 'Free WiFi', 'Common Area', 'Air Conditioning', 'Bed Linens'],
      availableBeds: 12,
      rules: [
        'Quiet hours 10 PM - 6 AM',
        'No outside guests in dorm',
      ]
    },
    {
      name: 'Mixed Dormitory',
      image: '/src/assets/mixed-dorm.jpg',
      pricePerNight: 549,
      maxGuests: 6,
      type: 'dormitory',
      amenities: ['Shared Bathroom', 'Locker', 'Free WiFi', 'Common Area', 'Air Conditioning', 'Bed Linens'],
      availableBeds: 10,
      rules: [
        'Quiet hours 10 PM - 6 AM',
        'No outside guests in dorm',
      ]
    },
    {
      name: 'Female Dormitory',
      image: '/src/assets/female-dorm.jpg',
      pricePerNight: 499,
      maxGuests: 8,
      type: 'dormitory',
      amenities: ['Shared Bathroom', 'Locker', 'Free WiFi', 'Common Area', 'Air Conditioning', 'Bed Linens'],
      availableBeds: 14,
      rules: [
        'Quiet hours 10 PM - 6 AM',
        'No outside guests in dorm',
      ]
    },
    {
      name: 'Private Room',
      image: '/src/assets/private-room.jpg',
      pricePerNight: 1499,
      maxGuests: 2,
      type: 'private',
      amenities: ['Private Bathroom', 'TV', 'Free WiFi', 'Mini Fridge', 'Air Conditioning', 'Wooden Furniture'],
      availableRooms: 5,
      rules: [
        'No smoking inside the room',
        'No parties or events',
      ]
    },
  ];

  useEffect(() => {
    if (selectedAccommodation && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAccommodation]);

  const handleAccommodationSelect = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setGuests(1);
  };

  const handleGuestsChange = (e) => {
    setGuests(parseInt(e.target.value));
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = selectedAccommodation.type === 'dormitory' 
      ? selectedAccommodation.pricePerNight * guests * nights
      : selectedAccommodation.pricePerNight * nights;
    const taxes = Math.round(basePrice * 0.12);
    const serviceFee = 100;
    return basePrice + taxes + serviceFee;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="events-container">
      <div className="events-heading mt-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Our Accommodations</h1>
        <p className="text-white text-base">Choose from our comfortable dormitories or private rooms</p>
      </div>
      <div className="event-list px-4 md:px-16 mt-8">
        {/* Changed the container layout structure for better responsiveness */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {accommodations.map((accommodation, index) => (
            <AccommodationCard
              key={index}
              accommodation={accommodation}
              onSelect={handleAccommodationSelect}
              isSelected={selectedAccommodation?.name === accommodation.name}
            />
          ))}
        </div>
      </div>
      {selectedAccommodation && (
        <div className="booking-component mt-8 px-4 w-full" ref={bookingFormRef}>
          <h2 className="text-xl font-bold mb-4 text-center text-white">Book "{selectedAccommodation.name}"</h2>
          <div className="booking-form bg-gray-800 shadow-lg rounded-lg p-4 max-w-md mx-auto">
            <div className="form-group mb-4">
              <label className="block text-white font-medium mb-2 text-sm">Check-in Date</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="block w-full border border-gray-500 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-gray-800 text-white text-sm"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-white font-medium mb-2 text-sm">Check-out Date</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="block w-full border border-gray-500 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-gray-800 text-white text-sm"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-white font-medium mb-2 text-sm">Number of Guests</label>
              <select
                className="block w-full border border-gray-500 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-gray-800 text-white text-sm"
                value={guests}
                onChange={handleGuestsChange}
              >
                {Array.from(
                  { length: selectedAccommodation.maxGuests },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="price-summary">
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Price per night:</span>
                <span className="text-blue-500 text-sm">
                  Rs {selectedAccommodation.type === 'dormitory' 
                    ? `${selectedAccommodation.pricePerNight} per person`
                    : selectedAccommodation.pricePerNight}
                </span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Number of nights:</span>
                <span className="text-white text-sm">{calculateNights()}</span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Subtotal:</span>
                <span className="text-white text-sm">
                  Rs {selectedAccommodation.type === 'dormitory'
                    ? selectedAccommodation.pricePerNight * guests * calculateNights()
                    : selectedAccommodation.pricePerNight * calculateNights()}
                </span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Taxes (12%):</span>
                <span className="text-white text-sm">
                  Rs {Math.round((selectedAccommodation.type === 'dormitory'
                    ? selectedAccommodation.pricePerNight * guests * calculateNights()
                    : selectedAccommodation.pricePerNight * calculateNights()) * 0.12)}
                </span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Service fee:</span>
                <span className="text-white text-sm">Rs 100.00</span>
              </div>
              <div className="row total flex justify-between items-center font-bold border-t border-gray-600 mt-2 pt-2">
                <span className="text-white text-sm">Total:</span>
                <span className="text-white text-sm">Rs {calculateTotal()}</span>
              </div>
            </div>
            <button 
              className="book-now-btn bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded w-full mt-4 text-sm"
              disabled={!checkIn || !checkOut || calculateNights() <= 0}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationSelectionPage;