import React from 'react';
import Hero from './components/hero';
import TodaysEvents from './components/todaysEvents';
import Footer from './components/footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <TodaysEvents />
      </main>
      <Footer />
    </div>
  );
}