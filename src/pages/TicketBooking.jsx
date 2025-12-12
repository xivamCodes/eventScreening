import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star, ChevronRight, AlertCircle, CheckCircle, Loader2, ChevronDown, Check } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import emailjs from '@emailjs/browser';

// Modern state management with useReducer
const initialBookingState = {
  ticketCount: 1,
  seatPreference: 'C', // Default to regular fare (C Row)
  seatPremiumSurcharge: 0,
  customerInfo: {
    name: '',
    email: ''
  },
  coupon: {
    code: '',
    discount: 0,
    message: '',
    isValid: false,
    isApplying: false
  },
  validation: {
    errors: {},
    isValid: true
  },
  ui: {
    isProcessing: false,
    showConfirmation: false
  }
};

// Seat preference options with pricing
const SEAT_PREFERENCES = [
  { id: 'C', label: 'C Row (Regular) - Default', premium: false, surcharge: 0 },
  { id: 'D', label: 'D Row (Regular)', premium: false, surcharge: 0 },
  { id: 'E', label: 'E Row (Regular)', premium: false, surcharge: 0 },
  { id: 'F', label: 'F Row (Regular)', premium: false, surcharge: 0 },
  { id: 'A', label: 'A Row (Premium Corner)', premium: true, surcharge: 400 },
  { id: 'B', label: 'B Row (Premium Corner)', premium: true, surcharge: 400 },
  { id: 'G', label: 'G Row (Premium Corner)', premium: true, surcharge: 400 },
  { id: 'H', label: 'H Row (Premium Corner)', premium: true, surcharge: 400 },
  { id: 'I', label: 'I Row (VIP Premium)', premium: true, surcharge: 600 },
  { id: 'J', label: 'J Row (VIP Premium)', premium: true, surcharge: 600 },
];

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKET_COUNT':
      const newCount = Math.max(1, Math.min(2, action.payload));
      const currentPreference = SEAT_PREFERENCES.find(p => p.id === state.seatPreference);
      const newSurcharge = currentPreference ? currentPreference.surcharge * newCount : 0;
      return {
        ...state,
        ticketCount: newCount,
        seatPremiumSurcharge: newSurcharge
      };
    
    case 'SET_SEAT_PREFERENCE':
      const selectedPreference = SEAT_PREFERENCES.find(p => p.id === action.payload);
      const surcharge = selectedPreference ? selectedPreference.surcharge * state.ticketCount : 0;
      return {
        ...state,
        seatPreference: action.payload,
        seatPremiumSurcharge: surcharge
      };
    
    case 'SET_COUPON_CODE':
      return {
        ...state,
        coupon: { ...state.coupon, code: action.payload, message: '' }
      };
    
    case 'APPLY_COUPON_START':
      return {
        ...state,
        coupon: { ...state.coupon, isApplying: true, message: '' }
      };
    
    case 'APPLY_COUPON_SUCCESS':
      return {
        ...state,
        coupon: {
          ...state.coupon,
          discount: action.payload.discount,
          message: action.payload.message,
          isValid: true,
          isApplying: false
        }
      };
    
    case 'APPLY_COUPON_ERROR':
      return {
        ...state,
        coupon: {
          ...state.coupon,
          discount: 0,
          message: action.payload,
          isValid: false,
          isApplying: false
        }
      };
    
    case 'SET_VALIDATION_ERROR':
      return {
        ...state,
        validation: {
          errors: { ...state.validation.errors, ...action.payload },
          isValid: Object.keys({ ...state.validation.errors, ...action.payload }).length === 0
        }
      };
    
    case 'CLEAR_VALIDATION_ERROR':
      const newErrors = { ...state.validation.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        validation: {
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0
        }
      };
    
    case 'SET_PROCESSING':
      return {
        ...state,
        ui: { ...state.ui, isProcessing: action.payload }
      };
    
    case 'SHOW_CONFIRMATION':
      return {
        ...state,
        ui: { ...state.ui, showConfirmation: action.payload }
      };
    
    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          [action.payload.field]: action.payload.value
        },
        validation: {
          ...state.validation,
          errors: {
            ...state.validation.errors,
            [action.payload.field]: ''
          },
          isValid: true
        }
      };
    
    default:
      return state;
  }
};

