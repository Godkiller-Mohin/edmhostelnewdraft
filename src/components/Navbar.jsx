import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if welcome animation has already been played
    const welcomePlayed = localStorage.getItem("welcomeAnimationPlayed");
    
    if (welcomePlayed) {
      // If animation was already played, render navbar immediately
      setShouldRender(true);
    } else {
      // If animation hasn't been played, wait for 5 seconds before rendering
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 5000); // Match this with the welcome animation duration

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY === 0);
      setIsVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      setIsMenuOpen(false);

      setTimeout(() => {
        const headerOffset = window.innerWidth >= 1024 ? 80 : 56;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 300);
    }
  };

  const handleSmoothScroll = async (e, targetId) => {
    e.preventDefault();

    if (targetId === "./introduction") {
      setIsMenuOpen(false);
      navigate(targetId);
      return;
    }

    const elementId = targetId.replace("#", "");
    const isHomePage = location.pathname === "/";

    if (!isHomePage) {
      await navigate("/");
      setTimeout(() => {
        scrollToSection(elementId);
      }, 300);
    } else {
      scrollToSection(elementId);
    }
  };

  const menuItems = [
    { label: "EVENTS", href: "#events" },
    { label: "STAY", href: "#stay" },
    { label: "RESTAURANT & BAR", href: "#restrobar" },
    { label: "BLOGS", href: "#blogs" },
    { label: "ABOUT US", href: "./introduction" },
    { label: "CONTACT", href: "#contact" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!isMenuOpen && (
          <motion.nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              !isAtTop ? "bg-black/50 backdrop-blur-sm" : ""
            }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: isVisible ? 0 : "-100%", opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full lg:px-6">
              <div className="max-w-[1440px] mx-auto flex items-center justify-between h-28 lg:h-24">
                <motion.div
                  className="pointer-events-auto cursor-pointer ml-0 lg:ml-0 mt-8 mb-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleLogoClick}
                >
                  <img
                    src="/images/logo.png"
                    alt="EDM Logo"
                    className="h-48 w-auto object-contain"
                  />
                </motion.div>
                <motion.div
                  className="hidden lg:flex items-center"
                  variants={navVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center text-base mr-6">
                    {menuItems.map(({ label, href }) => (
                      <motion.a
                        key={label}
                        href={href}
                        onClick={(e) => handleSmoothScroll(e, href)}
                        className="mr-7 text-white hover:text-[#c69947] transition-colors duration-200"
                        variants={itemVariants}
                      >
                        {label}
                      </motion.a>
                    ))}
                  </div>
                  <motion.button
                    variants={itemVariants}
                    className="border-2 border-[#c69947] text-[#c69947] px-2 py-2 text-base cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    PLAN YOUR EXPERIENCE WITH US
                  </motion.button>
                </motion.div>
                <div className="lg:hidden flex items-center justify-end pointer-events-auto mt-6 mb-4">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white mr-5 z-50"
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 w-full h-full bg-black z-40 lg:hidden overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center min-h-screen py-20 px-6 space-y-5 relative">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X size={24} />
              </button>
              {menuItems.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="text-lg text-white hover:text-[#c69947] transition-colors duration-200"
                  variants={itemVariants}
                  onClick={(e) => handleSmoothScroll(e, href)}
                >
                  {label}
                </motion.a>
              ))}
              <motion.button
                variants={itemVariants}
                className="border-2 border-[#c69947] text-[#c69947] px-6 py-2 text-lg hover:bg-[#c69947] hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                PLAN YOUR EXPERIENCE
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;