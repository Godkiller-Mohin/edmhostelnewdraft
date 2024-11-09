import React, { useEffect, useRef } from 'react';
import bar1Image from "../assets/bar1.jpg";
import partyImage from "../assets/bar1.jpg";
import rechargeImage from "../assets/bar1.jpg";
import viewImage from "../assets/bar1.jpg";

const Introduction = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-5');
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetDirections = () => {
    window.open(
      "https://www.google.com/maps/dir//village,+hainee,+Dharamshala,+Himachal+Pradesh+176219/@32.2514086,76.2485566,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x391b57ac6558003b:0x214eab8f6a6cdfa!2m2!1d76.3309579!2d32.2514353?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  const handleBookNow = () => {
    window.location.href = "/";
  };

  const sections = [
    {
      title: "Welcome to the Ultimate Adventure",
      text: "Sitting high up at 6900 feet, EDM Hostel in Dharamshala is where your adventure meets a party you'll never forget. As India's first-ever party hostel, we're here to redefine what it means to have a good time.",
      image: bar1Image,
      alt: "Adventure"
    },
    {
      title: "Party Like There's No Tomorrow",
      text: "Whether you're vibing to the beats, catching a killer sunset, or meeting new friends, this is the ultimate hangout for party lovers—the kind of place where you come for one night and stay for a week.",
      image: partyImage,
      alt: "Party"
    },
    {
      title: "Recharge and Rejuvenate",
      text: "Mondays, Tuesdays, and Wednesdays are reserved for recharging your energy with stuff like movement workshops, contact improv, breathwork, and ecstatic dances. It's all about getting in sync with yourself, your people, and the mountain vibes.",
      image: rechargeImage,
      alt: "Recharge"
    },
    {
      title: "Unrivaled Views",
      text: "Oh, and did we mention our restaurant has the best view in Dharamkot and Dharamshala? Yeah, whether it's breakfast with a killer sunrise or cocktails at golden hour, you won't find a better backdrop for your Instagram feed.",
      image: viewImage,
      alt: "View"
    }
  ];

  return (
    <div className="bg-[#032a25] text-[#e0d7c7] font-sans pt-40 min-h-screen">
      <div className="max-w-7xl mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {sections.map((section, index) => (
            <section
              key={index}
              ref={el => sectionRefs.current[index] = el}
              className="opacity-0 translate-y-5 transition-all duration-600 ease-out mb-20" // Increased bottom margin
            >
              <div className="relative inline-block mb-12 group"> {/* Increased margin bottom */}
                <h2 className="text-5xl md:text-5xl sm:text-2xl mb-3"> {/* Increased margin bottom */}
                  {section.title}
                </h2>
                <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#e0d7c7] transition-all duration-300 group-hover:w-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"> {/* Increased gap */}
                <div className="md:order-1 order-2 space-y-6"> {/* Added space between paragraphs */}
                  <p className="text-2xl leading-relaxed mt-8 opacity-90 hover:opacity-100 transition-opacity duration-300">
                    {section.text}
                  </p>
                </div>
                
                <div className="perspective-1000 md:order-2 order-1 group">
                  <div className="relative overflow-hidden rounded-xl transform-gpu transition-all duration-500 
                              hover:rotate-y-12 hover:scale-105 hover:shadow-2xl
                              before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#032a25]/20 before:to-transparent before:z-10
                              after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[#032a25]/20 after:z-10">
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                    <img
                      src={section.image}
                      alt={section.alt}
                      className="w-full h-[400px] sm:h-[350px] xs:h-[300px] object-cover transition-all duration-500 
                              group-hover:scale-110 group-hover:rotate-3"
                    />
                    <div className="absolute inset-0 border-2 border-[#e0d7c7]/0 group-hover:border-[#e0d7c7]/20 
                                transition-all duration-500 z-30 rounded-xl 
                                group-hover:scale-95"></div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="relative lg:order-2 order-1">
          <div className="lg:sticky lg:top-20 bg-[#032221] p-8 rounded-xl shadow-lg
                       hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <h2 className="text-3xl text-center mb-8 font-bold">Our Working Hours</h2> {/* Increased margin */}
            <div className="w-12 h-0.5 bg-[#e0d7c7] mx-auto mb-10 transition-all duration-300 hover:w-24"></div> {/* Increased margin */}
            
            <div className="mb-10"> {/* Increased margin */}
              <h3 className="text-xl mb-4 font-semibold">Restaurant and Bar</h3>
              <p className="text-base opacity-90 mb-3 hover:opacity-100 transition-opacity duration-300">
                Monday - Friday | 12PM - 12AM
              </p>
              <p className="text-base opacity-90 mb-3 hover:opacity-100 transition-opacity duration-300">
                Saturday - Sunday | 11AM - 12AM
              </p>
            </div>
            
            <div className="mb-10"> {/* Increased margin */}
              <h3 className="text-xl mb-4 font-semibold">Event Timings</h3>
              <p className="text-base opacity-90 hover:opacity-100 transition-opacity duration-300">
                Wednesday - Sunday | 5PM - 12AM
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-col gap-6 mt-10"> {/* Increased gap */}
              <button
                onClick={handleBookNow}
                className="px-8 py-4 text-base font-semibold uppercase tracking-wider border-2 border-[#e0d7c7] 
                         text-[#e0d7c7] rounded-md transition-all duration-300 
                         hover:bg-[#e0d7c7] hover:text-[#032a25] hover:-translate-y-1 
                         hover:shadow-lg active:translate-y-0"
              >
                Book Now
              </button>
              
              <button
                onClick={handleGetDirections}
                className="px-8 py-4 text-base font-semibold uppercase tracking-wider bg-[#e0d7c7] 
                         text-[#032a25] rounded-md transition-all duration-300 
                         hover:bg-[#032a25] hover:text-[#e0d7c7] hover:border-2 
                         hover:border-[#e0d7c7] hover:-translate-y-1 hover:shadow-lg 
                         active:translate-y-0"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;