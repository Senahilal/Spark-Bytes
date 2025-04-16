"use client";

import React, { useState, useEffect } from 'react';
import EventCard from './eventcard';
import { fetchTodaysEvents } from '../firebase/repository';

const TodaysEvents = () => {

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodaysEvents = async () => {
      try {
        setLoading(true);
        const todaysEvents = await fetchTodaysEvents();
        if (todaysEvents) {
          setEvents(todaysEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadTodaysEvents();
  }, []);

  return (
    <section style={{ padding: '20px 0 60px 0', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          textAlign: 'center' 
        }}>
          Today's Events
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>No events happening today</div>
        ) : (
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            {events.map((event) => {
              const start = event.start?.toDate?.();
              const end = event.end?.toDate?.();
              const formattedDate = start ? start.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) : 'Unknown';
              const formattedTime = start ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase() : 'Unknown';
              const formattedEndTime = end ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase() : 'Unknown';
              
              return (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title || "Untitled Event"}
                  area={event.area || "Campus"}
                  location={event.location || "TBD"}
                  date={formattedDate}
                  time={formattedTime}
                  endTime={formattedEndTime}
                  description={event.description || "No description available"}
                  foodType={event.foodType || (event.food_type ? event.food_type.join(", ") : "Food")}
                  foodProvider={event.food_provider?.[0] || "Unknown provider"}
                  followers={event.followers || []}
                  hasNotification={event.hasNotification || false}
                  imageUrl={event.imageURL || event.imageUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysEvents;