import React, { useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import VerticalSocialBar from "./components/verticalSocialBar";
import Footer from "./components/footer";
import EventDetail from "./components/eventDetail";
import Testimonials from "./components/TestimonialCard";
import AccommodationSelector from "./components/accommodation";
import Introduction from "./components/introduction";
import Events from "./components/events";
import RestaurantAndBar from "./components/RestaurantAndBar";
import Stays from "./components/stays";
import RoomDetail from "./pages/roomdetails";
import RoomList from "./pages/roomlist";
import RoomBooking from "./pages/roombooking";
import SignIn from "./components/login";
import SignUp from "./components/signup";
import EventDetails from "./pages/eventdetails";
import EventLists from "./pages/eventlist";
import "./App.css";
import AnimatedCursor from "react-animated-cursor";
import BlogSelector from "./components/blog";
import RestaurantAndBarGallery from "./components/RestaurantAndBarGallery";
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
        <main data-scroll-section>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <AccommodationSelector />
                  <RestaurantAndBarGallery />

                  <Testimonials />
                  <BlogSelector />
                </>
              }
            />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/events" element={<Events />} />
            <Route path="/restaurant-and-bar" element={<RestaurantAndBar />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/RoomList" element={<RoomList />} />
            <Route path="/RoomDetail/:id" element={<RoomDetail />} />
            <Route path="/book-room/:id" element={<RoomBooking />} />
            <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/event" element={<EventLists />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LocomotiveScrollProvider>
  );
}

export default App;
