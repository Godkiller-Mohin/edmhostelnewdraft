import React from "react";
import "./introduction.css";
import bar1 from "../assets/bar1.jpg";
import partyImage from "../assets/bar1.jpg";
import rechargeImage from "../assets/bar1.jpg";
import viewImage from "../assets/bar1.jpg";

const Introduction = () => {
  const handleGetDirections = () => {
    window.open(
      "https://www.google.com/maps/dir//village,+hainee,+Dharamshala,+Himachal+Pradesh+176219/@32.2514086,76.2485566,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x391b57ac6558003b:0x214eab8f6a6cdfa!2m2!1d76.3309579!2d32.2514353?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  const handleBookNow = () => {
    window.location.href = "/";
  };

  return (
    <div className="edm-hostel-container">
      <div className="content-wrapper">
        <div className="main-content">
          <section className="section">
            <h2>Welcome to the Ultimate Adventure</h2>
            <div className="content">
              <p>
                Sitting high up at 6900 feet, EDM Hostel in Dharamshala is where
                your adventure meets a party you'll never forget. As India's
                first-ever party hostel, we're here to redefine what it means to
                have a good time.
              </p>
              <div className="image-container">
                <img src={bar1} alt="Adventure" />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Party Like There's No Tomorrow</h2>
            <div className="content">
              <p>
                Whether you're vibing to the beats, catching a killer sunset, or
                meeting new friends, this is the ultimate hangout for party
                lovers—the kind of place where you come for one night and stay
                for a week.
              </p>
              <div className="image-container">
                <img src={partyImage} alt="Party" />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Recharge and Rejuvenate</h2>
            <div className="content">
              <p>
                Mondays, Tuesdays, and Wednesdays are reserved for recharging
                your energy with stuff like movement workshops, contact improv,
                breathwork, and ecstatic dances. It's all about getting in sync
                with yourself, your people, and the mountain vibes.
              </p>
              <div className="image-container">
                <img src={rechargeImage} alt="Recharge" />
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Unrivaled Views</h2>
            <div className="content">
              <p>
                Oh, and did we mention our restaurant has the best view in
                Dharamkot and Dharamshala? Yeah, whether it's breakfast with a
                killer sunrise or cocktails at golden hour, you won't find a
                better backdrop for your Instagram feed.
              </p>
              <div className="image-container">
                <img src={viewImage} alt="View" />
              </div>
            </div>
          </section>

          <div className="buttons">
            <button className="reserve-button" onClick={handleBookNow}>
              BOOK NOW
            </button>
            <button className="directions-button" onClick={handleGetDirections}>
              GET DIRECTIONS
            </button>
          </div>
        </div>

        <div className="opening-times">
          <h2>OUR WORKING HOURS</h2>
          <div className="underline"></div>
          <h3>RESTAURANT AND BAR</h3>
          <p>MONDAY - FRIDAY | 12PM - 12AM</p>
          <p>SATURDAY - SUNDAY | 11AM - 12AM</p>
          <h3>EVENT TIMINGS</h3>
          <p>WEDNESDAY - SUNDAY | 5PM - 12AM</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;