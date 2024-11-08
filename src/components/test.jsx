import React, { useState, useRef, useEffect } from 'react';
import EventCard from './test2';

const EventSelectionPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [guests, setGuests] = useState(1);
  const bookingFormRef = useRef(null);

  const events = [
    {
      name: 'Summer Music Festival',
      image: '/images/events.jpg',
      price: 599,
      date: '29-09-2024',
      time: '7:00 PM - 11:00 PM',
      maxAttendees: 1000,
      genre: 'Psytrance',
      performers: ['Artist A', 'Artist B', 'Artist C'],
    },
    {
      name: 'Tech Conference',
      image: '/images/events.jpg',
      price: 799,
      date: '15-10-2024',
      time: '9:00 AM - 5:00 PM',
      maxAttendees: 500,
      genre: 'EDM',
      performers: ['Speaker X', 'Speaker Y', 'Speaker Z'],
    },
    {
      name: 'Food and Wine Expo',
      image: '/images/events.jpg',
      price: 399,
      date: '05-11-2024',
      time: '11:00 AM - 7:00 PM',
      maxAttendees: 750,
      genre: 'Live Music',
      performers: ['Chef A', 'Chef B', 'Sommelier C'],
    },
    {
      name: 'Food and Wine Expo',
      image: '/images/events.jpg',
      price: 399,
      date: '05-11-2024',
      time: '11:00 AM - 7:00 PM',
      maxAttendees: 750,
      genre: 'Live Music',
      performers: ['Chef A', 'Chef B', 'Sommelier C'],
    },
  ];

  useEffect(() => {
    if (selectedEvent && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setGuests(1);
  };

  const handleGuestsChange = (e) => {
    setGuests(parseInt(e.target.value));
  };

  return (
    <div className="events-container">
      <div className="events-heading mt-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">Upcoming Events</h1>
        <p className="text-white text-base">
          Explore our upcoming events and book your tickets now!
        </p>
      </div>
      <div className="event-list flex flex-wrap justify-center -mx-2 mt-8">
        {events.map((event, index) => (
          <EventCard key={index} event={event} onSelect={handleEventSelect} isSelected={selectedEvent?.name === event.name} />
        ))}
      </div>
      {selectedEvent && (
        <div className="booking-component mt-8 px-4 w-full" ref={bookingFormRef}>
          <h2 className="text-xl font-bold mb-4 text-center">Book "{selectedEvent.name}"</h2>
          <div className="booking-form bg-gray-800 shadow-lg rounded-lg p-4 max-w-md mx-auto">
            <div className="form-group mb-4">
              <label className="block text-white font-medium mb-2 text-sm">Number of Tickets</label>
              <select
                className="block w-full border border-gray-500 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 bg-gray-800 text-white text-sm"
                value={guests}
                onChange={handleGuestsChange}
              >
                {Array.from({ length: Math.min(10, selectedEvent?.maxAttendees || 1) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} Ticket{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="price-summary">
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Price per ticket:</span>
                <span className="text-blue-500 text-sm">Rs {selectedEvent?.price || 0}</span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Number of tickets:</span>
                <span className="text-white text-sm">{guests}</span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Subtotal:</span>
                <span className="text-white text-sm">Rs {(selectedEvent?.price || 0) * guests}</span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Taxes:</span>
                <span className="text-white text-sm">Rs 50.00</span>
              </div>
              <div className="row flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Booking fee:</span>
                <span className="text-white text-sm">Rs 25.00</span>
              </div>
              <div className="row total flex justify-between items-center font-bold">
                <span className="text-white text-sm">Total:</span>
                <span className="text-white text-sm">Rs {(selectedEvent?.price || 0) * guests + 75}</span>
              </div>
            </div>
            <button className="book-now-btn bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded w-full mt-4 text-sm">
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSelectionPage;