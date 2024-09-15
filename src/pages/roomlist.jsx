import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link
import './room.css'; // Assuming you're using this for styling
import ApiService from "../api/apiService";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await ApiService.get('/api/room/all-rooms-list');
        
        console.log('API Response Data:', data);

        // Assuming the data is structured as { result: { data: { rows: [...] } } }
        if (data && data.result) {
          const { result } = data;
          console.log('API Response Result:', result);

          if (result && result.data) {
            setRooms(result.data.rows || []); // Handle result.data.rows
          } else {
            console.error('Unexpected result structure:', result);
            throw new Error('Invalid API result structure');
          }
        } else {
          console.error('API response data is undefined:', data);
          throw new Error('No response data');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
        console.error('Full error details:', error);
        setError('Failed to fetch rooms. Please try again later.');
      }
    };

    fetchRooms();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <img
                src={room.room_images[0]?.url.split(' || ')[0]}
                alt={room.room_name}
                className="room-image"
              />
              <h3>{room.room_name}</h3>
              <p><strong>Type:</strong> {room.room_type}</p>
              <p><strong>Capacity:</strong> {room.room_capacity}</p>
              <p><strong>Status:</strong> {room.room_status === 'available' ? 'Available' : 'Occupied'}</p>
              <Link to={`/rooms/${room.id}`} className="details-link">View Details</Link>
            </div>
          ))
        ) : (
          <p>No rooms available</p>
        )}
      </div>
    </div>
  );
};

export default RoomList;
