import React from 'react';
import { MdAccountCircle } from 'react-icons/md';

const AccountIcon = () => {
    return (
        <div style={{ 
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          cursor: 'pointer'
        }}>
          <MdAccountCircle 
            size={60} 
            color="#036D19"
          />
        </div>
      );
    };

export default AccountIcon;