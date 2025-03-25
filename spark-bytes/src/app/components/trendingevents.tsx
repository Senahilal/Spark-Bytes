import React from 'react';
import EventCard, { EventCardProps } from './eventcard';
import { EventType } from '../types';

const TrendingEvents: React.FC = () => {
  // Mock data based on the screenshot
  const events: EventType[] = [
    {
      id: '1',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: true
    },
    {
      id: '2',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: true
    },
    {
      id: '3',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: false
    },
 
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Trending Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {events.map((event) => {
            const cardProps: EventCardProps = {
              title: event.title,
              location: event.location,
              date: event.date,
              time: event.time,
              foodType: event.foodType,
              hasNotification: event.hasNotification
            };
            
            return <EventCard key={event.id} {...cardProps} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;