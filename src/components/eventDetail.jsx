import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ApiService from "../api/apiService";
import "./eventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await ApiService.get(`/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError("Event not found");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="event-detail">
      <div className="event-content">
        <h1 className="event-name">{event.name}</h1>
        <p className="event-description">{event.description}</p>
        <div className="event-buttons">
          <button className="reserve-button">RESERVE A TABLE</button>
          <button className="directions-button">GET DIRECTIONS</button>
        </div>
      </div>
      <div className="opening-times">
        <h2 className="opening-times-title">OPENING TIMES</h2>
        <div className="taproom-info">
          <h3>THE TAPROOM</h3>
          <p>SUN - THUR | {event.openingTimes.sunToThur}</p>
          <p>FRI - SAT | {event.openingTimes.friToSat}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
