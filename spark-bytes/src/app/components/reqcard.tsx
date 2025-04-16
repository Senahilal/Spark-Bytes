"use client"

import React, { useState } from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant, MdClose, MdShare, MdPeople } from 'react-icons/md';
import { Modal } from 'antd';
import CloseButton from './closeButton'; // Note: The 'C' is capitalized here

// interface - add more if needed
interface ReqCardProps {
  id: string;
  user_name: string;
  message: string;
  status: string;
    date: string;
    time: string;
}

const ReqCard = ({
    id,
    user_name,
    message,
    status,
    date,
    time
}: ReqCardProps) => {


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
          cursor: 'pointer',
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

      </div>
    </>
  );
};

export default ReqCard;

