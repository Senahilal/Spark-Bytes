import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: '#DEEFB7', 
      padding: '35px 0',
      textAlign: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px'
      }}>
        <p style={{ color: '#4b5563', margin: 0 }}>
        <strong>
         🍎 Reducing food waste. 🍽️ Sharing what's available.
         </strong>
         <br />
         <br />
         © Spark!Bytes | Team 8 - 4-Bit Bandits

        </p>
      </div>
    </footer>
  );
};

export default Footer;