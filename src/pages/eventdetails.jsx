import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from "../api/apiService";
import './event.css'; // Adjust the CSS file to match events

const EventDetails = () => {
  const { id } = useParams(); // Get the id from the URL parameters
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null); // State to store errors

  useEffect(() => {
    // Fetch event details by id
    const fetchEventDetails = async () => {
      try {
        const response = await ApiService.get(`/api/event/${id}`);
        console.log('API Response Data:', response); // Check the response structure
        
        // Assuming the correct structure is response.data.result.data
        if (response && response.result && response.result.data) {
          setEvent(response.result.data); // Adjusted to access response.result.data
        } else {
          console.error('Unexpected API response structure:', response);
          setError('Invalid API response structure');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to fetch event details. Please try again later.');
      }
    };

    fetchEventDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>; // Display the error message if any
  }

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-detail">
      <h2>{event.event_name}</h2>
      <img src={event.event_images[0]?.url} alt={event.event_name} />
      <p>Date: {event.event_date}</p>
      <p>Location: {event.event_location}</p>
      <p>{event.event_description}</p>
      <p>Organizer: {event.event_organizer}</p>
      <p>Price: ${event.event_price}</p>

      <Link to={`/book-event/${event.id}`}>Book This Event</Link>
    </div>
  );
};

export default EventDetails;
