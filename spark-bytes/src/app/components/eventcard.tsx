"use client"

import React, { useState } from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant, MdClose, MdShare, MdPeople } from 'react-icons/md';
import { Modal } from 'antd';
import CloseButton from './closeButton'; // Note: The 'C' is capitalized here

// interface - add more if needed
interface EventCardProps {
  id: string;
  title: string;
  area: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  description: string;
  foodType: string;
  foodProvider: string;
  followers: string[];
  hasNotification?: boolean; // optional
  address?: string; // added for modal detail view
  imageUrl?: string; // added for modal detail view
}

const EventCard = ({
  id,
  title,
  area,
  location,
  date,
  time,
  endTime,
  foodType,
  foodProvider,
  followers,
  hasNotification,
  // address = "665 Commonwealth Ave", // default value for demo
  imageUrl = "/insomnia_cookies.jpeg" // default value for demo
}: EventCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotified, setIsNotified] = useState(hasNotification || false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotified(!isNotified);
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
        }}>

          {/* Image */}
        {imageUrl && (
          <div style={{
            width: '100%',
            height: '160px',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            <img
              src={imageUrl}
              alt={`${foodType} at ${title}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo.png'; // Fallback image
              }}
            />
          </div>
        )}
      
        {/* title and notification icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>{title}</h3>
          {isNotified && (
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
        closeIcon={null}
        styles={{
          body: { padding: 0, borderRadius: '12px', overflow: 'hidden' }
        }}
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
              {isNotified && <MdNotifications size={24} color="white" />}
              <MdShare size={24} color="white" />
            </div>
          </div>

          {/* Image */}
          <div style={{
            padding: '30px 20px 20px 20px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}>
            {imageUrl ? (
              <div style={{
                width: '90%',
                height: '300px',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={imageUrl}
                  alt={`${foodType} at ${title}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/logo.png'; // Fallback image
                    console.log('Error loading image:', imageUrl);
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '90%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                color: '#666',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                No image available
              </div>
            )}
          </div>

          {/* Event details */}
          <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Location */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdLocationOn size={24} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{location}</div>
                  <div>{area}</div>
                </div>
              </div>

              {/* Availability */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'red',
                  fontWeight: 'bold'
                }}>
                  <MdPeople size={18} />
                  <span>Availability</span>
                </div>
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red'
                  }}></div>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ddd'
                  }}></div>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ddd'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Date */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <MdCalendarToday size={24} />
              <div>{date} @{time} - {endTime}</div>
            </div>

            {/* Food */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <MdRestaurant size={24} />
              <div>{foodType}</div>
            </div>
          </div>

          {/* Buttons at the bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ width: '90%', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <CloseButton
                onClick={handleNotifyMe}
                label={isNotified ? "Cancel Notification" : "Notify Me"}
                style={isNotified ? { backgroundColor: '#888', cursor: 'pointer' } : {}}
              />
              <CloseButton
                onClick={handleCancel}
                label="Close"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventCard;