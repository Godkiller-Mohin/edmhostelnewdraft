import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faUsers, faDollarSign, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const AccommodationCard = ({ accommodation, onSelect, isSelected }) => {
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
      onSelect(accommodation);
    }
  };

  const handleCardHover = () => {
    if (!isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  const getPriceText = () => `₹${accommodation?.room_price || 0}/Night`;

  const amenities = accommodation?.extra_facilities || [];
  const imageUrl =
    accommodation?.room_images?.[0]?.url?.split(" || ")?.[1] || 
    '/default-image.jpg';

  return (
    <>
      <style>
        {`
          .accommodation-card {
            position: relative;
            cursor: pointer;
            width: 100%;
            height: 500px;
            perspective: 1000px;
          }
          .card-front, .card-back {
            position: absolute;
            inset: 0;
            transition: transform 0.5s;
            transform-style: preserve-3d;
            backface-visibility: hidden;
          }
          .card-front {
            background-size: cover;
            background-position: center;
          }
          .card-back {
            background-color: white;
            padding: 1rem;
            transform: rotateY(180deg);
          }
          .accommodation-card.flipped .card-front {
            transform: rotateY(180deg);
          }
          .accommodation-card.flipped .card-back {
            transform: rotateY(0deg);
          }
          .card-front .bg-black {
            background-color: rgba(0, 0, 0, 0.5);
          }
          .accommodation-card:hover .card-front {
            transform: scale(1.05);
          }
          .accommodation-card:hover .card-back {
            transform: scale(1.05);
          }
        `}
      </style>

      <div
        className={`accommodation-card ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardHover}
      >
        {/* Front Side */}
        <div
          className={`card-front`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
            <h3 className="text-2xl font-bold text-white">{accommodation.room_name}</h3>
            <p className="text-sm text-gray-300">{accommodation.room_description}</p>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-white" />
              <span className="text-lg font-semibold text-white">{getPriceText()}</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className={`card-back`}
        >
          <h3 className="text-xl font-bold mb-2">{accommodation.room_name}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-500 text-sm">Room Type:</span>
              <p className="font-medium">{accommodation.room_type}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Capacity:</span>
              <p className="font-medium">{accommodation.room_capacity} Guests</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Size:</span>
              <p className="font-medium">{accommodation.room_size} m²</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Price:</span>
              <p className="font-medium text-green-500">{getPriceText()}</p>
            </div>
          </div>
          <h4 className="text-base font-bold mb-2">Amenities:</h4>
          <ul className="list-disc pl-4">
            {amenities.map((facility, index) => (
              <li key={index} className="text-sm text-gray-600">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                {facility}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelect(accommodation)}
            className={`mt-4 p-2 w-full text-white rounded-lg ${
              isSelected ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AccommodationCard;
