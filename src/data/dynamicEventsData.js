// Dynamic events data with movie-date mappings
export const movieEventMappings = [
  {
    id: 1,
    title: "Drive-in Cinema: Our Fault",
    type: "Drive-in",
    time: "8:00 pm",
    location: "JLN gate 14, Delhi",
    description: "Ana, a college student, interviews an enigmatic billionaire entrepreneur, Christian, for her campus' periodical. A steamy sadomasochistic affair starts between the two, whose roots lie in his past.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/g6AXE4lF9p__MG_6087 (1).jpg",
    price: "899",
    capacity: "4",
    city: "Delhi NCR",
    movieName: "Our Fault"
  },
  {
    id: 2,
    title: "Open Air Screening: Ghosted",
    type: "Open Air",
    time: "5:00 PM",
    location: "JLN gate 14, Delhi",
    description: "Join us for an emotional rollercoaster with Your Fault. Bring your blankets and experience this powerful story unfold under the open sky.",
    image: "https://sunsetcinemaclub.in/img/admin/page/home/AK9pBWeu1Y__DSC6756 (1).jpg",
    price: "899",
    capacity: "9 people",
    city: "Delhi NCR",
    movieName: "Inception"
  },
  {
    id: 3,
    title: "Private Screening: Interstellar",
    type: "Private Screening",
    time: "11:00 PM",
    location: "JLN gate 14, Delhi",
    description: "Exclusive private screening of Interstellar. Perfect for corporate events, birthdays, or special celebrations. Customize your experience with us.",
    image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/11/5/1415201794019/Matthew-McConaughey-in-In-014.jpg?width=700&quality=85&auto=format&fit=max&s=7ca85dcd8787f3c9ff63fb2213085f40",
    price: "899",
    capacity: "20 cabins",
    city: "Delhi NCR",
    movieName: "Interstellar"
  },
  {
    id: 4,
    title: "Special Event: Bollywood Night",
    type: "Special Event",
    time: "8:30 PM",
    location: "DLF Avenue Saket, Delhi",
    description: "Celebrate Bollywood with a special screening of classic Hindi films. Enjoy traditional snacks and immerse yourself in the magic of Indian cinema.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/wuR5UuK2NU_IMG20250608142231 (1).jpg",
    price: "899",
    capacity: "300 people",
    city: "Delhi NCR",
    movieName: "3 Idiots"
  },
  {
    id: 5,
    title: "Drive-in Cinema: Dune",
    type: "Drive-in",
    time: "7:45 PM",
    location: "Faridabad Drive-in Theatre",
    description: "Experience the epic sci-fi adventure of Dune in our state-of-the-art drive-in setup. Perfect sound and visual experience guaranteed.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/GBZpBbHppA_IMG20250608123536 (2).jpg",
    price: "899",
    capacity: "120 cars",
    city: "Delhi NCR",
    movieName: "Dune"
  },
  {
    id: 6,
    title: "Open Air Screening: Avatar",
    type: "Open Air",
    time: "8:15 PM",
    location: "Nehru Park, Delhi",
    description: "Witness James Cameron's visual masterpiece Avatar in our open-air setup. Experience Pandora like never before under the stars.",
    image: "https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticle_images%2FSCC.jpg?w=undefined",
    price: "899",
    capacity: "250 people",
    city: "Delhi NCR",
    movieName: "Avatar"
  },
  {
    id: 7,
    title: "Drive-in Cinema: Top Gun Maverick",
    type: "Drive-in",
    time: "2:30 PM",
    location: "Chittaranjan Park",
    description: "Feel the need for speed with Top Gun: Maverick. Experience high-octane action in our premium drive-in setup with surround sound.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/g6AXE4lF9p__MG_6087 (1).jpg",
    price: "899",
    capacity: "18 cars",
    city: "Delhi NCR",
    movieName: "Top Gun: Maverick"
  },
  {
    id: 8,
    title: "Special Event: Marvel Marathon",
    type: "Special Event",
    time: "6:00 PM",
    location: "Connaught Place, Delhi",
    description: "Join us for an epic Marvel marathon featuring the best of MCU. Food and beverages available throughout the event.",
    image: "https://images.thedirect.com/media/article_full/marvel-posters-ranked.jpg",
    price: "899",
    capacity: "200 people",
    city: "Delhi NCR",
    movieName: "Avengers: Endgame"
  },
  {
    id: 9,
    title: "Open Air Screening: The Matrix",
    type: "Open Air",
    time: "8:00 PM",
    location: "Lodhi Garden, Delhi",
    description: "Enter the Matrix with this iconic sci-fi thriller. Experience the groundbreaking visual effects under the open sky.",
    image: "https://sunsetcinemaclub.in/img/admin/page/home/AK9pBWeu1Y__DSC6756 (1).jpg",
    price: "899",
    capacity: "200 people",
    city: "Delhi NCR",
    movieName: "The Matrix"
  },
  {
    id: 10,
    title: "Drive-in Cinema: Jurassic Park",
    type: "Drive-in",
    time: "7:15 PM",
    location: "Faridabad Drive-in Theatre",
    description: "Welcome to Jurassic Park! Experience the thrill of dinosaurs in our premium drive-in setup with crystal clear sound.",
    image: "https://sunsetcinemaclub.in/img/admin/venues/GBZpBbHppA_IMG20250608123536 (2).jpg",
    price: "899",
    capacity: "120 cars",
    city: "Delhi NCR",
    movieName: "Jurassic Park"
  }
];

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Get a consistent seed based on the current date
const getDailySeed = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  
  // If it's after 8 PM IST, use tomorrow's date for the seed
  if (istTime.getHours() >= 20) {
    istTime.setDate(istTime.getDate() + 1);
  }
  
  // Return a string in YYYY-MM-DD format for consistent seeding
  return istTime.toISOString().split('T')[0];
};

