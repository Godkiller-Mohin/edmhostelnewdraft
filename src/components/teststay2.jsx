import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faUsers,
  faDollarSign,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const AccommodationCard = ({ accommodation, onSelect, isSelected }) => {
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
  (accommodation?.room_images?.[0]?.url?.startsWith('http') 
    ? accommodation?.room_images?.[0]?.url
    : `${import.meta.env.VITE_BASE_URL}/uploads/rooms/${accommodation?.room_images?.[0]?.url.split('/').pop()}`) ||
  `/default-image.jpg`; // Fallback to default image

console.log(imageUrl);
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
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .accommodation-front, .accommodation-back {
            position: absolute;
            inset: 0;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
          }
          .accommodation-front {
            background-size: cover;
            background-position: center;
          }
          .accommodation-back {
            background-color: white;
            padding: 1.5rem;
            transform: rotateY(180deg);
          }
          .accommodation-card.flipped .accommodation-front {
            transform: rotateY(180deg);
          }
          .accommodation-card.flipped .accommodation-back {
            transform: rotateY(0deg);
          }
          .accommodation-front .overlay {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
          }
          .accommodation-card:hover .accommodation-front,
          .accommodation-card:hover .accommodation-back {
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
          .flipped.accommodation-card:hover .accommodation-front {
            transform: rotateY(180deg) scale(1.02);
          }
          .flipped.accommodation-card:hover .accommodation-back {
            transform: rotateY(0deg) scale(1.02);
          }
        `}
      </style>

      <div
        className={`accommodation-card ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
        onMouseEnter={handleCardHover}
        onMouseLeave={handleCardHover}
      >
        {/* Front of the Card */}
        <div
          className="accommodation-front"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="overlay absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-3xl font-bold text-white mb-2">
              {accommodation.room_name}
            </h3>
            <p className="text-base text-gray-200 mb-4 line-clamp-2">
              {accommodation.room_description}
            </p>
            <div className="info-item inline-flex w-auto">
              <span className="icon">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-gray-700"
                />
              </span>
              <span className="text-base font-medium text-gray-700">
                {getPriceText()}
              </span>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div className="accommodation-back">
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {accommodation.room_name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faUsers} className="text-gray-600" />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {accommodation.room_type}
                </span>
              </div>

              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faUsers} className="text-gray-600" />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {accommodation.room_capacity} Guests
                </span>
              </div>

              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faBed} className="text-gray-600" />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {accommodation.room_size} m²
                </span>
              </div>

              <div className="info-item">
                <span className="icon">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-gray-600"
                  />
                </span>
                <span className="text-sm font-medium text-green-700">
                  {getPriceText()}
                </span>
              </div>
            </div>

            <h4 className="text-base font-bold mb-2">Amenities:</h4>
            <div className="flex-grow mb-6">
              <ul className="space-y-2">
                {amenities.map((facility, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="mr-2 text-green-500"
                    />
                    {facility}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                isSelected
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => onSelect(accommodation)}
            >
              {isSelected ? "Selected" : "Select Room"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccommodationCard;
