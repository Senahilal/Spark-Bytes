import React, { useState } from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant, MdClose, MdShare } from 'react-icons/md';
import { Modal } from 'antd';

// interface - add more if needed
interface EventCardProps {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  foodType: string;
  hasNotification?: boolean; // optional
  address?: string; // added for modal detail view
  imageUrl?: string; // added for modal detail view
}

const EventCard = ({ 
  id,
  title, 
  location, 
  date, 
  time, 
  foodType, 
  hasNotification,
  address = "665 Commonwealth Ave", // default value for demo
  imageUrl = "/images/cookies.jpg" // default value for demo
}: EventCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setIsModalVisible(false);
  };

  return (
    <>
      {/* card container */}
      <div 
        onClick={showModal}
        style={{ 
          width: '280px',
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
          backgroundColor: 'white', 
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '13px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',

        }}
      >
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

      {/* Modal for detail view */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: 0, borderRadius: '12px', overflow: 'hidden' }}
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative' }}>
          {/* Green header */}
          <div style={{ 
            backgroundColor: '#036D19', 
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>{title}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MdNotifications size={24} color="white" />
              <MdShare size={24} color="white" />
            </div>
          </div>

          {/* Cookie image */}
          <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
            <img 
              src={imageUrl} 
              alt={`${foodType} at ${title}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Event details */}
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '15px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdLocationOn size={24} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{location}</div>
                  <div>{address}</div>
                </div>
              </div>
              <div style={{ color: 'red', fontWeight: 'bold' }}>1/30</div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '15px' 
            }}>
              <MdCalendarToday size={24} />
              <div>{date} @{time}</div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '15px' 
            }}>
              <MdRestaurant size={24} />
              <div>{foodType}</div>
            </div>
          </div>
          
          {/* Close button - positioned absolute */}
          <button 
            onClick={handleCancel} 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <MdClose size={20} />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EventCard;