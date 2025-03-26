import React from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant } from 'react-icons/md';

// interface - add more if needed
interface EventCardProps {
  title: string;
  location: string;
  date: string;
  time: string;
  foodType: string;
  hasNotification?: boolean; //optional
}

const EventCard = ({ 
  title, 
  location, 
  date, 
  time, 
  foodType, 
  hasNotification 
}: EventCardProps) => {
  return (
    // card container
    <div style={{ 
      width: '280px',
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
      backgroundColor: 'white', 
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      gap: '13px'
    }}>

      {/* title and notification icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>{title}</h3>
        {hasNotification && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MdNotifications size={20} />
          </div>
        )}
      </div>
      
      {/* location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdLocationOn size={16} />
        <span style={{ fontSize: '0.9rem' }}>{location}</span>
      </div>
      
      {/* date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdCalendarToday size={16} />
        <span style={{ fontSize: '0.9rem' }}>{date} @{time}</span>
      </div>
      
      {/* food type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdRestaurant size={16} />
        <span style={{ fontSize: '0.9rem' }}>{foodType}</span>
      </div>
    </div>
  );
};

export default EventCard;