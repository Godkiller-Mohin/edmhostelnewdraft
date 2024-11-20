import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMusic, faUsers, faClockFour } from '@fortawesome/free-solid-svg-icons';

const EventCard = ({ event, onSelect, isSelected }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          }
          .event-front, .event-back {
            position: absolute;
            inset: 0;
            transition: transform 0.5s;
            transform-style: preserve-3d;
            backface-visibility: hidden;
          }
          .event-front {
            background-size: cover;
            background-position: center;
          }
          .event-back {
            background-color: white;
            padding: 1rem;
            transform: rotateY(180deg);
          }
          .event-card.flipped .event-front {
            transform: rotateY(180deg);
          }
          .event-card.flipped .event-back {
            transform: rotateY(0deg);
          }
          .event-front .bg-black {
            background-color: rgba(0, 0, 0, 0.5);
          }
          .event-card:hover .event-front {
            transform: scale(1.05);
          }
          .event-card:hover .event-back {
            transform: scale(1.05);
          }
        `}
      </style>

      <div
        className={`event-card ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardHover}
      >
        {/* Front of the Card */}
        <div
          className={`event-front`}
          style={{ backgroundImage: `url(${event.event_images[0]?.url})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
            <h3 className="text-2xl font-bold text-white">{event.event_name}</h3>
            <p className="text-sm text-gray-300">{event.event_description}</p>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-white" />
              <span className="text-lg font-semibold text-white">
                {new Date(event.event_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div
          className={`event-back`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold mb-2">{event.event_name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  <span className="text-sm">
                    {new Date(event.event_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClockFour} className="mr-1" />
                  <span className="text-sm">{event.event_duration} hours</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-500 text-sm">Capacity</div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-1" />
                  <span className="text-sm">{event.event_capacity} Guests</span>
                </div>
              </div>
              <p className="text-sm mb-4">{event.event_description}</p>
            </div>

            {/* Select Button */}
            <button
              className={`mt-4 p-2 w-full text-white rounded-lg ${
                isSelected ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSelectClick}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
