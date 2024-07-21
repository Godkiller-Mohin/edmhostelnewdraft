import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '2024-07-23',
    checkOut: '2024-07-30',
    guests: 1,
    rooms: 1,
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, speaker, waves = [];

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Create speaker
      const speakerGroup = new THREE.Group();

      // Speaker body
      const bodyGeometry = new THREE.BoxGeometry(2, 3, 1);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      speakerGroup.add(body);

      // Speaker cone
      const coneGeometry = new THREE.CircleGeometry(0.8, 32);
      const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x404040, side: THREE.DoubleSide });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.z = 0.51;
      speakerGroup.add(cone);

      // Speaker grill
      const grillGeometry = new THREE.RingGeometry(0.2, 0.8, 32);
      const grillMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
      const grill = new THREE.Mesh(grillGeometry, grillMaterial);
      grill.position.z = 0.52;
      speakerGroup.add(grill);

      scene.add(speakerGroup);
      speaker = speakerGroup;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xff00ff, 1);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00ffff, 1);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      camera.position.z = 5;
    };

    const createWave = () => {
        const startPoint = new THREE.Vector3(0, 0, 0.6);
        const endPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          0.6
        );
  
        const midPoint1 = new THREE.Vector3(
          startPoint.x + (endPoint.x - startPoint.x) * 0.25,
          startPoint.y + (endPoint.y - startPoint.y) * 0.25,
          startPoint.z + Math.random() * 2
        );
  
        const midPoint2 = new THREE.Vector3(
          startPoint.x + (endPoint.x - startPoint.x) * 0.75,
          startPoint.y + (endPoint.y - startPoint.y) * 0.75,
          startPoint.z + Math.random() * 2
        );
  
        const curve = new THREE.CatmullRomCurve3([
          startPoint,
          midPoint1,
          midPoint2,
          endPoint
        ]);
  
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
          linewidth: 2,
          transparent: true,
          opacity: 0.7,
        });
  
        const wave = new THREE.Line(geometry, material);
        scene.add(wave);
  
        waves.push({ 
          mesh: wave, 
          curve: curve,
          progress: 0,
          speed: 0.005 + Math.random() * 0.005,
        });
      };
  
      const animate = () => {
        requestAnimationFrame(animate);
  
        speaker.rotation.y += 0.01;
  
        if (Math.random() < 0.05) createWave();
  
        waves.forEach((wave, index) => {
          wave.progress += wave.speed;
  
          if (wave.progress > 1) {
            scene.remove(wave.mesh);
            waves.splice(index, 1);
          } else {
            const points = wave.curve.getPoints(50);
            const positions = wave.mesh.geometry.attributes.position.array;
  
            for (let i = 0; i <= wave.progress * 50; i++) {
              positions[i * 3] = points[i].x;
              positions[i * 3 + 1] = points[i].y;
              positions[i * 3 + 2] = points[i].z;
            }
  
            wave.mesh.geometry.attributes.position.needsUpdate = true;
            wave.mesh.material.opacity = 1 - wave.progress;
          }
        });
  
        renderer.render(scene, camera);
      };
  
      init();
      animate();
  
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        mountRef.current.removeChild(renderer.domElement);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking data:', bookingData);
    // Here you would typically send the data to a server
    setIsBookingOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white min-h-screen font-sans">
      <div ref={mountRef} className="fixed inset-0 z-0" />
      <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              EDM Hostel
            </motion.div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                  ) : (
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                  )}
                </svg>
              </button>
            </div>
            <AnimatePresence>
              {(isMenuOpen || window.innerWidth > 768) && (
                <motion.ul
                  className="md:flex md:space-x-8 absolute md:relative top-full left-0 right-0 bg-black md:bg-transparent p-4 md:p-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {['Home', 'About', 'Rooms', 'Events', 'Gallery', 'Contact'].map((item) => (
                    <motion.li
                      key={item}
                      className="cursor-pointer py-2 md:py-0"
                      whileHover={{ scale: 1.1, color: '#8B5CF6' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a href={`#${item.toLowerCase()}`}>{item}</a>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20"></div>
            <div className="absolute inset-0 bg-[url('/path/to/your/texture.png')] opacity-10"></div>
          </div>
          <motion.div
            className="text-center z-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              EDM Hostel Dharamshala
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-200">Where Beats Meet the Mountains</p>
            
            <motion.button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookingOpen(true)}
            >
              Book Now
            </motion.button>
          </motion.div>
        </section>

        {/* Add other sections here (About, Rooms, Events, Gallery, Contact) */}

      </main>

      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Book Your Stay</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor="checkIn">
                    Check In
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                    id="checkIn"
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor="checkOut">
                    Check Out
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                    id="checkOut"
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor="guests">
                    Guests
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                    id="guests"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor="rooms">
                    Rooms
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                    id="rooms"
                    name="rooms"
                    value={bookingData.rooms}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">EDM Hostel</h3>
              <p className="mb-4 text-gray-400">Experience the perfect blend of music and mountains in Dharamshala.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-400">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Rooms', 'Events', 'Gallery', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-400">Contact Us</h4>
              <p className="text-gray-400 mb-2"><i className="fas fa-map-marker-alt mr-2 text-purple-400"></i> 123 EDM Street, Dharamshala, India</p>
              <p className="text-gray-400 mb-2"><i className="fas fa-phone mr-2 text-purple-400"></i> +91 1234567890</p>
              <p className="text-gray-400 mb-2"><i className="fas fa-envelope mr-2 text-purple-400"></i> info@edmhostel.com</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-400">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none flex-grow"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EDM Hostel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Additional sections to add between main and footer

const AboutSection = () => (
  <section id="about" className="py-20 bg-gray-800">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-purple-400">About EDM Hostel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gray-300 mb-4">
            EDM Hostel is a unique blend of music and nature, nestled in the heart of Dharamshala. We offer a one-of-a-kind experience where electronic dance music meets the tranquility of the mountains.
          </p>
          <p className="text-gray-300 mb-4">
            Our hostel is designed for music lovers, adventurers, and those seeking a vibrant community. With state-of-the-art sound systems, regular DJ events, and breathtaking mountain views, EDM Hostel is your perfect getaway.
          </p>
          <motion.button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
        <div className="relative h-64 md:h-auto">
          <img
            src="/path/to/hostel-image.jpg"
            alt="EDM Hostel"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  </section>
);

const RoomsSection = () => (
  <section id="rooms" className="py-20 bg-gray-900">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-purple-400">Our Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Dorm', 'Private', 'Deluxe'].map((roomType) => (
          <motion.div
            key={roomType}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`/path/to/${roomType.toLowerCase()}-room.jpg`}
              alt={`${roomType} Room`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-purple-400">{roomType} Room</h3>
              <p className="text-gray-400 mb-4">Experience comfort and style in our {roomType.toLowerCase()} rooms.</p>
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const EventsSection = () => (
  <section id="events" className="py-20 bg-gray-800">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-purple-400">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {['Trance Night', 'Techno Fever', 'EDM Workshop'].map((event) => (
          <motion.div
            key={event}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`/path/to/${event.toLowerCase().replace(' ', '-')}.jpg`}
              alt={event}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-purple-400">{event}</h3>
              <p className="text-gray-400 mb-4">Join us for an unforgettable night of music and dance.</p>
              <p className="text-purple-300 mb-4"><i className="far fa-calendar-alt mr-2"></i> July 30, 2024</p>
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RSVP
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingPage;