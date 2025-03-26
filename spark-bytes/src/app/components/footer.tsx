import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: '#DEEFB7', 
      padding: '12px 0',
      textAlign: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px'
      }}>
        <p style={{ color: '#4b5563', margin: 0 }}>
          Spark!Bytes 
        </p>
      </div>
    </footer>
  );
};

export default Footer;