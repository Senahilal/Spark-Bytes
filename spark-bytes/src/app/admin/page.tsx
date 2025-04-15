'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Input, Dropdown, Space, Pagination, DatePicker, Select, ConfigProvider } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import ReqCard from '../components/reqcard';
import Footer from '../components/footer';
import Button from '../components/button';
import dayjs, { Dayjs } from "dayjs";
import { fetchAllRequests } from '../firebase/repository';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

const { Search } = Input;
const { Option } = Select;

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [user] = useAuthState(auth);

  const [requests, setRequests] = useState<any[]>([]);
  const originalReqRef = useRef<any[]>([]);


  //fetching all events
  useEffect(() => {
    const loadRequests = async () => {
        if (!user)
        {
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


  // !! Placeholders - change these !!
  const events_placeholder = [
    {
      id: '1',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: true
    },
    {
      id: '2',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: false
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ backgroundColor: '#DEEFB7', padding: '60px' }}>
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

          {/* post an event button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Button href="/create">
              Post an Event
            </Button>

            <Link href="/profile">
              <AccountIcon />
            </Link>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
          // gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px'
          }}></div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            Organizer Requests
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>

        {/*FILTER*/}
        <Space size="middle" style={{ marginBottom: 24 }}>
        </Space>
        {/* FILTER ENDS HERE */}

        {/* Event cards grid */}
        {requests && requests.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "18px", color: "#666", margin: "30px", }}>
            No requests currently.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {requests.map(request => {

            const start = request.created_at?.toDate?.();
            const formattedDate = start ? dayjs(start).format("MM/DD/YYYY") : "Unknown Date";
            const formattedTime = start ? dayjs(start).format("h:mm A") : "Unknown Time";

            return (
              <ReqCard
                id={request.id}
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

        {/* Pagination */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            current={currentPage}
            total={12}
            onChange={handlePageChange}
            pageSize={4}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}