// app/admin/AdminClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Space, Typography } from 'antd';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import ReqCard from '../components/reqcard';
import Footer from '../components/footer';
import dayjs from 'dayjs';
import { fetchAllRequests } from '../firebase/repository';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const { Text } = Typography;

export default function AdminClient() {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const originalReqRef = useRef<any[]>([]);

  useEffect(() => {
    async function loadRequests() {
      if (!user) return;
      const fetched = await fetchAllRequests(user);
      if (fetched) {
        originalReqRef.current = fetched;
        setRequests(fetched);
      }
    }
    loadRequests();
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#DEEFB7', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/profile">
            <AccountIcon />
          </Link>
        </div>
        <div style={{ maxWidth: '1024px', margin: '80px auto 20px', display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ fontSize: '28px' }}>Organizer Requests</Text>
        </div>
      </div>

      {/* Requests Grid */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '18px', color: '#666' }}>
            No requests currently.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(900px,1fr))', gap: '24px', marginBottom: '40px' }}>
            {requests.map(request => {
              const created = request.created_at?.toDate?.();
              const date = created ? dayjs(created).format('MM/DD/YYYY') : 'Unknown Date';
              const time = created ? dayjs(created).format('h:mm A') : 'Unknown Time';
              return (
                <ReqCard
                  key={request.id}
                  id={request.id}
                  user_id={request.user_id}
                  user_name={request.user_name}
                  date={date}
                  time={time}
                  message={request.message}
                  status={request.status}
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
