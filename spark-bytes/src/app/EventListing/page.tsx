// app/EventListing/page.tsx
import dynamic from 'next/dynamic';
import React from 'react';

// Load EventClient only in the browser (no SSR)
const EventClient = dynamic(() => import('./EventClient'), { ssr: false });

export default function Page() {
  return <EventClient />;
}
