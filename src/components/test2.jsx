import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMusic,
  faUsers,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";
const baseURL = import.meta.env.VITE_BASE_URL;

const EventCard = ({ event, onSelect, isSelected }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    } else {
      onSelect(event);
    }
  };

  const handleCardHover = () => {
    if (!isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleSelectClick = (e) => {
    e.stopPropagation(); // Prevent triggering handleCardClick
    onSelect(event);
  };

  return (
    <>
      <style>
        {`
            .event-card {
              position: relative;
              cursor: pointer;
              width: 100%;
              height: 500px;
              perspective: 1000px;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .event-front, .event-back {
              position: absolute;
              inset: 0;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              transform-style: preserve-3d;
              backface-visibility: hidden;
            }
            .event-front {
              background-size: cover;
              background-position: center;
            }
            .event-back {
              background-color: white;
              padding: 1.5rem;
              transform: rotateY(180deg);
            }
            .event-card.flipped .event-front {
              transform: rotateY(180deg);
            }
            .event-card.flipped .event-back {
              transform: rotateY(0deg);
            }
            .event-front .overlay {
              background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
            }
            .event-card:hover .event-front,
            .event-card:hover .event-back {
              transform: scale(1.02);
              transition: transform 0.3s ease;
            }
            .info-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem;
              background-color: rgba(243, 244, 246, 0.8);
              border-radius: 8px;
            }
            .icon {
              width: 1.25rem;
              height: 1.25rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .flipped.event-card:hover .event-front {
              transform: rotateY(180deg) scale(1.02);
            }
            .flipped.event-card:hover .event-back {
              transform: rotateY(0deg) scale(1.02);
            }
          `}
      </style>

      <div
        className={`event-card ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardHover}
      >
        {/* Front of the Card */}
        <div
          className="event-front"
          style={{
            backgroundImage: event.event_images[0]?.url
            ? event.event_images[0]?.url.startsWith('http') 
              ? `url(${event.event_images[0]?.url})`
              : `url(${baseURL}/uploads/rooms/${event.event_images[0]?.url.split('/').pop()})`
            : null,
          
            backgroundColor: event.event_images[0]?.url ? 'transparent' : '#ccc', // Fallback color if no image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}        >
          <div className="overlay absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-3xl font-bold text-white mb-2">
              {event.event_name}
            </h3>
            <p className="text-base text-gray-200 mb-4 line-clamp-2">
              {event.event_description}
            </p>
            <div className="info-item inline-flex w-auto">
              <span className="icon">
                <FontAwesomeIcon icon={faCalendar} className="text-gray-700" />
              </span>
              <span className="text-base font-medium text-gray-700">
                {new Date(event.event_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div className="event-back">
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {event.event_name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-600"
                  />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
              </div>

              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon
                    icon={faClockFour}
                    className="text-gray-600"
                  />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {event.event_duration} hours
                </span>
              </div>

              <div className="info-item col-span-2">
                <span className="icon">
                  <FontAwesomeIcon icon={faUsers} className="text-gray-600" />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {event.event_capacity} Guests
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-base flex-grow mb-6">
              {event.event_description}
            </p>

            <button
              className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                isSelected
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSelectClick}
            >
              {isSelected ? "Selected" : "Select Event"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
