import React from "react";
import "./introduction.css";

const Introduction = () => {
  return (
    <div className="edm-hostel-container">
      <h1>INTRODUCING AUSTIN, TX</h1>
      <p className="address">204 E 6th St, Austin, TX, 78701 •</p>

      <div className="content-wrapper">
        <div className="main-content">
          <p>
            Opened in July 2024, our eagerly awaited Texas outpost sits on
            Austin's iconic Sixth Street in the Downtown Historic District.
            Predominantly pedestrianized, the area is known for its bars, clubs,
            live music, and comedy venues housed in 19th-century Victorian
            buildings, earning the street a spot on the National Register of
            Historic Places.
          </p>
          <p>
            As is The Dead Rabbit signature, modern Irish art adorns the walls,
            with uniforms and menus designed by celebrated Irish makers. And
            what's Austin without great live music? We've weekly Sunday
            seisiúns, and regularly host visiting musicians, comedians, and
            more.
          </p>
          <p>
            Enjoy classic and modern cocktails, including our signature Irish
            Coffee, alongside perfect pints, an array of spirits, and hearty pub
            dishes, all served in our lively Taproom. Welcome to The Dead
            Rabbit, welcome home.
          </p>

          <div className="buttons">
            <button className="reserve-button">BOOK NOW</button>
            <button className="directions-button">GET DIRECTIONS</button>
          </div>
        </div>

        <div className="opening-times">
          <h2>OPENING TIMES</h2>
          <div className="underline"></div>
          <h3>THE TAPROOM</h3>
          <p>MONDAY - FRIDAY | 12PM - 2AM</p>
          <p>SATURDAY - SUNDAY | 11AM - 2AM</p>
          <h3>NEIGHBOURHOOD</h3>
          <p>MONDAY - SUNDAY | 8AM - 3PM</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
