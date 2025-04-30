"use client";

import React, { useState } from 'react';

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

  const bgColor = style.backgroundColor || '#036D19';
  const [hoverColor, setHoverColor] = useState(bgColor);



  const handleMouseOver = () => {
    if (bgColor === '#888') {
      setHoverColor('#666');
    }
    else if (bgColor === '#D32F2F') {
      setHoverColor('#B71C1C');
    }
    else {
      setHoverColor('#025414');
    }
  };
  
  const handleMouseOut = () => {
    setHoverColor(bgColor);
  };
  
  return (
    <button 
      onClick={onClick} 
      className={className}
      style={{
        backgroundColor: hoverColor,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 35px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'backgroundColor 0.2s ease'
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {label}
    </button>
  );
};

export default CloseButton;