import React from 'react';
import { MdAccountCircle } from 'react-icons/md';

const AccountIcon = () => {
    return (
        <div style={{ 
          display: 'flex',
          // alignItems: 'center',
          position: 'absolute',
          right: '10px',
          zIndex: 10,
          cursor: 'pointer'
        }}>
          <MdAccountCircle 
            size={63} 
            color="#036D19"
          />
        </div>
      );
    };

export default AccountIcon;