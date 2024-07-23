import React from 'react';

const RoomCard = ({ imageSrc, title, description }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex overflow-hidden relative flex-col grow items-start pt-20 pr-20 pb-5 pl-5 text-white aspect-[0.95] max-md:pr-5 max-md:mt-5">
        <img loading="lazy" src={imageSrc} alt={title} className="object-cover absolute inset-0 size-full" />
        <div className="relative mt-72 text-2xl max-md:mt-10">{title}</div>
        <div className="relative text-base">{description}</div>
      </div>
    </div>
  );
};

export default RoomCard;