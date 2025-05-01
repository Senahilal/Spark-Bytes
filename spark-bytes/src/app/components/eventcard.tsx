"use client"

import React, { useState } from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant, MdPeople, MdDescription } from 'react-icons/md';
import { Modal } from 'antd';
import CloseButton from './closeButton';
import ShareButton from './sharebutton';
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import EditEventModal from './EditEventModal';


// interface - add more if needed
interface EventCardProps {
  id: string;
  user: string; //user id of the event organizer
  title: string;
  area?: string;
  location: string;
  date: string;
  time: string;
  endTime?: string;
  description?: string;
  foodType: string;
  foodProvider?: string;
  followers: string[];
  hasNotification?: boolean;
  address?: string;
  imageUrl?: string;
  currentUserId?: string; // optional - user id of currently logged in user
  onDelete?: (id: string) => void; //optional - passing this prop from only profile page - can be delted only from profile page 
  availability: string;
}


const EventCard = ({
  id,
  user, //event organizer
  currentUserId,//logged in user
  onDelete, //optional - passing this prop from only profile page
  title,
  area,
  location,
  date,
  time,
  endTime,
  description,
  foodType,
  followers,
  // address = "665 Commonwealth Ave", // default value for demo
  imageUrl = "/insomnia_cookies.jpeg",
  availability
}: EventCardProps) => {

  const [isModalVisible, setIsModalVisible] = useState(false); //card modal
  const [isFollowing, setIsFollowing] = useState(
    currentUserId && followers && Array.isArray(followers) ?
      followers.includes(currentUserId) : false
  );

  const [showEditModal, setShowEditModal] = useState(false);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  const handleNotifyMe = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUserId) {
      // Handle case when user is not logged in
      console.log("User must be logged in to follow events");
      return;
    }

    try {
      const eventRef = doc(db, "events", id);

      if (isFollowing) {
        // remove user from followers
        await updateDoc(eventRef, {
          followers: arrayRemove(currentUserId)
        });
      } else {
        // Add user to followers
        await updateDoc(eventRef, {
          followers: arrayUnion(currentUserId)
        });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating event followers:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "events", id));
      console.log("Event deleted successfully.");
      setIsModalVisible(false);

      //notify parent to refresh events
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getShareText = () => {
    return `Check out this event: ${title} - ${foodType} at ${location} on ${date} at ${time}`;
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
          {currentUserId && isFollowing && (
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
              {currentUserId && isFollowing && <MdNotifications size={24} color="white" />}
              <ShareButton
                title={title}
                text={getShareText()}
                url={`${window.location.origin}/events/${id}`} // Adjust the URL structure as needed
              />
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
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color:
                    availability === 'high' ? 'green' :
                      availability === 'medium' ? 'orange' :
                        availability === 'low' ? 'red' : '#888'
                }}>
                  <MdPeople size={18} />
                  <span>Food Availability</span>
                </div>
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  {[0, 1, 2].map((i) => {
                    const activeCount =
                      availability === 'high' ? 3 :
                        availability === 'medium' ? 2 :
                          availability === 'low' ? 1 : 0;

                    const color =
                      availability === 'high' ? 'green' :
                        availability === 'medium' ? 'orange' :
                          availability === 'low' ? 'red' : '#ddd';

                    return (
                      <div
                        key={i}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: i < activeCount ? color : '#ddd'
                        }}
                      />
                    );
                  })}
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


            {/* Description - Added for modal view */}
            {description && (
              <div style={{
                width: '90%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <MdDescription size={28} />
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{description}</div>
              </div>
            )}
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
              {currentUserId ? (
                <CloseButton
                  onClick={handleNotifyMe}
                  label={isFollowing ? "Cancel Notification" : "Notify Me"}
                  style={isFollowing ? { backgroundColor: '#888', cursor: 'pointer', whiteSpace: 'nowrap' } : { backgroundColor: '#036D19' }}
                />
              ) : null}
              <CloseButton
                onClick={handleCancel}
                label="Close"
              />

              {/* DELETE BUTTON - Only shown in profile page of its owner */}
              {currentUserId === user && (
                <CloseButton
                  onClick={handleDelete}
                  label="Delete"
                  style={{ backgroundColor: "#D32F2F", color: "white" }}
                />
              )}

              {currentUserId === user && (
                <CloseButton
                  onClick={() => setShowEditModal(true)}
                  label="Edit"
                  style={{ backgroundColor: "#036D19", color: "white" }}
                />
              )}


            </div>
          </div>
        </div>
      </Modal>

      <EditEventModal
        eventId={id}
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEventUpdated={() => {
          // Option 1: refetch all events
          // Option 2: update this card’s props locally (if you store them in state)
        }}
      />
    </>
  );
};

export default EventCard;