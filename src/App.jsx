import React from "react";
import Navbar from "./components/Navbar";
import Routing from "./routing/routing";
import VerticalSocialBar from "./components/verticalSocialBar";
import "./App.css"; // You'll need to create this file for any global styles
import Hero from "./components/hero";

import AnimatedCursor from "react-animated-cursor";

function App() {
  return (
    <div className="App">
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
      <Hero />
      <VerticalSocialBar />
    </div>
  );
}

export default App;
