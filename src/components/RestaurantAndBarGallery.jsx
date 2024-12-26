import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import "./imageGallery.css";
import image1 from "../assets/our-gallery-01.jpeg";
import image2 from "../assets/our-gallery-02.jpeg";
import image3 from "../assets/our-gallery-03.jpeg";
import image4 from "../assets/our-gallery-04.jpeg";
import image5 from "../assets/our-gallery-05.jpeg";
import image6 from "../assets/our-gallery-06.jpeg";
import image7 from "../assets/our-gallery-07.jpeg";
import image8 from "../assets/our-gallery-08.jpeg";

const RestaurantAndBarGallery = () => {
  const imageContainerRef = useRef(null);
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

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

      const viewportWidth = window.innerWidth;
      const fontSize = Math.min(150, viewportWidth * 0.2);
      backgroundText.style.fontSize = `${fontSize}px`;
    }
  }, [scrollProgress]);

  useEffect(() => {
    const imageElements = Array.from(imageContainerRef.current.children);
    let loop = horizontalLoop(imageElements, {
      speed: 1,
      repeat: -1,
      paddingRight: 25,
    });
    loop.play();
    return () => loop.kill();
  }, []);

  const handleViewMore = () => {
    navigate("/restaurant-and-bar");
  };

  return (
    <div className="gallery-wrapper" ref={sectionRef} id="restrobar ">
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          GALLERY
        </h2>
        <h2 className="main-heading" id="gallery">
          OUR GALLERY
        </h2>
      </div>
      <div className="imageContainer" ref={imageContainerRef}>
        <div className="image" style={{ backgroundImage: `url(${image1})` }} />
        <div className="image" style={{ backgroundImage: `url(${image2})` }} />
        <div className="image" style={{ backgroundImage: `url(${image3})` }} />
        <div className="image" style={{ backgroundImage: `url(${image4})` }} />
        <div className="image" style={{ backgroundImage: `url(${image5})` }} />
        <div className="image" style={{ backgroundImage: `url(${image6})` }} />
        <div className="image" style={{ backgroundImage: `url(${image7})` }} />
        <div className="image" style={{ backgroundImage: `url(${image8})` }} />
      </div>
      <div className="button-container">
        <button className="view-more-btn" onClick={handleViewMore}>
          <span>View More</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: true,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  tl.current = () => curIndex;
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}

export default RestaurantAndBarGallery;
