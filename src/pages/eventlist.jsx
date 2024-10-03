import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './event.css'; // Change the file to reflect event-specific styles
import ApiService from "../api/apiService";

const EventLists = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await ApiService.get('/api/event/list');
        
        console.log('API Response Data:', data);

        if (data && data.result) {
          const { result } = data;
          console.log('API Response Result:', result);

          if (result && result.data) {
            setEvents(result.data.rows || []); // Handle result.data.rows
          } else {
            console.error('Unexpected result structure:', result);
            throw new Error('Invalid API result structure');
          }
        } else {
          console.error('API response data is undefined:', data);
          throw new Error('No response data');
        }
      } catch (error) {
        console.error('Error fetching events:', error.message);
        setError('Failed to fetch events. Please try again later.');
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      <div className="events">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <img
                src={event.event_images[0]?.url.split(' || ')[0]}
                alt={event.event_name}
                className="event-image"
              />
              <h3>{event.event_name}</h3>
              <p><strong>Date:</strong> {event.event_date}</p>
              <p><strong>Location:</strong> {event.event_location}</p>
              <Link to={`/events/${event.id}`} className="details-link">View Details</Link>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default EventLists;
