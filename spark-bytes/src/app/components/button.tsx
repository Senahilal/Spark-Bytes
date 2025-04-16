'use client';
import React from 'react';
import Link from 'next/link';
import { Button as AntdButton } from 'antd';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick,
  href
}) => {
  const buttonStyle = { 
    backgroundColor: "#036D19", 
    color: 'white', 
    borderRadius: '9999px', 
    padding: '12px 24px', 
    fontWeight: '500', 
    fontSize: '17px',
    border: 'none',
    cursor: 'pointer',
    height: 'auto'
  };
  
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <AntdButton 
          type="primary" 
          style={buttonStyle} 
          onClick={onClick}
        >
          {children}
        </AntdButton>
      </Link>
    );
  }
  
  return (
    <AntdButton
    type="primary" 
      style={buttonStyle} 
      onClick={onClick}
    >
      {children}
    </AntdButton>
  );
};

export default Button;