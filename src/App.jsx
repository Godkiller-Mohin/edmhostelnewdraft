import React, { useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import VerticalSocialBar from "./components/verticalSocialBar";
import Footer from "./components/footer";
import EventSelector from "./components/eventCard";
import EventDetail from "./components/eventDetail";
import Testimonials from "./components/TestimonialCard";
import AccommodationSelector from "./components/accommodation";
import Introduction from "./components/introduction";
import Events from "./components/events";
import RestaurantAndBar from "./components/RestaurantAndBar";
import Stays from "./components/stays";
import RoomDetail from "./pages/roomdetails";
import RoomList from "./pages/roomlist";
import SignIn from "./components/login";
import SignUp from "./components/signup";
import "./App.css";
import AnimatedCursor from "react-animated-cursor";

function App() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        // You can add more options here as needed
      }}
      containerRef={containerRef}
    >
      <div className="App" data-scroll-container ref={containerRef}>
        <AnimatedCursor
          innerSize={8}
          outerSize={50}
          innerScale={1}
          outerScale={1.5}
          outerAlpha={0}
          hasBlendMode={true}
          innerStyle={{
            backgroundColor: "#fff",
          }}
          outerStyle={{
            border: "3px solid  #fff",
          }}
        />
        <Navbar isLoggedIn={isLoggedIn} />
        {/* <VerticalSocialBar /> */}
        <main data-scroll-section>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <EventSelector />
                  <AccommodationSelector />
                  <Testimonials />
                </>
              }
            />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/events" element={<Events />} />
            <Route path="/restaurant-and-bar" element={<RestaurantAndBar />} />
            <Route path="/stays" element={<Stays />} />
            <Route
              path="/rooms"
              element={isLoggedIn ? <RoomList /> : <Navigate to="/login" />}
            />
            <Route
              path="/rooms/:id"
              element={isLoggedIn ? <RoomDetail /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />{" "}
            {/* Add the SignUp route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </LocomotiveScrollProvider>
  );
}

export default App;
