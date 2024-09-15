import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from "../api/apiService";
import './room.css';

const RoomDetail = () => {
  const { id } = useParams(); // Get the id from the URL parameters
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null); // State to store errors

  useEffect(() => {
    // Fetch room details by id
    const fetchRoomDetails = async () => {
      try {
        const response = await ApiService.get(`/api/room/get-room-by-id-or-slug-name/${id}`);
        console.log('API Response Data:', response); // Check the response structure
        
        // Assuming the correct structure is response.data.result.data
        if (response && response.result && response.result.data) {
          setRoom(response.result.data); // Adjusted to access response.result.data
        } else {
          console.error('Unexpected API response structure:', response);
          setError('Invalid API response structure');
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
        setError('Failed to fetch room details. Please try again later.');
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>; // Display the error message if any
  }

  if (!room) {
    return <p>Loading room details...</p>;
  }

  return (
    <div className="room-detail">
      <h2>{room.room_name}</h2>
      <img src={room.room_images[0]?.url} alt={room.room_name} />
      <p>Price: ${room.room_price}</p>
      <p>{room.room_description}</p>
      <p>Room Size: {room.room_size} sq. ft.</p>
      <p>Capacity: {room.room_capacity} people</p>
      <p>Allow Pets: {room.allow_pets ? 'Yes' : 'No'}</p>
      <p>Breakfast Provided: {room.provide_breakfast ? 'Yes' : 'No'}</p>

      <Link to={`/book-room/${room.id}`}>Book This Room</Link>
    </div>
  );
};

export default RoomDetail;
