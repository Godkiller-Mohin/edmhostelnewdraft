import React from 'react';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-indigo-900 text-white">
        <div className="text-4xl font-bold">VENUE</div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">Events</a></li>
            <li><a href="#" className="hover:text-gray-300">Music</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
          </ul>
        </nav>
        <div className="flex space-x-2">
          <a href="#" className="text-2xl"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-2xl"><i className="fab fa-facebook"></i></a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <img src="path-to-your-hero-image.jpg" alt="Venue" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-6xl font-bold">Experience the Beat</h1>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EventCard 
              title="DJ Night"
              date="July 25, 2024"
              image="path-to-event-image1.jpg"
            />
            <EventCard 
              title="Live Band Performance"
              date="July 26, 2024"
              image="path-to-event-image2.jpg"
            />
            <EventCard 
              title="Electronic Music Festival"
              date="July 27-28, 2024"
              image="path-to-event-image3.jpg"
            />
          </div>
        </div>
      </section>

      {/* Music Lineup Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">This Week's Lineup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MusicLineupItem 
              day="Friday"
              artist="DJ Rockin' Beat"
              genre="House & Techno"
            />
            <MusicLineupItem 
              day="Saturday"
              artist="The Melody Makers"
              genre="Live Jazz"
            />
            <MusicLineupItem 
              day="Sunday"
              artist="Electro Soundwave"
              genre="Electronic"
            />
            <MusicLineupItem 
              day="Wednesday"
              artist="Acoustic Sessions"
              genre="Indie & Folk"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">VENUE</h3>
            <p>123 Music Street, Cityville, ST 12345</p>
          </div>
          <div className="mb-4 md:mb-0">
            <h4 className="text-xl font-bold mb-2">Opening Hours</h4>
            <p>Monday-Sunday: 8pm-2am</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Contact Us</h4>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@venue.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EventCard({ title, date, image }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{date}</p>
      </div>
    </div>
  );
}

function MusicLineupItem({ day, artist, genre }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-2">{day}</h3>
      <p className="text-lg">{artist}</p>
      <p className="text-gray-600">{genre}</p>
    </div>
  );
}

export default App;