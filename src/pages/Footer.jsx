import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center px-16 pt-7 pb-20 w-full text-black bg-stone-200 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col mb-1 max-w-full w-[804px]">
        <div className="flex gap-5 justify-between text-3xl font-semibold tracking-normal max-md:flex-wrap max-md:max-w-full">
          <h3>Location</h3>
          <h3>Opening Hour</h3>
          <h3>Contact Us</h3>
        </div>
        <div className="flex gap-5 justify-between mt-9 max-w-full text-lg w-[517px] max-md:flex-wrap">
          <p>EDM Hostel, Upper Dharamkot, Dharamshala, HP. 176219</p>
          <p>EDM Hostel, Upper Dharamkot, Dharamshala, HP. 176219</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;