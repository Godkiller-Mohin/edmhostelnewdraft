import React from "react";
import "./introduction.css";

const Introduction = () => {
  return (
    <div className="edm-hostel-container">
      <h1>India’s First Party Hostel – Where Beats Hit Different!</h1>
      <p className="address">Welcome to EDM Hostel </p>

      <div className="content-wrapper">
        <div className="main-content">
          <p>
            Sitting high up at 6900 feet, EDM Hostel in Dharamshala is where
            your adventure meets a party you’ll never forget. As India’s
            first-ever party hostel, we’re here to redefine what it means to
            have a good time. Whether you're vibing to the beats, catching a
            killer sunset, or meeting new friends, this is the ultimate hangout
            for party lovers—the kind of place where you come for one night and
            stay for a week.
          </p>
          <p>
            We don’t just throw parties, we create experiences. From Thursday to
            Sunday, expect house, techno, and psytrance events that go off with
            top-tier DJs spinning all night long. And if we’re feeling the vibe,
            we throw in some extra mid-week parties, just because we can. No
            FOMO here—whether you’re dancing under the stars or chilling at our
            in-house bar, it’s all about making memories that last.
          </p>
          <p>
            And, for those chill days? We got you. Mondays, Tuesdays, and
            Wednesdays are reserved for recharging your energy with stuff like
            movement workshops, contact improv, breathwork, and ecstatic dances.
            It's all about getting in sync with yourself, your people, and the
            mountain vibes.
          </p>

          <p>
            Oh, and did we mention our restaurant has the best view in Dharamkot
            and Dharamshala? Yeah, whether it’s breakfast with a killer sunrise
            or cocktails at golden hour, you won’t find a better backdrop for
            your Instagram feed.
          </p>
          <p>
            At EDM Hostel, we’re more than just a place to crash. We’re where
            your squad gets bigger, the beats hit harder, and every moment feels
            like a whole new vibe. Ready for the ultimate party? Your adventure
            starts here.
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
