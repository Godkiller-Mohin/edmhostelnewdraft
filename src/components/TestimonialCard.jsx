import React from "react";
import "./testimonials.css"; // We'll create this file for styling

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      image: "src/assets/image2.jpg",
      text: "This service is amazing! I had a wonderful experience.",
    },
    {
      name: "Jane Smith",
      image: "src/assets/image1.jpg",
      text: "Absolutely loved it! Highly recommend to everyone.",
    },
    {
      name: "Alice Johnson",
      image: "src/assets/image3.jpg",
      text: "A top-notch experience from start to finish.",
    },
  ];

  return (
    <div className="testimonials">
      <h2>WHAT OUR CLIENTS SAY</h2>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img src={testimonial.image} alt={testimonial.name} />
            <div className="testimonial-info">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <h3>{testimonial.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
