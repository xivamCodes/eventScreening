import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, QrCode, ChevronDown, X, AlertTriangle, RefreshCw, Mail, CheckCircle2, XCircle } from 'lucide-react';

// Contact Form Component
const ContactForm = ({ isOpen, onClose, onSubmit, onCancel }) => {  
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [error, setError] = useState({ email: '', phone: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newError = { email: '', phone: '' };
    let isValid = true;

    if (!formData.email) {
      newError.email = 'Please enter your email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.phone) {
      newError.phone = 'Please enter your phone number';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newError.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onEmailSubmit(formData);
      handlePayment();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  Contact Information
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {error.email && <p className="mt-1 text-sm text-red-400">{error.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-400">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                      placeholder="98765 43210"
                      maxLength="10"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  {error.phone && <p className="mt-1 text-sm text-red-400">{error.phone}</p>}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Continue to Payment
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 border border-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Payment = () => {
  // Declare all hooks at the top
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  
  // Get event details from location state with defaults
  const {
    eventTitle = 'Event',
    subtotal = 0,
    discount = 0,
    finalPrice = 0,
    date,
    time,
    tickets = 1
  } = location.state || {};

  // Check for payment status in URL params when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('payment_status');
    
    if (status === 'success') {
      setPaymentStatus('success');
      setShowSuccessPopup(true);
      // Clean up URL
      navigate(location.pathname, { replace: true });
    } else if (status === 'failed') {
      setPaymentStatus('failed');
      setShowSuccessPopup(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleContactSubmit = (contactData) => {
    setUserEmail(contactData.email);
    // Store phone number in state if needed later
    setShowEmailForm(false);
    // Proceed with payment after contact info is submitted
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      // Fallback in case payment link is not available
      console.error('Payment link not found');
      setShowPaymentError(true);
    }
  };

  const handlePaymentClick = (e, upiLink) => {
    e.preventDefault();
    setPaymentLink(upiLink);
    setShowEmailForm(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePaymentError = () => {
    setShowPaymentError(true);
  };

  const handleEmailSubmit = (e, upiLink) => {
    handlePaymentClick(e, upiLink);
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setShowSuccessPopup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative">
      <ContactForm
        isOpen={showEmailForm}
        onClose={() => setShowEmailForm(false)}
        onSubmit={handleContactSubmit}
        onCancel={() => setShowEmailForm(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
        >
          {/* Order Summary */}
          <div className="lg:col-span-2 bg-gray-900/70 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <div className="text-gray-400 text-sm">Event</div>
                <div className="font-semibold">{eventTitle}</div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>{date}</span>
                <span className="text-gray-600">•</span>
                <span>{time}</span>
                <span className="text-gray-600">•</span>
                <span>Tickets: {tickets}</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="text-green-400">-₹{discount}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                  <span className="text-white font-bold">Amount Payable</span>
                  <span className="text-yellow-400 font-extrabold text-xl">₹{finalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form (mock) */}
          <div className="lg:col-span-3 bg-gray-900/70 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Payment</h2>
              <span className="text-sm text-gray-400">Secure Checkout</span>
            </div>
            <div className="p-5">
              {/* Payment Method Selector */}
              <PaymentMethods 
                finalPrice={finalPrice} 
                onCancel={handleCancel}
                onPaymentError={handlePaymentError}
                onEmailSubmit={handleEmailSubmit}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Error Modal */}
      <PaymentErrorModal 
        isOpen={showPaymentError}
        onClose={() => setShowPaymentError(false)}
        onRetry={() => setShowPaymentError(false)}
      />
    </div>
  );
};

// Payment Error Modal Component
const PaymentErrorModal = ({ isOpen, onClose, onRetry }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Payment Failed</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-gray-300 mb-6">
                  <p className="mb-3">
                    We're sorry, but your payment could not be processed at this time.
                  </p>
                  <p className="text-sm text-gray-400">
                    Please try using a different payment method or contact your bank if the issue persists.
                  </p>
                </div>

                {/* Suggested Actions */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-medium text-white mb-3">Try these alternatives:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      Switch to UPI/QR code payment
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      Use a different card or payment method
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      Check your internet connection
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-yellow-400 text-black py-3 px-4 rounded-xl font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 border border-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Payment;

// Collapsible payment methods (Card, UPI/QR)
const PaymentMethods = ({ finalPrice, onCancel, onPaymentError, onEmailSubmit, onPaymentSuccess }) => {
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', or null
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);
  const [open, setOpen] = useState(''); // Track which payment method is open
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/Reset timer when UPI section is opened
  useEffect(() => {
    if (open === 'upi') {
      setTimeLeft(120);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [open]);

  // Handle countdown
  useEffect(() => {
    if (!isTimerActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  const generateUpiLink = (amount) => {
    const upiParams = {
      pa: 'shinescreenings2025@ibl',
      pn: 'Shine Screenings',
      am: amount,
      cu: 'INR',
      tn: 'Event Payment',
      mc: '5499' // MCC for educational services
    };
    return `upi://pay?pa=${encodeURIComponent(upiParams.pa)}&pn=${encodeURIComponent(upiParams.pn)}&am=${encodeURIComponent(upiParams.am)}&cu=${encodeURIComponent(upiParams.cu)}&tn=${encodeURIComponent(upiParams.tn)}&mc=${encodeURIComponent(upiParams.mc)}`;
  };

  const handlePayment = () => {
    // Show loading state
    setPaymentStatus('processing');
    
    // In a real app, you would:
    // 1. Call your backend to verify the payment
    // 2. Update the payment status based on the response
    // 3. Handle success/failure accordingly
    
    // For demo purposes, we'll simulate a successful payment after a delay
    // In production, you would wait for the payment confirmation from your backend
    const paymentCheckInterval = setInterval(() => {
      // In a real app, you would check with your backend for payment status
      // For demo, we'll just wait a moment and then show success
      clearInterval(paymentCheckInterval);
      
      // Simulate payment success (in a real app, this would be based on actual payment status)
      const paymentSuccess = true; // For demo, always assume success
      
      if (paymentSuccess) {
        setPaymentStatus('success');
        // Call the success handler after a short delay
        setTimeout(() => {
          if (onPaymentSuccess) onPaymentSuccess();
          // Close the payment confirmation after success
          setShowPaymentConfirmation(false);
        }, 1000);
      } else {
        setPaymentStatus('failed');
        if (onPaymentError) onPaymentError('Payment verification failed. Please check your payment and try again.');
      }
    }, 3000); // Check payment status after 3 seconds
  };

  const amount = Number(finalPrice || 0).toFixed(2);
  const upiLink = generateUpiLink(amount);
  const qrData = encodeURIComponent(upiLink);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`;

  return (
    <div className="space-y-4">
      {/* Card Option */}
      <div className="bg-black/30 border border-gray-800 rounded-xl overflow-hidden">
        <button
          aria-label="Toggle card payment"
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-black/40"
          onClick={() => setOpen(open === 'card' ? '' : 'card')}
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/30">
              <CreditCard className="w-5 h-5 text-yellow-400" />
            </span>
            <span className="text-sm text-gray-300">Debit / Credit Card</span>
          </span>
          <motion.span
            initial={false}
            animate={{ rotate: open === 'card' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </button>
        <motion.div
          initial={false}
          animate={{ height: open === 'card' ? 'auto' : 0, opacity: open === 'card' ? 1 : 0 }}
          className="overflow-hidden border-t border-gray-800"
        >
          <div className="p-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Card Number</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Expiry</label>
                <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">CVV</label>
                <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400" placeholder="123" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Cardholder Name</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400" placeholder="As on card" />
            </div>

            <div className="mt-2">
              <button
                className="w-full border border-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors min-h-[44px]"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* UPI / QR Option */}
      <div className="bg-black/30 border border-gray-800 rounded-xl overflow-hidden">
        <button
          aria-label="Toggle UPI payment"
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-black/40"
          onClick={() => setOpen(open === 'upi' ? '' : 'upi')}
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/30">
              <QrCode className="w-5 h-5 text-yellow-400" />
            </span>
            <span className="text-sm text-gray-300">UPI / QR</span>
          </span>
          <motion.span
            initial={false}
            animate={{ rotate: open === 'upi' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </button>
        <motion.div
          initial={false}
          animate={{ height: open === 'upi' ? 'auto' : 0, opacity: open === 'upi' ? 1 : 0 }}
          className="overflow-hidden border-t border-gray-800"
        >
          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={qrSrc} 
                  alt="UPI QR" 
                  className={`w-44 h-44 rounded-lg border-2 ${timeLeft > 0 ? 'border-yellow-400/30' : 'border-red-400/30'} bg-gray-800 p-2 transition-colors duration-300`} 
                />
                {isTimerActive && (
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    timeLeft > 30 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                    {timeLeft <= 10 && (
                      <span className="ml-1">⏳</span>
                    )}
                  </div>
                )}
              </div>
              <p className={`text-xs ${timeLeft > 0 ? 'text-gray-400' : 'text-red-400'} text-center`}>
                {timeLeft > 0 
                  ? `Scan to pay ₹${amount} to Shine Screenings`
                  : 'QR Code expired. Please close and reopen UPI payment.'}
              </p>
              {timeLeft > 0 && (
                <a 
                  href={upiLink}
                  className="mt-3 block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 px-4 rounded-xl font-semibold text-center transition-colors hover:shadow-lg hover:shadow-yellow-400/20"
                  onClick={async (e) => {
                    e.preventDefault();
                    // Show payment confirmation dialog
                    setShowPaymentConfirmation(true);
                    
                    // After a short delay, open the UPI payment link
                    // This gives time for the confirmation dialog to show
                    setTimeout(() => {
                      try {
                        // Open UPI payment link in a new tab
                        window.open(upiLink, '_blank', 'noopener,noreferrer');
                        // Also trigger the payment processing
                        handlePayment();
                      } catch (error) {
                        console.error('Error opening payment link:', error);
                        if (onPaymentError) onPaymentError('Failed to open payment app. Please try again.');
                      }
                    }, 500);
                  }}
                >
                  Pay with UPI
                </a>
              )}
              {timeLeft > 0 && (
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / 120) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <div className="mt-2">
              <button
                className="w-full border border-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors min-h-[44px]"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


