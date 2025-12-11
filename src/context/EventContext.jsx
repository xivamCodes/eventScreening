import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventsData } from '../data/eventsData';
import { generateDynamicEvents, shouldRefreshEvents } from '../data/dynamicEventsData';

export const EventContext = createContext();

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(eventsData);
  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Generate dynamic events on mount and when needed
  useEffect(() => {
    const refreshEvents = (force = false) => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
      const isAfter8PM = istTime.getHours() >= 20;
      
      // Always generate new events if forced or if we don't have any yet
      if (force || !lastRefresh) {
        console.log('Generating new dynamic events');
        const newDynamicEvents = generateDynamicEvents();
        setDynamicEvents(newDynamicEvents);
        setLastRefresh(now.toISOString());
        
        // Store in localStorage
        localStorage.setItem('lastEventRefresh', now.toISOString());
        localStorage.setItem('cachedDynamicEvents', JSON.stringify(newDynamicEvents));
        return;
      }
      
      // Check if we need to refresh based on time
      const lastRefreshDate = new Date(lastRefresh);
      const lastRefreshIST = new Date(lastRefreshDate.getTime() + (lastRefreshDate.getTimezoneOffset() * 60 * 1000) + istOffset);
      
      // Refresh if:
      // 1. It's after 8 PM and we haven't refreshed since 8 PM
      // 2. It's a new day and after 8 PM
      const shouldRefresh = (
        (isAfter8PM && lastRefreshIST.getHours() < 20) ||
        (istTime.getDate() !== lastRefreshIST.getDate() && isAfter8PM)
      );
      
      if (shouldRefresh) {
        console.log('Refreshing events based on schedule');
        const newDynamicEvents = generateDynamicEvents();
        setDynamicEvents(newDynamicEvents);
        setLastRefresh(now.toISOString());
        
        // Store in localStorage
        localStorage.setItem('lastEventRefresh', now.toISOString());
        localStorage.setItem('cachedDynamicEvents', JSON.stringify(newDynamicEvents));
      }
    };

    // Initial load - try to load from localStorage first
    const loadInitialEvents = () => {
      const storedRefresh = localStorage.getItem('lastEventRefresh');
      const storedEvents = localStorage.getItem('cachedDynamicEvents');
      
      if (storedRefresh && storedEvents) {
        const lastRefreshDate = new Date(storedRefresh);
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
        const lastRefreshIST = new Date(lastRefreshDate.getTime() + (lastRefreshDate.getTimezoneOffset() * 60 * 1000) + istOffset);
        
        // Check if stored events are still valid (same day before 8 PM or next day after 8 PM)
        const isSameDay = (
          istTime.getDate() === lastRefreshIST.getDate() &&
          istTime.getMonth() === lastRefreshIST.getMonth() &&
          istTime.getFullYear() === lastRefreshIST.getFullYear() &&
          istTime.getHours() < 20
        );
        
        if (isSameDay) {
          console.log('Using cached events from localStorage');
          setDynamicEvents(JSON.parse(storedEvents));
          setLastRefresh(storedRefresh);
          return;
        }
      }
      
      // If we get here, we need to generate new events
      refreshEvents(true);
    };
    
    loadInitialEvents();
    
    // Set up interval to check for updates every 5 minutes
    const interval = setInterval(() => refreshEvents(false), 5 * 60 * 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [lastRefresh]);

  const getEventById = (id) => {
    // First check dynamic events, then fallback to static events
    const dynamicEvent = dynamicEvents.find(event => event.id === parseInt(id));
    if (dynamicEvent) return dynamicEvent;
    return events.find(event => event.id === parseInt(id));
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
  };

  // For homepage, use dynamic events; for other pages, use static events
  const getHomePageEvents = () => {
    return dynamicEvents.length > 0 ? dynamicEvents.slice(0, 3) : events.slice(0, 3);
  };

  const value = {
    events,
    dynamicEvents,
    selectedEvent,
    getEventById,
    selectEvent,
    getHomePageEvents,
    lastRefresh,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
