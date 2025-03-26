import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      padding: '12px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '40px', 
            backgroundColor: '#f3f4f6', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <span style={{ color: '#6b7280' }}>(Logo)</span>
          </div>
        </div>
        
        <div style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: '#14b8a6', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          A
        </div>
      </div>
    </nav>
  );
};

export default Navbar;