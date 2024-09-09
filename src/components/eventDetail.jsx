// import React from "react";
// import { useParams, Link } from "react-router-dom";

// const events = [
//   {
//     id: 1,
//     name: "NEW YORK, NYC",
//     image: "src/assets/image2.jpg",
//     subtitle: "WELCOME HOME",
//   },
//   {
//     id: 2,
//     name: "AUSTIN, TX",
//     image: "src/assets/image1.jpg",
//     subtitle: "CÉAD MÍLE FÁILTE Y",
//   },
//   {
//     id: 3,
//     name: "WASHINGTON, D.C.",
//     image: "src/assets/image3.jpg",
//     subtitle: "COMING SOON",
//   },
// ];

// const EventDetail = () => {
//   const { id } = useParams();
//   const event = events.find((e) => e.id === parseInt(id));

//   if (!event) {
//     return <div>Event not found</div>;
//   }

//   return (
//     <div
//       className="event-detail"
//       style={{
//         backgroundColor: "#01231f",
//         color: "white",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         padding: "2rem",
//       }}
//     >
//       <div style={{ position: "relative" }}>
//         <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
//           {event.subtitle}
//         </h2>
//         <h1
//           style={{ fontSize: "4rem", marginBottom: "2rem", color: "#f0e6d3" }}
//         >
//           {event.name}
//         </h1>
//         <Link
//           to="/"
//           style={{
//             color: "#f0e6d3",
//             textDecoration: "none",
//             display: "flex",
//             alignItems: "center",
//             fontSize: "1.2rem",
//           }}
//         >
//           TAKE A LOOK AROUND <span style={{ marginLeft: "0.5rem" }}>→</span>
//         </Link>
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             bottom: 0,
//             left: "-1rem",
//             width: "0.25rem",
//             backgroundColor: "#f0e6d3",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default EventDetail;

import React from "react";
import { useParams, Link } from "react-router-dom";
import "./eventDetail.css";
const events = [
  {
    id: 1,
    name: "NEW YORK, NYC",
    description: "Experience the vibrant energy of New York City.",
    openingTimes: {
      sunToThur: "11AM - 2AM",
      friToSat: "11AM - 3AM",
    },
  },
  {
    id: 2,
    name: "NEW YORK, NYC",
    description: "Experience the vibrant energy of New York City.",
    openingTimes: {
      sunToThur: "11AM - 2AM",
      friToSat: "11AM - 3AM",
    },
  },
  {
    id: 3,
    name: "NEW YORK, NYC",
    description: "Experience the vibrant energy of New York City.",
    openingTimes: {
      sunToThur: "11AM - 2AM",
      friToSat: "11AM - 3AM",
    },
  },
];

const EventDetail = () => {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return <div>Event not found</div>;
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
