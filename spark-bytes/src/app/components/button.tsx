import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick
}) => {
  return (
    <button 
      style={{ 
        backgroundColor: "#036D19", 
        color: 'white', 
        borderRadius: '9999px', 
        padding: '12px 24px', 
        fontWeight: '500', 
        border: 'none',
        cursor: 'pointer'
      }} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;