import React, { useEffect, useRef, useState } from "react";
import "./testimonials.css";

const TestimonialSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    }
  }, [scrollProgress]);

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      text: "This place exceeded all my expectations. The staff was incredibly friendly and the atmosphere was perfect for both work and relaxation.",
    },
    {
      id: 2,
      name: "Jane Smith",
      text: "I've stayed in many hostels, but this one truly felt like home. The community events were a great way to meet new people!",
    },
    {
      id: 3,
      name: "Mike Johnson",
      text: "Clean, comfortable, and conveniently located. I couldn't have asked for a better place to stay during my travels.",
    },
  ];

  return (
    <div className="testimonial-selector" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          TESTIMONIALS
        </h2>
        <h2 className="main-heading">WHAT OUR GUESTS SAY</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-content">
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSelector;
