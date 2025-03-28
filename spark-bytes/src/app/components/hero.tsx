import React from 'react';
import Image from 'next/image';
import Logo from './logo';
import AccountIcon from './accounticon';
import Button from './button';

const Hero = () => {
  return (
      <div style={{ position: 'relative' }}>
      {/* Logo and Account Icon */}
      <Logo />
      <AccountIcon />
  
      {/* Background image */}
      <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image 
            src="/bostonu.jpeg" 
            alt="Boston University Campus" 
            width={800} 
            height={300}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      
      {/* Hero content */}
      <div style={{ backgroundColor: "#DEEFB7", padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <div style={{ maxWidth: '60%' , paddingLeft: '50px'}}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Free Food, Zero Waste</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}>Find, Share, and Enjoy Extra Food on Campus!</p>
            
            {/* buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '26px' 
            }}>
              <Button href="/EventListing">Find Free Food Now</Button>
              <Button href="/post">Post an Event</Button>
            </div>
          </div>
          
          <div style={{ maxWidth: '40%' }}>
            <Image 
              src="/pizza.png" 
              alt="Pizza" 
              width={300} 
              height={300}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;