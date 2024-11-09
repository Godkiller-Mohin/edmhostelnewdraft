import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faUsers, faDollarSign, faHotel } from '@fortawesome/free-solid-svg-icons';

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

  const handleSelectClick = () => {
    onSelect(accommodation);
  };

  const getAvailabilityText = () => {
    if (accommodation.type === 'dormitory') {
      return `${accommodation.availableBeds} Beds Available`;
    }
    return `${accommodation.availableRooms} Rooms Available`;
  };

  const getPriceText = () => {
    if (accommodation.type === 'dormitory') {
      return `Rs ${accommodation.pricePerNight}/Person`;
    }
    return `Rs ${accommodation.pricePerNight}/Night`;
  };

  return (
    <div className={`event-card w-full h-[500px] relative cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardHover}>
      <div className={`event-front absolute inset-0 bg-cover bg-center transition-transform duration-500 transform-preserve-3d ${isFlipped ? '-rotate-y-180' : ''}`}
        style={{ backgroundImage: `url(${accommodation.image})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{accommodation.name}</h3>
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBed} className="mr-2" />
                <span className="text-sm">{accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                <span className="text-sm">Up to {accommodation.maxGuests}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHotel} className="mr-2" />
                <span className="text-sm">{getAvailabilityText()}</span>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
              <span className="text-lg font-semibold">{getPriceText()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`event-back absolute inset-0 bg-white p-4 transition-transform duration-500 transform-preserve-3d rotate-y-180 ${isFlipped ? 'rotate-y-0' : ''}`}>
        <div className="h-full flex flex-col">
          <h3 className="text-xl font-bold mb-4">{accommodation.name}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-500 text-sm">Type</span>
              <p className="font-medium">{accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Max Capacity</span>
              <p className="font-medium">{accommodation.maxGuests} persons</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">{accommodation.type === 'dormitory' ? 'Available Beds' : 'Available Rooms'}</span>
              <p className="font-medium">{accommodation.type === 'dormitory' ? accommodation.availableBeds : accommodation.availableRooms}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Price</span>
              <p className="font-medium text-blue-500">{getPriceText()}</p>
            </div>
          </div>
          <div className="space-y-4 flex-grow">
            <div>
              <h4 className="text-base font-bold mb-2">Amenities:</h4>
              <div className="grid grid-cols-2 gap-2">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="text-sm text-gray-600">• {amenity}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold mb-2">Remember:</h4>
              <ul className="list-disc pl-4">
                {accommodation.rules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-600 mb-1">{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          <button className={`select-btn ${isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-4 rounded text-sm mt-4`}
            onClick={handleSelectClick}>
            {isSelected ? 'Selected' : 'Select Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;