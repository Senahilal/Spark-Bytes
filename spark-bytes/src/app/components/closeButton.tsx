"use client";

import React from 'react';

interface CloseButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClick, 
  label = "Close", 
  className = "", 
  style = {} 
}) => {
  return (
    <button 
      onClick={onClick} 
      className={className}
      style={{
        background: '#036D19',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 40px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background-color 0.2s ease',
        ...style
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#025414';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#036D19';
      }}
    >
      {label}
    </button>
  );
};

export default CloseButton;