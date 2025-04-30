// app/create/page.tsx
"use client";

import dynamic from 'next/dynamic'

// Dynamically import with no SSR
const EventEdit = dynamic(() => import('./EventEdit'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Page() {
  return <EventEdit />
}
