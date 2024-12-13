// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import "./accommodationSelector.css";
// import ApiService from "../api/apiService";

// const AccommodationSelector = () => {
//   const backgroundTextRef = useRef(null);
//   const sectionRef = useRef(null);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [accommodations, setAccommodations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchAccommodations = async () => {
//       try {
//         const response = await ApiService.get("/api/room/all-rooms-list");

//         if (response && response.result && response.result.data) {
//           const rows = response.result.data.rows;

//           if (Array.isArray(rows)) {
//             setAccommodations(rows);
//           } else {
//             setAccommodations([]);
//           }
//         } else {
//           setAccommodations([]);
//         }
//       } catch (error) {
//         setAccommodations([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccommodations();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const section = sectionRef.current;

//       if (section) {
//         const rect = section.getBoundingClientRect();
//         const viewportHeight = window.innerHeight;
//         const elementHeight = rect.height;

//         let progress =
//           (viewportHeight - rect.top) / (viewportHeight + elementHeight);
//         progress = Math.min(Math.max(progress, 0), 1);

//         setScrollProgress(progress);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const backgroundText = backgroundTextRef.current;
//     if (backgroundText) {
//       const xPosition = (scrollProgress - 0.5) * 200;
//       backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;

//       const viewportWidth = window.innerWidth;
//       const fontSize = Math.min(150, viewportWidth * 0.2);
//       backgroundText.style.fontSize = `${fontSize}px`;
//     }
//   }, [scrollProgress]);

//   return (
//     <div className="accommodation-selector" ref={sectionRef} id="stay">
//       <div className="heading-container">
//         <h2 className="background-text" ref={backgroundTextRef}>
//           STAYS
//         </h2>
//         <h2 className="main-heading">CHOOSE YOUR STAY</h2>
//       </div>
//       <div className="accommodation-grid">
//         {isLoading ? (
//           <p>Loading accommodations...</p>
//         ) : accommodations.length > 0 ? (
//           accommodations.map((accommodation) => (
//             <Link
//               key={accommodation.id}
//               to={`/teststay`}
//               className={`image-container accommodation-image`}
//               style={{
//                 backgroundImage: `url("src/assets/female-dorm.jpeg")`,
//               }}
//             >
//               <div className="overlay">
//                 <div className="overlay-content">
//                   <h3>{accommodation.room_name}</h3>
//                   <div className="overlay-details">
//                     <p>Price: ₹{accommodation.room_price}/night</p>
//                     <p>Capacity: {accommodation.room_capacity} people</p>
//                     <p>Type: {accommodation.room_type}</p>
//                     <div className="facilities">
//                       {accommodation.extra_facilities
//                         .slice(0, 3)
//                         .map((facility, index) => (
//                           <span key={index} className="facility-tag">
//                             {facility}
//                           </span>
//                         ))}
//                     </div>
//                   </div>
//                   <span className="reserve-text">BOOK NOW</span>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <p>No accommodations available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AccommodationSelector;

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./accommodationSelector.css";
import ApiService from "../api/apiService";

const AccommodationSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await ApiService.get("/api/room/all-rooms-list");

        if (response && response.result && response.result.data) {
          const rows = response.result.data.rows;

          // Limit to 4 accommodations
          const limitedAccommodations = rows.slice(0, 4);

          if (Array.isArray(limitedAccommodations)) {
            setAccommodations(limitedAccommodations);
          } else {
            setAccommodations([]);
          }
        } else {
          setAccommodations([]);
        }
      } catch (error) {
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;

        let progress =
          (viewportHeight - rect.top) / (viewportHeight + elementHeight);
        progress = Math.min(Math.max(progress, 0), 1);

        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText) {
      const xPosition = (scrollProgress - 0.5) * 200;
      backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;

      const viewportWidth = window.innerWidth;
      const fontSize = Math.min(150, viewportWidth * 0.2);
      backgroundText.style.fontSize = `${fontSize}px`;
    }
  }, [scrollProgress]);

  return (
    <div className="accommodation-selector" ref={sectionRef} id="stay">
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          STAYS
        </h2>
        <h2 className="main-heading">CHOOSE YOUR STAY</h2>
      </div>
      <div className="accommodation-grid">
        {isLoading ? (
          <p>Loading accommodations...</p>
        ) : accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <Link
              key={accommodation.id}
              to={`/teststay`}
              className={`image-container accommodation-image`}
              style={{
                backgroundImage: `url("src/assets/female-dorm.jpeg")`,
              }}
            >
              <div className="overlay">
                <div className="overlay-content">
                  <h3>{accommodation.room_name}</h3>
                  <div className="overlay-details">
                    <p>Price: ₹{accommodation.room_price}/night</p>
                    <p>Capacity: {accommodation.room_capacity} people</p>
                    <p>Type: {accommodation.room_type}</p>
                    <div className="facilities">
                      {accommodation.extra_facilities
                        .slice(0, 3)
                        .map((facility, index) => (
                          <span key={index} className="facility-tag">
                            {facility}
                          </span>
                        ))}
                    </div>
                  </div>
                  <span className="reserve-text">BOOK NOW</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No accommodations available.</p>
        )}
      </div>
    </div>
  );
};

export default AccommodationSelector;