// Coupon validation constants
const VALID_COUPONS = {
  'WELCOME10': { type: 'percentage', value: 10, description: '10% off on your booking' },
  'SAVE20': { type: 'percentage', value: 20, description: '20% off on your booking' },
  'FLAT100': { type: 'fixed', value: 100, description: '₹100 off on your booking' },
  'NEWUSER': { type: 'percentage', value: 15, description: '15% off for new users' },
  'MOVIE50': { type: 'fixed', value: 50, description: '₹50 off on movie tickets' }
};

const TicketBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById, selectedEvent } = useEventContext();
  const [event, setEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingState, dispatch] = useReducer(bookingReducer, initialBookingState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  console.log('TicketBooking component rendered with eventId:', eventId);
  console.log('Location state:', location.state);

  // Memoized event loading logic
  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      
      // First try to get event from location state
      let foundEvent = location.state?.eventData;
      
      // If not in state, try to get from context
      if (!foundEvent) {
        foundEvent = selectedEvent;
      }
      
      // If still not found, get from context by ID
      if (!foundEvent && eventId) {
        foundEvent = getEventById(eventId);
      }
      
      if (!foundEvent) {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: { event: 'Event not found' } });
        return;
      }
      
      setEvent(foundEvent);
      setSelectedDate(foundEvent.date);
      setSelectedTime(foundEvent.time);
      
      
      dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: 'event' });
    } catch (error) {
      console.error('Error loading event:', error);
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: { event: 'Failed to load event details' } });
    } finally {
      setLoading(false);
    }
  }, [eventId, location.state, selectedEvent, getEventById]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // Memoized coupon validation function
  const validateCoupon = useCallback(async (code) => {
    if (!code || !event) return false;
    
    dispatch({ type: 'APPLY_COUPON_START' });
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coupon = VALID_COUPONS[code.toUpperCase()];
    if (coupon) {
      let discountAmount = 0;
      const subtotal = event.price * bookingState.ticketCount;
      
      if (coupon.type === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.value) / 100);
      } else {
        discountAmount = Math.min(coupon.value, subtotal);
      }
      
      dispatch({ 
        type: 'APPLY_COUPON_SUCCESS', 
        payload: { 
          discount: discountAmount, 
          message: `${coupon.description} - You saved ₹${discountAmount}!` 
        }
      });
      return true;
    } else {
      dispatch({ 
        type: 'APPLY_COUPON_ERROR', 
        payload: 'Invalid coupon code. Please check and try again.' 
      });
      return false;
    }
  }, [event, bookingState.ticketCount]);

  // Auto-revalidate coupon when ticket count changes
  useEffect(() => {
    if (bookingState.coupon.code && bookingState.coupon.isValid && event) {
      validateCoupon(bookingState.coupon.code);
    }
  }, [bookingState.ticketCount, validateCoupon, bookingState.coupon.code, bookingState.coupon.isValid, event]);

  // Handle ticket count changes
  const handleTicketCountChange = useCallback((increment) => {
    const newCount = bookingState.ticketCount + increment;
    if (newCount >= 1 && newCount <= 2) {
      dispatch({ type: 'SET_TICKET_COUNT', payload: newCount });
    }
  }, [bookingState.ticketCount]);

  // Memoized handlers
  const handleCouponSubmit = useCallback(() => {
    const code = bookingState.coupon.code.trim();
    if (code) {
      validateCoupon(code);
    } else {
      dispatch({ type: 'APPLY_COUPON_ERROR', payload: 'Please enter a coupon code' });
    }
  }, [bookingState.coupon.code, validateCoupon]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCustomerInfoChange = (field, value) => {
    dispatch({ 
      type: 'SET_CUSTOMER_INFO',
      payload: { field, value }
    });
  };

  const handleProceedToPayment = useCallback(() => {
    // Validate form
    const errors = {};
    
    if (!selectedTime) {
      errors.time = 'Please select a time';
    }
    
    if (!bookingState.customerInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!bookingState.customerInfo.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(bookingState.customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: errors });
      return;
    }
    
    // If no errors, proceed to payment
    dispatch({ type: 'SET_PROCESSING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONFIRMATION' });
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }, 1500);
  }, [selectedTime, bookingState.customerInfo]);

  const handleProceed = useCallback(async () => {
    if (!event) return;
    
    // Clear previous validation errors
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: 'general' });
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', field: 'general' });
    
    // Validation
    if (bookingState.ticketCount > 2) {
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'general', message: 'Maximum 2 tickets can be purchased per order.' });
      return;
    }
    
    // Seat preference validation is no longer needed as we have a default
    // The default preference is set to regular fare (C Row)
    
    
    
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      
      // Calculate final pricing
      const subtotal = event.price * bookingState.ticketCount;
      const finalPrice = subtotal + bookingState.seatPremiumSurcharge - bookingState.coupon.discount;
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bookingData = {
        eventTitle: event.title,
        eventId: event.id,
        subtotal,
        discount: bookingState.coupon.discount,
        finalPrice,
        date: selectedDate,
        time: selectedTime,
        tickets: bookingState.ticketCount,
        seatPreference: bookingState.seatPreference,
        premiumSurcharge: bookingState.seatPremiumSurcharge,
        couponCode: bookingState.coupon.code
      };
      
      console.log('Proceeding with booking:', bookingData);
      
      // Navigate to payment page
      navigate('/payment', { state: bookingData });
      
    } catch (error) {
      console.error('Error processing booking:', error);
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'general', message: 'Something went wrong. Please try again.' });
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [event, bookingState, selectedDate, selectedTime, navigate]);

  // Memoized calculations
  const pricing = useMemo(() => {
    if (!event) return { subtotal: 0, finalPrice: 0 };
    
    // Calculate base price based on event type
    const basePrice = event.type === 'Drive-in' ? 899 : 799;
    const subtotal = basePrice * bookingState.ticketCount;
    const finalPrice = subtotal + bookingState.seatPremiumSurcharge - bookingState.coupon.discount;
    
    return { 
      subtotal, 
      finalPrice: Math.max(0, finalPrice),
      basePrice
    };
  }, [event, bookingState.ticketCount, bookingState.seatPremiumSurcharge, bookingState.coupon.discount]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b border-gray-800 h-16 animate-pulse" />
      <div className="bg-gray-800 border-b border-gray-700 h-20 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6 animate-pulse">
              <div className="h-64 bg-gray-800 rounded-xl mb-6" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-1/2 mb-6" />
              <div className="space-y-4">
                <div className="h-16 bg-gray-800 rounded-xl" />
                <div className="h-16 bg-gray-800 rounded-xl" />
                <div className="h-12 bg-gray-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = ({ error }) => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!event || bookingState.validation.errors.event) {
    return <ErrorState error={bookingState.validation.errors.event || "Event not found"} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              {/* <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white transition-colors px-3 py-1 rounded hover:bg-gray-800"
              >
                Home
              </button> */}
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-yellow-400 fo nt-bold text-xl hover:text-yellow-300 transition-colors"
            >
              SCC
            </button>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <button
              onClick={() => navigate('/')}
              className="hover:text-white transition-colors duration-200 hover:underline"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate('/events')}
              className="hover:text-white transition-colors duration-200 hover:underline"
            >
              Events
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate('/events')}
              className="text-white hover:text-yellow-400 transition-colors duration-200 hover:underline"
            >
              {event.title}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-yellow-400">Date-Movie</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-800"
            >
              {/* Event Image */}
              <div className="relative h-48 sm:h-64 md:h-80">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <div className="bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {event.type}
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{event.title}</h1>
                
                <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-yellow-400" />
                    <span className="truncate">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-yellow-400" />
                    <span className="truncate">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-yellow-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-yellow-400" />
                    <span className="truncate">{event.capacity}</span>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{event.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-300 text-sm sm:text-base">4.8 (127 reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800 sticky top-4 sm:top-8"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">Select Date - Movie</h2>

              {/* Date Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Select Date</label>
                <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
                  <div className="text-white font-semibold text-sm sm:text-base">{event.date}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">{event.time}</div>
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Select Time</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTime(event.time)}
                    className={`w-full p-3 rounded-lg sm:rounded-xl border text-left transition-colors min-h-[44px] ${
                      selectedTime === event.time
                        ? 'border-yellow-400 bg-yellow-400/10 text-white'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm sm:text-base">{event.time}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Available</div>
                  </button>
                </div>
              </div>

              {/* Ticket Count */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Number of Tickets</label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTicketCountChange(-1)}
                    disabled={bookingState.ticketCount <= 1}
                    aria-label="Decrease ticket count"
                    aria-describedby="ticket-count-display"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center min-h-[44px] transition-all ${
                      bookingState.ticketCount <= 1 
                        ? 'border-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400'
                    }`}
                  >
                    -
                  </motion.button>
                  <motion.span 
                    key={bookingState.ticketCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    id="ticket-count-display"
                    aria-live="polite"
                    className="text-white font-semibold text-base sm:text-lg min-w-[2rem] text-center"
                  >
                    {bookingState.ticketCount}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: bookingState.ticketCount >= 2 ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => bookingState.ticketCount < 2 && handleTicketCountChange(1)}
                    disabled={bookingState.ticketCount >= 2}
                    aria-label={bookingState.ticketCount >= 2 ? "Maximum ticket limit reached" : "Increase ticket count"}
                    aria-describedby="ticket-count-display"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center min-h-[44px] transition-all ${
                      bookingState.ticketCount >= 2 
                        ? 'border-red-500/30 text-red-500/50 cursor-not-allowed' 
                        : 'border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400'
                    }`}
                  >
                    +
                  </motion.button>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={bookingState.ticketCount}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-xs sm:text-sm ${
                      bookingState.ticketCount >= 2 ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {bookingState.ticketCount >= 2 
                      ? 'Maximum of 2 tickets per order reached' 
                      : 'Max 2 tickets per order.'}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Seat Preference Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Select Your Preference</label>
                
                {/* Modern Custom Dropdown */}
                <div className="relative dropdown-container">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white px-3 sm:px-4 py-3 rounded-lg hover:border-yellow-400 focus:outline-none focus:border-yellow-400 focus:bg-gray-800 transition-all duration-300 min-h-[44px] text-sm sm:text-base flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <>
                        <div className={`w-3 h-3 rounded-full ${
                          (() => {
                            const pref = SEAT_PREFERENCES.find(p => p.id === bookingState.seatPreference);
                            if (!pref?.premium) return 'bg-emerald-400';
                            return pref.surcharge >= 600 ? 'bg-purple-400' : 'bg-amber-400';
                          })()
                        }`} />
                        <span className="text-white">
                          {SEAT_PREFERENCES.find(p => p.id === bookingState.seatPreference)?.label}
                        </span>
                        {SEAT_PREFERENCES.find(p => p.id === bookingState.seatPreference)?.premium && (
                          <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-1 rounded">
                            +₹{SEAT_PREFERENCES.find(p => p.id === bookingState.seatPreference)?.surcharge}
                          </span>
                        )}
                      </>
                    </div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Options */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#4B5563 #1F2937',
                          WebkitScrollbarWidth: 'thin'
                        }}
                      >
                        {SEAT_PREFERENCES.map((preference, index) => (
                          <motion.button
                            key={preference.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              dispatch({ type: 'SET_SEAT_PREFERENCE', payload: preference.id });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between group ${
                              bookingState.seatPreference === preference.id ? 'bg-gray-700/50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full transition-all ${
                                !preference.premium 
                                  ? 'bg-emerald-400 group-hover:scale-110'
                                  : preference.surcharge >= 600
                                    ? 'bg-purple-400 group-hover:scale-110'
                                    : 'bg-amber-400 group-hover:scale-110'
                              }`} />
                              <div>
                                <span className="text-sm text-white">
                                  {preference.label}
                                </span>
                                {preference.premium && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      preference.surcharge >= 600 
                                        ? 'text-purple-400 bg-purple-400/10' 
                                        : 'text-amber-400 bg-amber-400/10'
                                    }`}>
                                      +₹{preference.surcharge}
                                    </span>
                                    <Star className={`w-3 h-3 ${
                                      preference.surcharge >= 600 ? 'text-purple-400' : 'text-amber-400'
                                    }`} />
                                    {preference.surcharge >= 600 && (
                                      <span className="text-purple-300 text-xs font-semibold">VIP</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {bookingState.seatPreference === preference.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-yellow-400"
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Show premium surcharge info */}
                <AnimatePresence>
                  {bookingState.seatPremiumSurcharge > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-amber-400 text-sm">
                          Premium seat selected: +₹{bookingState.seatPremiumSurcharge} total
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Customer Information Section */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-gray-300 font-medium mb-3 sm:mb-4 text-sm sm:text-base">Your Information</h3>
                
                {/* Name Input */}
                <div className="mb-4">
                  <label htmlFor="customer-name" className="block text-gray-300 mb-2 text-sm sm:text-base">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-name"
                      type="text"
                      value={bookingState.customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      onFocus={() => dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: 'name' })}
                      className={`w-full bg-gray-800/50 border ${
                        bookingState.validation.errors.name ? 'border-red-500' : 'border-gray-600 focus:border-yellow-400'
                      } text-white px-3 sm:px-4 py-3 rounded-lg focus:outline-none focus:bg-gray-800 transition-all duration-300 placeholder-gray-400 min-h-[44px] text-sm sm:text-base`}
                      placeholder="Enter your full name"
                      aria-invalid={!!bookingState.validation.errors.name}
                      aria-describedby="name-error"
                    />
                  </div>
                  {bookingState.validation.errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-400">
                      {bookingState.validation.errors.name}
                    </p>
                  )}
                </div>
                
                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="customer-email" className="block text-gray-300 mb-2 text-sm sm:text-base">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-email"
                      type="email"
                      value={bookingState.customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      onFocus={() => dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: 'email' })}
                      className={`w-full bg-gray-800/50 border ${
                        bookingState.validation.errors.email ? 'border-red-500' : 'border-gray-600 focus:border-yellow-400'
                      } text-white px-3 sm:px-4 py-3 rounded-lg focus:outline-none focus:bg-gray-800 transition-all duration-300 placeholder-gray-400 min-h-[44px] text-sm sm:text-base`}
                      placeholder="your.email@example.com"
                      aria-invalid={!!bookingState.validation.errors.email}
                      aria-describedby="email-error"
                    />
                  </div>
                  {bookingState.validation.errors.email ? (
                    <p id="email-error" className="mt-1 text-sm text-red-400">
                      {bookingState.validation.errors.email}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">We'll send your tickets to this email</p>
                  )}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Have a Gift Card or Coupon Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bookingState.coupon.code}
                    onChange={(e) => dispatch({ type: 'SET_COUPON_CODE', payload: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleCouponSubmit()}
                    placeholder="Enter coupon code"
                    disabled={bookingState.coupon.isApplying}
                    aria-label="Coupon code"
                    aria-describedby="coupon-message"
                    aria-invalid={bookingState.coupon.message && !bookingState.coupon.isValid}
                    className="flex-1 bg-gray-800/50 border border-gray-600 text-white px-3 sm:px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:bg-gray-800 transition-all duration-300 placeholder-gray-400 min-h-[44px] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    whileHover={{ scale: bookingState.coupon.isApplying ? 1 : 1.02 }}
                    whileTap={{ scale: bookingState.coupon.isApplying ? 1 : 0.98 }}
                    onClick={handleCouponSubmit}
                    disabled={bookingState.coupon.isApplying || !bookingState.coupon.code.trim()}
                    aria-label={bookingState.coupon.isApplying ? 'Applying coupon' : 'Apply coupon code'}
                    className="bg-yellow-400 text-black px-4 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors min-h-[44px] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {bookingState.coupon.isApplying && <Loader2 className="w-4 h-4 animate-spin" />}
                    {bookingState.coupon.isApplying ? 'Applying...' : 'Apply'}
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {bookingState.coupon.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      id="coupon-message"
                      role="status"
                      aria-live="polite"
                      className={`mt-2 text-sm flex items-center gap-2 ${
                        bookingState.coupon.isValid ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {bookingState.coupon.isValid ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      {bookingState.coupon.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Summary */}
              <motion.div 
                layout
                id="booking-summary"
                aria-label="Booking price summary"
                className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm sm:text-base">Price per ticket</span>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    ₹{event?.type === 'Drive-in' ? '899' : '799'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm sm:text-base">Quantity</span>
                  <motion.span 
                    key={bookingState.ticketCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-white font-semibold text-sm sm:text-base"
                  >
                    {bookingState.ticketCount}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm sm:text-base">Subtotal</span>
                  <motion.span 
                    key={event.price * bookingState.ticketCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-white font-semibold text-sm sm:text-base"
                  >
                    ₹{event.price * bookingState.ticketCount}
                  </motion.span>
                </div>
                
                <AnimatePresence>
                  {bookingState.seatPremiumSurcharge > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="text-amber-300 text-sm sm:text-base">Premium Seats</span>
                      <span className="text-amber-300 font-semibold text-sm sm:text-base">+₹{bookingState.seatPremiumSurcharge}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {bookingState.coupon.discount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="text-green-400 text-sm sm:text-base">Discount</span>
                      <span className="text-green-400 font-semibold text-sm sm:text-base">-₹{bookingState.coupon.discount}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-base sm:text-lg">Total</span>
                    <motion.span 
                      key={pricing.finalPrice}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-yellow-400 font-bold text-lg sm:text-xl"
                    >
                      ₹{pricing.finalPrice}
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* General Validation Error */}
              <AnimatePresence>
                {bookingState.validation.errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">{bookingState.validation.errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Proceed Button */}
              <motion.button
                whileHover={{ scale: bookingState.ui.isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: bookingState.ui.isProcessing ? 1 : 0.98 }}
                onClick={handleProceed}
                disabled={bookingState.ui.isProcessing || !bookingState.validation.isValid}
                aria-label={bookingState.ui.isProcessing ? 'Processing booking' : 'Proceed to payment'}
                aria-describedby="booking-summary"
                className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg min-h-[44px] transition-all flex items-center justify-center gap-2 ${
                  bookingState.ui.isProcessing || !bookingState.validation.isValid
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                }`}
              >
                {bookingState.ui.isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
                {bookingState.ui.isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </motion.button>

              {/* Additional Info */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Secure payment • Instant confirmation • Mobile tickets
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400 space-y-4">
          <div>
            <h4 className="text-white font-semibold">sunShineScreening</h4>
            <p>For Customer Queries: <a className="underline text-yellow-400" href="mailto:shinescreening@gmail.com">shinescreening@gmail.com</a></p>
            <p>Phone: </p>
            <p>Cities: Mumbai · Bangalore · Hyderabad · Delhi NCR · Pune · Chandigarh</p>
          </div>
          <div className="pt-4 text-sm text-gray-500">© Copyright 2017-25 sunShineScreening</div>
          <div className="pt-2 text-xs text-gray-600">Developed By: Mahesh Bhanushali</div>
        </div>
      </footer>
    </div>
  );
};

export default TicketBooking;
