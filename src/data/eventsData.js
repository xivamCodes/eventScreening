import { calculateRemainingSeats } from '../utils/seatAvailability';

// Helper function to create event with dynamic seat availability
const createEvent = (eventData) => {
  const capacityMatch = eventData.capacity.match(/\d+/);
  const totalSeats = capacityMatch ? parseInt(capacityMatch[0], 10) : 100;
  
  // Parse the event date
  let eventDate;
  if (eventData.date instanceof Date) {
    eventDate = new Date(eventData.date);
  } else if (typeof eventData.date === 'string') {
    // Handle string dates in the format "Month Day, Year"
    eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime())) {
      // If parsing fails, set to a future date
      eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 30) + 1);
    }
  } else {
    // Default to a random date in the next 30 days
    eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 30) + 1);
  }
  
  const { remainingSeats, status, isLowAvailability } = 
    calculateRemainingSeats(eventDate, totalSeats);

  return {
    ...eventData,
    date: eventDate,
    totalSeats,
    remainingSeats,
    seatStatus: status,
    isLowAvailability,
    displayCapacity: `${remainingSeats} of ${totalSeats} ${eventData.capacity.includes('car') ? 'cars' : 'seats'} left`,
    availabilityStatus: isLowAvailability ? 'Hurry! Limited availability' : 'Available',
  };
};

export const eventsData = [
  createEvent({
    id: 1,
    title: "Our Fault",
    type: "Open-Screening",
    date: "October 18, 2025",
    time: "7:00 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Experience Christopher Nolan's masterpiece under the stars. Bring your car and enjoy this epic superhero film in our premium drive-in setup.",
    image: "https://sunsetcinemaclub.in/img/admin/page/home/yvPVsqAWdR_rsz_cafe_cinema_2.jpg",
    price: "899",
    capacity: "16 seats",
    city: "Delhi NCR",
    movieName: "Our Fault"
  },
  {
    id: 2,
    title: "Open Air Screening: My Fault",
    type: "Open Air",
    date: new Date(), // Today's date
    time: "8:00 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Experience the emotional journey of 'My Fault' in our open-air cinema. Bring your blankets and enjoy this captivating film under the stars.",
    image: "https://sunsetcinemaclub.in/img/admin/page/home/AK9pBWeu1Y__DSC6756 (1).jpg",
    price: "899",
    capacity: "120 people",
    city: "Delhi NCR",
    movieName: "My Fault"
  },
  {
    id: 3,
    title: "Private Screening: Dune",
    type: "Private Screening",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: "7:00 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Exclusive private screening of Dune. Perfect for corporate events, birthdays, or special celebrations. Customize your experience with us.",
    image: "https://miro.medium.com/0*NNP_zZwHt9Zu3Bzz",
    price: "899",
    capacity: "12 cabins",
    city: "Delhi NCR",
    movieName: "Dune"
  },
  {
    id: 4,
    title: "Special Event: Bollywood Night",
    type: "Special Event",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    time: "8:00 PM",
    location: "DLF Avenue Saket, Delhi",
    description: "Celebrate Bollywood with a special screening of classic Hindi films. Enjoy traditional snacks and immerse yourself in the magic of Indian cinema.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/wuR5UuK2NU_IMG20250608142231 (1).jpg",
    price: "899",
    capacity: "20 seats left",
    city: "Delhi NCR"
  },
  {
    id: 5,
    title: "Drive-in Cinema:The Lost City",
    type: "Drive-in",
    date: "March 28, 2024",
    time: "7:00 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Experience the epic sci-fi adventure of Dune in our state-of-the-art drive-in setup. Perfect sound and visual experience guaranteed.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/g6AXE4lF9p__MG_6087 (1).jpg",
    price: "899",
    capacity: "120 cars",
    city: "Delhi NCR"
  },
  {
    id: 6,
    title: "Open Air Screening: Avatar",
    type: "Open Air",
    date: "April 2, 2024",
    time: "8:15 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Witness James Cameron's visual masterpiece Avatar in our open-air setup. Experience Pandora like never before under the stars.",
    image: "https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticle_images%2FSCC.jpg?w=undefined",
    price: "899",
    capacity: "250 people",
    city: "Delhi NCR",
    movieName: "Bollywood Classics"
  }),
  {
    id: 7,
    title: "Drive-in Cinema: Top Gun: Maverick",
    type: "Drive-in",
    date: "April 5, 2024",
    time: "6:30 PM",
    location: "Chittaranjan Park, Delhi",
    description: "Feel the need for speed with Top Gun: Maverick. Experience high-octane action in our premium drive-in setup with surround sound.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/g6AXE4lF9p__MG_6087 (1).jpg",
    price: "899",
    capacity: "4 cars",
    city: "Delhi NCR"
  },
  {
    id: 8,
    title: "Special Event: Marvel Marathon",
    type: "Special Event",
    date: "28 October, 2024",
    time: "6:00 PM",
    location: "JLN gate no. 14, Delhi",
    description: "Join us for an epic Marvel marathon featuring the best of MCU. Food and beverages available throughout the event.",
    image: "https://images.thedirect.com/media/article_full/marvel-posters-ranked.jpg",
    price: "899",
    capacity: "200 people",
    city: "Delhi NCR"
  }
];

// Function to get events with updated seat availability
export const getEventsWithAvailability = () => {
  return eventsData.map(event => {
    // If the event already has remainingSeats, just return it
    if (event.remainingSeats !== undefined) {
      return event;
    }
    
    // Otherwise, create a new event with seat availability
    return createEvent({
      ...event,
      // Ensure we have a valid date
      date: event.date || new Date()
    });
  });
};

export default eventsData;
