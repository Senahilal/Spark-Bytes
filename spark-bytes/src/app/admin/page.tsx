'use client';
// app/admin/page.tsx
import dynamic from 'next/dynamic'

const AdminClient = dynamic(() => import('./AdminClient'), { ssr: false })

export default function Page() {
  return <AdminClient />
}
