"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from './logo';
import AccountIcon from './accounticon';
import Button from './button';
import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Hero = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.admin === true);
          setIsOrganizer(userData.organizer === true);
        }
      }
    };

    checkUser();
  }, [user]);

  {/* Image Slider */ }

  const images = [
    "/cds.jpg",
    "/cas.jpg",
    "/comm.jpg",
    "/bu.png",
    "/agganis.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <style jsx global>{`
        @keyframes floatAnimation {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        
      `}</style>

      {/* Gradient Background Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '115px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0))',
        zIndex: 5,
      }} />

      {/* Logo and Account Icon */}
      <Logo />

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        top: '16px',
        right: '16px',
        gap: '10px',
        zIndex: 10
      }}>
        {isAdmin && (
          <Button href="/admin">
            Admin
          </Button>
        )}
        <Link href="/profile">
          <AccountIcon />
        </Link>
      </div>

      {/* Background image */}
      <div style={{ position: 'relative', width: '100%', height: '460px', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image
            src={images[currentImageIndex]}
            alt={`Campus Image ${currentImageIndex + 1}`}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />


          {/* Indicator dots */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentImageIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div style={{ backgroundColor: "#DEEFB7", padding: '30px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <div style={{ maxWidth: '60%', paddingLeft: '50px' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 'bold', marginBottom: '15px' }}>Free Food, Zero Waste</h1>
            <p style={{ fontSize: '1.3rem', marginBottom: '34px' }}>Find, Share, and Enjoy Extra Food on Campus!</p>

            {/* buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '26px'
            }}>
              <Button href="/EventListing">Find Free Food Now</Button>
              { isOrganizer && (<Button href="/create">Post an Event</Button>)}
            </div>
          </div>

          <div style={{ maxWidth: '40%', marginRight: '70px' }}>
            <Image
              src="/pizza.png"
              alt="Pizza"
              width={300}
              height={300}
              style={{
                width: '100%', height: 'auto',
                animation: 'floatAnimation 3s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;