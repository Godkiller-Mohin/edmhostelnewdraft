import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from "../api/apiService";
import './room.css'

const RoomDetail = () => {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    // Fetch room details by slug
    const fetchRoomDetails = async () => {
      try {
        const response = await ApiService.get(`/api/room/get-room-by-id-or-slug-name/:id`);
        setRoom(response.data.data);
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoomDetails();
  }, [slug]);

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
