import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./RestaurantAndBar.css";
const MenuCard = ({ title, description, image }) => (
  <div className="menu-card">
    <img src={image} alt={title} className="menu-card-image" />
    <div className="menu-card-content">
      <h2 className="menu-card-title">{title}</h2>
      <p className="menu-card-description">{description}</p>
    </div>
  </div>
);

const HorizontalScrollingGallery = () => {
  const galleryRef = useRef(null);

  const handleScroll = (direction) => {
    const gallery = galleryRef.current;
    const scrollAmount = gallery.clientWidth * 0.8;

    if (direction === "left") {
      gallery.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      gallery.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const images = [
    { src: "/images/food1.jpg", alt: "Gallery Image 1" },
    { src: "/images/food2.jpg", alt: "Gallery Image 2" },
    { src: "/images/food3.jpg", alt: "Gallery Image 3" },
    { src: "/images/bar1.jpg", alt: "Gallery Image 4" },
    { src: "/images/bar2.jpg", alt: "Gallery Image 5" },
    { src: "/images/bar3.jpg", alt: "Gallery Image 6" },
  ];

  return (
    <div className="gallery-wrapper">
      <button
        className="gallery-arrow left"
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft size={24} />
      </button>
      <div className="horizontal-scrolling-gallery" ref={galleryRef}>
        {images.map((image, index) => (
          <div key={index} className="gallery-image-container">
            <img src={image.src} alt={image.alt} className="gallery-image" />
          </div>
        ))}
      </div>
      <button
        className="gallery-arrow right"
        onClick={() => handleScroll("right")}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const RestaurantAndBarMenu = () => {
  const [activeTab, setActiveTab] = useState("restaurant");
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText) {
      const xPosition = (scrollProgress - 0.5) * 200;
      backgroundText.style.transform = `translate(-50%, -30%) translateX(${xPosition}%)`;
    }
  }, [scrollProgress]);

  const restaurantMenuItems = [
    {
      title: "Austin Menu",
      description: "Food, Cocktails, Beers and Wines",
      image: "/images/food1.jpg",
    },
    {
      title: "Tex-Mex Platter",
      description: "A delicious assortment of Tex-Mex favorites",
      image: "/images/food1.jpg",
    },
    {
      title: "Chef's Special",
      description: "Daily curated dish by our expert chef",
      image: "/images/food1.jpg",
    },
  ];

  const barMenuItems = [
    {
      title: "Classic Cocktails",
      description: "Timeless favorites crafted to perfection",
      image: "/images/bar1.jpg",
    },
    {
      title: "Craft Beers",
      description: "Local and international brews on tap",
      image: "/images/bar2.jpg",
    },
    {
      title: "Wine Selection",
      description: "Curated wines from around the world",
      image: "/images/bar3.jpg",
    },
  ];

  return (
    <div className="restaurant-and-bar-menu" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          MENU
        </h2>
      </div>

      <div className="content-wrapper">
        <h1 className="main-title">RESTAURANT AND BAR MENU</h1>
        <p className="subtitle">
          Discover our culinary delights and refreshing beverages
        </p>

        <div className="menu-tabs">
          <button
            className={`menu-tab ${activeTab === "restaurant" ? "active" : ""}`}
            onClick={() => setActiveTab("restaurant")}
          >
            Restaurant Menu
          </button>
          <button
            className={`menu-tab ${activeTab === "bar" ? "active" : ""}`}
            onClick={() => setActiveTab("bar")}
          >
            Bar Menu
          </button>
        </div>

        {activeTab === "restaurant" && (
          <section className="restaurant-menu">
            <div className="menu-grid">
              {restaurantMenuItems.map((item, index) => (
                <MenuCard key={`restaurant-${index}`} {...item} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "bar" && (
          <section className="bar-menu">
            <div className="menu-grid">
              {barMenuItems.map((item, index) => (
                <MenuCard key={`bar-${index}`} {...item} />
              ))}
            </div>
          </section>
        )}

        <section className="gallery-section">
          <h1 className="main-title">FOOD GALLERY</h1>
          <p className="subtitle">
            Scroll through our beautiful restaurant and bar
          </p>
          <HorizontalScrollingGallery />
        </section>
      </div>
    </div>
  );
};

export default RestaurantAndBarMenu;
