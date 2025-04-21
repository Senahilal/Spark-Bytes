"use client"

import React, { useState } from 'react';
import { MdCalendarToday, MdClose, MdCheck } from 'react-icons/md';
import { Modal } from 'antd';
import CloseButton from './closeButton'; // Note: The 'C' is capitalized here
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// interface - add more if needed
interface ReqCardProps {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  status: string;
    date: string;
    time: string;
}

const ReqCard = ({
    id,
    user_id,
    user_name,
    message,
    status,
    date,
    time, 
    onRefresh //To refresh
}: ReqCardProps & {onRefresh: () => void}) => {

  const handleAccept = async () => {
    try {
      const reqInfo = doc(db, 'requests', id);
      await updateDoc(reqInfo, { status: 'accepted' });

      const userInfo = doc(db, 'users', user_id);
      await updateDoc(userInfo, { organizer: true });
      console.log(`${user_name} accepted`);

      onRefresh(); // Call the refresh function passed as a prop
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async () => {
    try {
      const reqInfo = doc(db, 'requests', id);
      await updateDoc(reqInfo, { status: 'rejected' });

      const userInfo = doc(db, 'users', user_id);
      await updateDoc(userInfo, {organizer: false});
      console.log(`${user_name} rejected`);
      onRefresh(); // Call the refresh function passed as a prop
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  }


  return (
    <>
      {/* card container */}
      <div
        style={{
          width: '280px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backgroundColor: 'white',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '13px',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {/* User Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>{user_name}</h3>
        </div>

        {/* message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem' }}>{message}</span>
        </div>

        {/* date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdCalendarToday size={16} />
          <span style={{ fontSize: '0.9rem' }}>{date} @{time}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          {/* Approve Button */}
          <button
            onClick={handleAccept}
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MdCheck size={16} />
            Approve
          </button>

          {/* Reject Button */}
          <button
            onClick={handleReject}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MdClose size={16} />
            Reject
          </button>
        </div>
      </div>
    </>
  );
};

export default ReqCard;

