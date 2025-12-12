import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JoinClubModal from './JoinClubModal';
import { FaShieldAlt, FaStar, FaTicketAlt, FaMapMarkerAlt, FaHeadset } from 'react-icons/fa';
import { SiTrustpilot } from 'react-icons/si';

const Hero = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section.relative');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        // Start fading out when 25% of hero is scrolled
        const opacity = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 0.25)));
        setIsVisible(opacity > 0.1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to hero bottom if events section is not found
      const heroSection = document.querySelector('section.relative');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo({
          top: heroBottom - 60,
          behavior: 'smooth'
        });
      }
    }
  };
  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg "width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg%3E%3Cg"  fillRule="evenodd%3E%3Cg" fill="%23ffffff" fillOpacity="0.1%3E%3Ccircle" cx="30" cy="30" r="2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E">
        </div>
      </div>

      {/* Trust Badges */}
      <div className="absolute top-4 right-4 z-30 hidden md:flex items-center space-x-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
        <div className="flex items-center text-yellow-400">
          <FaStar className="mr-1" />
          <span className="text-white text-sm font-medium">4.9/5</span>
        </div>
        <div className="h-4 w-px bg-gray-500"></div>
        <div className="flex items-center text-green-400">
          <FaShieldAlt className="mr-1" />
          <span className="text-white text-sm">Secure Booking</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ height: 'calc(100vh - 2rem)' }}>
          <div className="text-center w-full">
            {/* Trusted By */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <SiTrustpilot className="text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-white">Trusted by 50,000+ movie lovers</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 sm:mb-12"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                India's Only
                <span className="block text-yellow-400">Immersive Cinema</span>
                <span className="block">Experience</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                Experience the magic of movies under the stars at premium drive-in and open-air venues across India
              </p>
              
              {/* Value Propositions */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-8">
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/5">
                  <FaTicketAlt className="text-yellow-400 text-2xl mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium">Easy Online Booking</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/5">
                  <FaMapMarkerAlt className="text-yellow-400 text-2xl mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium">Prime Locations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/5">
                  <FaShieldAlt className="text-yellow-400 text-2xl mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium">100% Secure</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/5">
                  <FaHeadset className="text-yellow-400 text-2xl mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium">24/7 Support</p>
                </div>
              </div> */}
            </motion.div>

            <div className="flex flex-col items-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
              >
                <button onClick={openModal} className="w-full sm:w-auto bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[44px]">
                  Join The Club
                </button>
                <button onClick={scrollToContent} className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 min-h-[44px] transition-transform hover:scale-105">
                  View Events
                </button>
              </motion.div>
              
              {/* Modern Mouse Scroll Animation */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full flex flex-col items-center justify-center group cursor-pointer mt-8"
                onClick={scrollToContent}
              >
                <div className="relative w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-1.5 mb-2 group-hover:border-yellow-400 transition-all duration-300">
                  <motion.div
                    className="w-1.5 h-2 bg-white/80 rounded-full mt-1.5"
                    animate={{
                      y: [0, 10, 0],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <span className="text-white/80 text-xs font-medium tracking-wider uppercase group-hover:text-yellow-400 transition-colors duration-300">
                  Scroll Down
                </span>
                <motion.div 
                  className="w-8 h-8 mt-1 flex items-center justify-center"
                  animate={{
                    y: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/80 group-hover:text-yellow-400 transition-colors duration-300"
                  >
                    <path 
                      d="M6 1V11M6 11L11 6M6 11L1 6" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating Elements - Hidden on mobile for performance */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute top-1/4 left-10 text-yellow-400 text-6xl opacity-20"
            >
              🎬
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute top-1/3 right-10 text-yellow-400 text-4xl opacity-20"
            >
              🍿
            </motion.div>
            <motion.div
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute bottom-1/4 left-20 text-yellow-400 text-5xl opacity-20"
            >
              🌟
            </motion.div>
          </div>
        </div>

      {/* Join Club Modal */}
      <JoinClubModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
};

export default Hero;
