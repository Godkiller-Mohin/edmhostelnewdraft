import React from 'react';

const FeatureSection = ({ imageSrc, content }) => {
  return (
    <section className="flex overflow-hidden relative flex-col px-10 pb-10 w-full text-2xl font-semibold tracking-normal text-white min-h-[592px] pt-[464px] max-md:px-5 max-md:pt-10 max-md:max-w-full">
      <img loading="lazy" src={imageSrc} alt="Feature background" className="object-cover absolute inset-0 size-full" />
      {content}
    </section>
  );
};

export default FeatureSection;