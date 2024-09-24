import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
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
import "./App.css";
import AnimatedCursor from "react-animated-cursor";

function App() {
  const containerRef = useRef(null);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        // You can add more options here as needed
      }}
      watch={
        [
          // You can add dependencies here to watch for content changes
        ]
      }
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
        <Navbar />
        <VerticalSocialBar />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </LocomotiveScrollProvider>
  );
}

export default App;
