import React from 'react';
import Header from './pages/Header';
import RoomCard from './pages/RoomCard';
import FeatureSection from './pages/FeatureSection';
import Footer from './pages/Footer';

const roomData = [
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/481a68e8b24fbfe5117d125c5abf6aa1bc2966f0be1b41d3417935ff07069ace?apiKey=378b307ec7f2406f9bd824321d02b92d&", title: "Deluxe Room", description: "With Mountain View" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3a28dd8acd38fe190459790c5e88bd99783667c836c45f09da0781edf7ca2dc?apiKey=378b307ec7f2406f9bd824321d02b92d&", title: "Standard Room", description: "With Mountain View" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e83dabfc06cef23cfff71042dceb81bcc894b57227e110317393984f11c8606d?apiKey=378b307ec7f2406f9bd824321d02b92d&", title: "Mixed Dorm", description: "With 8 Bunk beds" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ec3632605106bd37e90caa75abdcff0e166b5b839b447b1375468625f7bc46fa?apiKey=378b307ec7f2406f9bd824321d02b92d&", title: "Male Dorm", description: "With 6 Bunk beds" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/138c160a5a61d0c2035fba865119bad303119371d07c2e0ab9dd0aeda3be8913?apiKey=378b307ec7f2406f9bd824321d02b92d&", title: "Female Dorm", description: "With 6 Bunk beds" }
];

const featureSections = [
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/a5e3ddf70609b5219239fbecbe7f4d95750a1bbfe45c81ada681b4fc41f4c1bf?apiKey=378b307ec7f2406f9bd824321d02b92d&",
    content: "At the EDM Hostel, you'll find yourself immersed in a vibrant tapestry of cultures and nationalities. It's more than just a place to stay; it's a melting pot of stories, experiences, and friendships waiting to be made."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/56f17d7e4f0558cbf60ce7d4a1e534a2256f9ecb52094b092c75235fc4624b1f?apiKey=378b307ec7f2406f9bd824321d02b92d&",
    content: "Mountain views, music, and pure bliss—that's the EDM Hostel experience in a nutshell. Nestled amidst breathtaking mountain scenery, the hostel offers a stunning backdrop for your adventures."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/a9cb9dfd7ec3c3fbbddb7db8d985acd262eca9fa14fa8d6c70313f758366b3df?apiKey=378b307ec7f2406f9bd824321d02b92d&",
    content: "Let the electronic music electrify your dance moves as you bounce, jump, and vibe with fellow travelers."
  }
];

function HostelPage() {
  return (
    <main className="flex flex-col pt-7 pb-20 bg-white">
      <Header />
      <section className="flex flex-col items-center px-5 pb-12 mt-14 w-full bg-zinc-900 max-md:mt-10 max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5319d1f5d0ab7359b19256ea775d27a691f41f8b273276ae8d59e1cd7797fa6d?apiKey=378b307ec7f2406f9bd824321d02b92d&" alt="Hostel exterior" className="z-10 self-stretch mt-0 w-full aspect-[2] max-md:max-w-full" />
        <h1 className="mt-11 text-6xl text-white max-md:mt-10 max-md:text-4xl">Book Your Stay</h1>
        <h2 className="text-3xl text-center text-white">At India's First party hostel</h2>
        <div className="mt-10 w-full max-w-screen-xl max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {roomData.slice(0, 3).map((room, index) => (
              <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                <RoomCard {...room} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 max-w-full w-[847px]">
          <div className="flex gap-5 max-md:flex-col">
            {roomData.slice(3).map((room, index) => (
              <div key={index} className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <RoomCard {...room} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {featureSections.map((section, index) => (
        <FeatureSection key={index} {...section} />
      ))}
      <Footer />
    </main>
  );
}

export default HostelPage;