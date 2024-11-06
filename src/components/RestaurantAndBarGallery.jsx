import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./imageGallery.css";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image1.jpg";
import image3 from "../assets/image1.jpg";
import image4 from "../assets/image1.jpg";
import image5 from "../assets/image1.jpg";
import image6 from "../assets/image1.jpg";
import image7 from "../assets/image1.jpg";
import image8 from "../assets/image1.jpg";

const RestaurantAndBarGallery = () => {
  const imageContainerRef = useRef(null);
  const backgroundTextRef = useRef(null);

  useEffect(() => {
    const imageElements = Array.from(imageContainerRef.current.children);

    let loop = horizontalLoop(imageElements, {
      speed: 1,
      repeat: -1,
      paddingRight: 25,
    });

    loop.play();

    return () => {
      loop.kill();
    };
  }, []);

  return (
    <div className="wrapper">
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          RESTAURANT & BAR
        </h2>
        <h2 className="main-heading">IMAGE GALLERY</h2>
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
    </div>
  );
};

export default RestaurantAndBarGallery;

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
