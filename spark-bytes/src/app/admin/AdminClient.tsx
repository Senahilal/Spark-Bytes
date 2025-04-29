// app/admin/AdminClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Space, Typography, Button } from 'antd';
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

  const [selectedStatus, setSelectedStatus] = useState("all");

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

  const filteredRequests = selectedStatus === "all"
    ? requests
    : requests.filter((req) => req.status === selectedStatus);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: "#DEEFB7", padding: "24px" }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/">
            <Logo />
          </Link>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            top: '16px',
            right: '16px',
            gap: '10px'
          }}>
            <Link href="/profile">
              <AccountIcon />
            </Link>
          </div>
        </div>
        
        <div
          style={{
            maxWidth: "1024px",
            margin: '80px auto 20px',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <div>
              <Text strong style={{ fontSize: "28px" }}>
                Organizer Requests
              </Text>
            </div>
          </Space>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>

        {/* FILTER BUTTONS (always rendered) */}
        <div style={{ textAlign: "center", marginBottom: 24, display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {["all", "pending", "accepted", "rejected"].map((status) => (
            <Button
              key={status}
              type={selectedStatus === status ? "primary" : "default"}
              style={{
                backgroundColor: selectedStatus === status ? "#2E7D32" : undefined,
                borderRadius: "20px"
              }}
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* REQUESTS LIST (conditionally rendered) */}
        {filteredRequests.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "18px", color: "#666", margin: "30px" }}>
            <p>No requests currently.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            minHeight: '50%',
            gridTemplateColumns: 'repeat(auto-fill, minmax(900px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {filteredRequests.map(request => {
              const start = request.created_at?.toDate?.();
              const formattedDate = start ? dayjs(start).format("MM/DD/YYYY") : "Unknown Date";
              const formattedTime = start ? dayjs(start).format("h:mm A") : "Unknown Time";

              return (
                <ReqCard
                  id={request.id}
                  key={request.id}
                  user_id={request.user_id}
                  user_name={request.user_name}
                  date={formattedDate}
                  time={formattedTime}
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
