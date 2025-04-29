// app/profile/page.tsx
"use client";

import dynamic from 'next/dynamic'

// Dynamically import with no SSR
const ProfilePage = dynamic(() => import('./ProfilePage'), {
    ssr: false,
    loading: () => <div>Loading...</div>
})

export default function Page() {
    return <ProfilePage />
}
