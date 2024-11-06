import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  // Note: Uncomment and add API key when ready to implement weather
  // const [weather, setWeather] = useState(null);
  
  // useEffect(() => {
  //   const fetchWeather = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.openweathermap.org/data/2.5/weather?q=Dharamshala&units=metric&appid=YOUR_API_KEY`
  //       );
  //       const data = await response.json();
  //       setWeather(data);
  //     } catch (error) {
  //       console.error('Error fetching weather:', error);
  //     }
  //   };
  //   fetchWeather();
  // }, []);

  return (
    <footer className="bg-[#01231f] text-white py-12 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:border-r lg:border-gray-200/10 lg:pr-8">
            <h3 className="text-xl font-bold mb-6">EDM HOSTEL</h3>
            <p className="text-sm leading-relaxed">
              EDM Hostel in Dharamshala offers a peaceful place with modern
              amenities amidst the spiritual ambiance of the sacred town.
              Comfortable rooms, in-house restaurant, and warm hospitality make
              it an ideal choice for pilgrims and tourists seeking a tranquil
              stay near major attractions like the Aghanjar Temple and Triund
              Hill.
            </p>
          </div>

          {/* Contact Section */}
          <div className="lg:border-r lg:border-gray-200/10 lg:pr-8">
            <h3 className="text-xl font-bold mb-6">CONTACT US</h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>EDM Hostel, Upper Dharamkot, Dharamshala, HP. 176219</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+91 8091977846</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>edmhostel@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Weather Section */}
          <div className="lg:border-r lg:border-gray-200/10 lg:pr-8">
            <h3 className="text-xl font-bold mb-6">WEATHER</h3>
            <div className="text-sm space-y-2">
              <h4 className="text-lg font-semibold">DHARAMSHALA</h4>
              {/* Weather API integration will go here */}
              <p>Rainy</p>
              <p>22°C</p>
            </div>
          </div>

          {/* Maps Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">LOCATION</h3>
            <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
              {/* Google Maps integration will go here */}
              <div className="w-full h-full flex items-center justify-center text-sm">
                Map Loading...
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200/10">
          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            {['facebook', 'instagram', 'linkedin', 'twitter'].map((platform) => (
              <a
                key={platform}
                href={`https://www.${platform}.com/yourpage`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={`/images/${platform}-icon.png`}
                  alt={platform}
                  className="w-6 h-6"
                />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center text-sm mb-4">© 2024 EDM Hostel</p>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <Link to="/privacy" className="hover:underline">
              PRIVACY POLICY
            </Link>
            <div className="flex items-center">
              <span className="mr-2">WEBSITE BY</span>
              <a 
                href="https://www.linkedin.com/in/mohin-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline mx-1"
              >
                Mohin
              </a>
              <span className="mx-1">•</span>
              <a 
                href="https://www.linkedin.com/in/anant-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline mx-1"
              >
                Anant
              </a>
              <span className="mx-1">•</span>
              <a 
                href="https://www.linkedin.com/in/suryansh-profile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline mx-1"
              >
                Suryansh
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;