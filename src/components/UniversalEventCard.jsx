import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { Calendar, MapPin, Clock, Users, Ticket } from 'lucide-react';
import { formatEventDate } from '../data/dynamicEventsData';
import EventDetailsModal from './EventDetailsModal';

// Helper function to safely format date
const safeFormatDate = (date) => {
  try {
    if (!date) return 'Date not available';
    // If it's already a string, return as is
    if (typeof date === 'string') return date;
    // If it's a Date object, format it
    if (date instanceof Date) return formatEventDate(date);
    // If it's a string that can be parsed as a date
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return formatEventDate(parsedDate);
    }
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date not available';
  }
};

const UniversalEventCard = ({ event, index = 0, variant = 'default' }) => {
  const navigate = useNavigate();
  const { selectEvent } = useEventContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleBuyTicket = () => {
    console.log('Buy Ticket clicked for event:', event.id, event.title);
    selectEvent(event);
    navigate(`/ticket-booking/${event.id}`, { 
      state: { eventData: event } 
    });
  };

  const handleViewDetails = () => {
    setIsDetailsOpen(true);
  };

  // Different card variants for different pages
  const getCardStyles = () => {
    switch (variant) {
      case 'home':
        return "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm mx-auto w-full";
      case 'dark':
        return "group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 max-w-sm mx-auto w-full";
      default:
        return "group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 max-w-sm mx-auto w-full";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'home':
        return {
          title: "text-base sm:text-lg font-bold text-gray-800 mb-3 line-clamp-2",
          description: "text-gray-300 text-sm mb-4 line-clamp-2",
          detail: "text-gray-400 text-xs sm:text-sm",
          detailIcon: "text-yellow-400"
        };
      default:
        return {
          title: "text-base sm:text-lg lg:text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300",
          description: "text-gray-300 text-sm mb-4 line-clamp-2",
          detail: "text-gray-400 text-xs sm:text-sm",
          detailIcon: "text-yellow-400"
        };
    }
  };

  const styles = getTextStyles();

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={getCardStyles()}
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Event Type Badge */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span className="bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {event.type}
          </span>
        </div>

        {/* Price Badge - Dynamic based on event type */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <span className="bg-black/80 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            ₹{event.type === 'Drive-in' ? '899' : '799'}
          </span>
        </div>

        {/* Date Badge for home variant */}
        {variant === 'home' && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {safeFormatDate(event.date)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className={styles.title}>
          {event.title}
        </h3>
        
        <p className={styles.description}>
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
          <div className="flex items-center text-sm text-gray-400 mb-1">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            <span>{safeFormatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <Clock size={14} className="mr-2 text-yellow-400 sm:w-4 sm:h-4" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <MapPin size={14} className="mr-2 text-yellow-400 sm:w-4 sm:h-4" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <Users size={14} className="mr-2 text-yellow-400 sm:w-4 sm:h-4" />
            <span className="truncate">{event.capacity} seats available</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <motion.button
            onClick={handleBuyTicket}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-yellow-400 text-black py-3 px-4 sm:px-6 rounded-full font-bold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30 flex items-center justify-center min-h-[44px] text-sm sm:text-base"
          >
            <Ticket size={16} className="mr-2" />
            Buy Ticket
          </motion.button>
          <motion.button
            onClick={handleViewDetails}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300 min-h-[44px] text-sm sm:text-base"
          >
            Details
          </motion.button>
        </div>
      </div>

      {/* Hover Overlay for dark variant */}
      {variant !== 'home' && (
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
    </motion.div>
    <EventDetailsModal
      isOpen={isDetailsOpen}
      onClose={() => setIsDetailsOpen(false)}
      event={event}
      onBuyTicket={handleBuyTicket}
    />
    </>
  );
};

export default UniversalEventCard;
