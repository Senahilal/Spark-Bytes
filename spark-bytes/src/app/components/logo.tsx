import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
<div style={{ 
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 10
    }}>
      <Image 
        src="/logo.png"
        alt="Spark Bytes Logo"
        width={130}
        height={80}
        style={{
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default Logo;