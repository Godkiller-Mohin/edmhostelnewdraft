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

const GalleryImage = ({ src, alt }) => (
  <div className="gallery-image-container">
    <img src={src} alt={alt} className="gallery-image" />
  </div>
);

const HorizontalScrollingGallery = () => {
  const galleryRef = useRef(null);

  const handleScroll = (direction) => {
    const gallery = galleryRef.current;
    const scrollAmount = gallery.clientWidth * 0.8; // Scroll 80% of the visible width

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
    { src: "/images/food1.jpg", alt: "Gallery Image 7" },
    { src: "/images/food1.jpg", alt: "Gallery Image 8" },
    { src: "/images/food1.jpg", alt: "Gallery Image 9" },
    { src: "/images/food1.jpg", alt: "Gallery Image 10" },
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
          <GalleryImage key={index} {...image} />
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      <section className="restaurant-menu">
        <h1 className="main-title">RESTAURANT MENU</h1>
        <p className="subtitle">
          Feast your eyes (and stomach) on this mouth-watering food
        </p>
        <div className="menu-grid">
          {restaurantMenuItems.map((item, index) => (
            <MenuCard key={`restaurant-${index}`} {...item} />
          ))}
        </div>
      </section>
      <section className="bar-menu">
        <h1 className="main-title">BAR MENU</h1>
        <p className="subtitle">
          Discover our expertly crafted drinks and spirits
        </p>
        <div className="menu-grid">
          {barMenuItems.map((item, index) => (
            <MenuCard key={`bar-${index}`} {...item} />
          ))}
        </div>
      </section>
      <section className="gallery-section">
        <h1 className="main-title">OUR GALLERY</h1>
        <p className="subtitle">
          Scroll through our beautiful restaurant and bar
        </p>
        <HorizontalScrollingGallery />
      </section>
    </div>
  );
};

export default RestaurantAndBarMenu;
