"use client";
import dynamic from 'next/dynamic'

// Dynamically import with no SSR
const HomePage = dynamic(() => import('./HomePage'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Page() {
  return <HomePage />
}
