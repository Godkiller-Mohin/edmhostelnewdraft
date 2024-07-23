import React from 'react';

const Header = () => {
  return (
    <header className="flex gap-5 justify-between self-center w-full text-lg text-black max-w-[1254px] max-md:flex-wrap max-md:max-w-full">
      <div className="flex gap-5 justify-between max-md:flex-wrap max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3116158f3e9e77ddedde7f9a2764627614e2d673256f3defd84bd9bb8b2a6c94?apiKey=378b307ec7f2406f9bd824321d02b92d&" alt="Company logo" className="shrink-0 aspect-[1.39] w-[88px]" />
        <nav className="flex gap-5 justify-between px-5 my-auto max-md:flex-wrap">
          <a href="#rooms">Rooms</a>
          <a href="#restaurant">Restaurant</a>
          <a href="#bar">Bar</a>
          <a href="#events">Events</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
        </nav>
      </div>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/145283d7f5f8525218e24f47c33785f997e2a7fc0bd715fc70a5e3b79f670346?apiKey=378b307ec7f2406f9bd824321d02b92d&" alt="User profile icon" className="shrink-0 my-auto aspect-square w-[35px]" />
    </header>
  );
};

export default Header;