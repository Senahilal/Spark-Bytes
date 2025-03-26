import React from 'react';
import Hero from './components/hero';
import TrendingEvents from './components/trendingevents';
import Footer from './components/footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <TrendingEvents />
      </main>
      <Footer />
    </div>
  );
}