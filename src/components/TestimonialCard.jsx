import React, { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';

const TestimonialSelector = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Darya Soboleva",
      role: "Local Guide",
      text: "Great place to connect with people , artists and music! Very cozy accommodation, all wooden- makes you want to spend time there. Be mindful if you need a quite space because this can be an issue. Staff is incredibly friendly and food there is also very good.",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%234F46E5'/%3E%3Ccircle cx='50' cy='95' r='40' fill='%234F46E5'/%3E%3C/svg%3E"
    },
    {
      id: 2,
      name: "Tobias B.",
      role: "Traveller",
      text: "I was 5 nights at the EDM Hostel. At Weekend there where live DJ's and good Party and during the week it was really chill Out. I had Private room, which was super clean and IT Had a stunning view over the Hills. All in all IT was an amazing experience which i definitely recommend to everyone. Much Love to the super welcoming staff. You are amazing.",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%23EC4899'/%3E%3Ccircle cx='50' cy='95' r='40' fill='%23EC4899'/%3E%3C/svg%3E"
    },
    {
      id: 3,
      name: "Qaiser Lone",
      role: "Guest",
      text: "You might have heard about the saying  that it took my breath away, the place is such that it will surely 'take your breath away'. The food, mocktails and smoke  were no different. I would surely want to be here again.",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%2310B981'/%3E%3Ccircle cx='50' cy='95' r='40' fill='%2310B981'/%3E%3C/svg%3E"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Background Text (Hidden on Mobile) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden sm:flex">
        <h2 
          className={`text-7xl sm:text-8xl md:text-9xl font-bold text-white/5 whitespace-nowrap transition-all duration-1000 transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          TESTIMONIALS
        </h2>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-700 transform
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            What Our Guests Say
          </h3>
          <p 
            className={`text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 transform
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Real experiences from our valued guests who have stayed with us
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform transition-all duration-700 hover:scale-105 hover:bg-white/15
                ${isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col h-full">
                {/* Avatar and Info */}
                <div className="flex items-center mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-indigo-600/10">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 ring-2 ring-white/20 rounded-full" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="text-indigo-500/20 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 flex-grow leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSelector;