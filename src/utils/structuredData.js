// Structured Data (Schema.org JSON-LD) generators for SEO

export const generateEventStructuredData = (event) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description || `Experience ${event.title} - an exclusive event at EventWeb`,
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.venue || "Premium Venue",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.city || "Mumbai",
        "addressCountry": "IN"
      }
    },
    "image": event.image || "/default-event-image.jpg",
    "organizer": {
      "@type": "Organization",
      "name": "EventWeb",
      "url": "https://eventweb.com"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://eventweb.com/events/${event.id}`,
      "price": event.price || "899",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    }
  };
};

export const generateVenueStructuredData = (venue) => {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": venue.name,
    "description": venue.description || `Premium venue for events and screenings`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": venue.location || "Mumbai",
      "addressCountry": "IN"
    },
    "image": venue.image || "/default-venue-image.jpg",
    "telephone": "+91-XXXXXXXXXX",
    "url": `https://eventweb.com/venues/${venue.id}`,
    "amenityFeature": venue.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) || []
  };
};

export const generateMovieStructuredData = (movie) => {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.description || `Watch ${movie.title} in premium cinema experience`,
    "image": movie.poster || "/default-movie-poster.jpg",
    "genre": movie.genre || "Entertainment",
    "datePublished": movie.releaseDate,
    "director": movie.director ? {
      "@type": "Person",
      "name": movie.director
    } : undefined,
    "actor": movie.cast?.map(actor => ({
      "@type": "Person",
      "name": actor
    })) || [],
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://eventweb.com${crumb.path}`
    }))
  };
};

export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EventWeb",
    "description": "Premium event booking and venue management platform",
    "url": "https://eventweb.com",
    "logo": "https://eventweb.com/logo.png",
    "foundingDate": "2024",
    "sameAs": [
      "https://facebook.com/eventweb",
      "https://twitter.com/eventweb",
      "https://instagram.com/eventweb"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "availableLanguage": "English",
      "areaServed": "IN"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressLocality": "Mumbai"
    }
  };
};

export const generateWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EventWeb",
    "description": "Premium event booking and venue management platform",
    "url": "https://eventweb.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://eventweb.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};
