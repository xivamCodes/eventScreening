import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

const EventDetailsModal = ({ isOpen, onClose, event, onBuyTicket }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-2xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Close button */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Banner */}
            <div className="w-full h-40 sm:h-56 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{event.title}</h3>
              {event.description && (
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {event.date && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.date}</span>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {/* Price based on event type */}
              <div className="mb-6">
                <span className="text-gray-400 text-sm">Price</span>
                <div className="text-yellow-400 font-bold text-lg">
                  ₹{event.type === 'Drive-in' ? '899' : '799'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={onBuyTicket}
                  className="w-full sm:flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors min-h-[44px]"
                >
                  Buy Ticket
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 border border-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;