// Utility functions for dynamic date generation
export const generateDynamicEvents = () => {
  const seed = getDailySeed();
  const dynamicEvents = [];
  
  // Create a seedable random number generator
  const seededRandom = (seed) => {
    let value = 0;
    for (let i = 0; i < seed.length; i++) {
      value = (value << 5) - value + seed.charCodeAt(i);
      value = value & value; // Convert to 32bit integer
    }
    return () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  };
  
  const random = seededRandom(seed);
  
  // Shuffle the events using the seeded random
  const shuffledEvents = [...movieEventMappings].sort(() => 0.5 - random());
  
  // Get the current date in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  
  // If it's after 8 PM IST, use tomorrow's date
  const useTomorrow = istTime.getHours() >= 20;
  
  // Generate events with dynamic date
  for (let i = 0; i < shuffledEvents.length; i++) {
    const eventDate = new Date(istTime);
    
    // If it's after 8 PM, show tomorrow's date
    if (useTomorrow) {
      eventDate.setDate(eventDate.getDate() + 1);
    }
    
    // Format the date
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    const baseEvent = shuffledEvents[i];
    
    const dynamicEvent = {
      ...baseEvent,
      id: `${baseEvent.id}-${seed}-${i}`, // Make ID unique per day
      title: baseEvent.title,
      date: formattedDate,
      movieName: baseEvent.movieName,
      isActive: true,
      dayOffset: i,
      // Add a random price variation for demonstration
      price: Math.floor(baseEvent.price * (0.9 + (random() * 0.2))).toString(),
      // Add a unique seed for any additional randomization needed
      seed: seed
    };
    
    dynamicEvents.push(dynamicEvent);
  }
  
  return dynamicEvents;
};

// Function to check if events need to be refreshed
export const shouldRefreshEvents = (lastRefresh) => {
  if (!lastRefresh) return true;
  
  const now = new Date();
  const lastRefreshDate = new Date(lastRefresh);
  
  // Get current time in IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  const lastRefreshIST = new Date(lastRefreshDate.getTime() + (lastRefreshDate.getTimezoneOffset() * 60 * 1000) + istOffset);
  
  // Check if we've crossed 8 PM since last refresh
  const isAfter8PM = nowIST.getHours() >= 20;
  const wasRefreshedAfter8PM = lastRefreshIST.getHours() >= 20;
  
  // Check if it's a new day in IST
  const isNewDay = (
    nowIST.getDate() !== lastRefreshIST.getDate() ||
    nowIST.getMonth() !== lastRefreshIST.getMonth() ||
    nowIST.getFullYear() !== lastRefreshIST.getFullYear()
  );
  
  // Refresh if:
  // 1. It's a new day and after 8 PM, or
  // 2. We haven't refreshed after 8 PM today, or
  // 3. It's been more than 30 minutes since last refresh
  return (
    (isNewDay && isAfter8PM) ||
    (isAfter8PM && !wasRefreshedAfter8PM) ||
    (now.getTime() - lastRefreshDate.getTime() > 30 * 60 * 1000) // 30 minutes
  );
};

// Function to get formatted date string
export const formatEventDate = (date) => {
  const eventDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (eventDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
};
