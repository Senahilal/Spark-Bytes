import React from 'react';
import EventCard from './eventcard';

const TrendingEvents = () => {
  // Mock data based on the screenshot
  const events = [
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
    }
  ];

  return (
    <section style={{ padding: '20px 0 60px 0', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          textAlign: 'center' 
        }}>
          Trending Events
        </h2>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          {events.map((event) => (
            <EventCard 
              key={event.id}
              title={event.title}
              location={event.location}
              date={event.date}
              time={event.time}
              foodType={event.foodType}
              hasNotification={event.hasNotification}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;