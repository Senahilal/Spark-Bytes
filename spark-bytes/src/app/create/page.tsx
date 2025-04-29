// app/create/page.tsx
"use client";

import dynamic from 'next/dynamic'

// Dynamically import with no SSR
const CreateEventPage = dynamic(() => import('./CreateEventPage'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Page() {
  return <CreateEventPage />
}
