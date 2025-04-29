'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Input, Dropdown, Button, Space, Typography, Pagination, DatePicker, Select, ConfigProvider } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import ReqCard from '../components/reqcard';
import Footer from '../components/footer';
import dayjs from "dayjs";
import { fetchAllRequests } from '../firebase/repository';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

const { Title, Text } = Typography;


export default function FindPage() {

  const [user] = useAuthState(auth);

  const [requests, setRequests] = useState<any[]>([]);
  const originalReqRef = useRef<any[]>([]);

  const [selectedStatus, setSelectedStatus] = useState("all");


  //fetching all events
  useEffect(() => {
    const loadRequests = async () => {
      if (!user) {
        console.log("User not logged in");
        return;
      }
      const fetchedRequests = await fetchAllRequests(user);
      if (fetchedRequests) {
        originalReqRef.current = fetchedRequests;
        setRequests(fetchedRequests);
      }
    };
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
          <Link href="/profile">
            <AccountIcon />
          </Link>
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

        {/*FILTER*/}
        <Space size="middle" style={{ marginBottom: 24 }}>
        </Space>

        <div style={{ marginBottom: 24, display: 'flex', gap: '12px' }}>
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

        {/* FILTER ENDS HERE */}

        {/* Event cards grid */}
        {requests && requests.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "18px", color: "#666", margin: "30px", }}>
            No requests currently.
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