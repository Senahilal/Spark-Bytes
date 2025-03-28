'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Dropdown, Space, Pagination } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import EventCard from '../components/eventcard';
import Footer from '../components/footer';
import Button from '../components/button';

const { Search } = Input;

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // !! Placeholders - change these !!
  const events = [
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
      hasNotification: true
    },
    {
      id: '3',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: false
    },
    {
      id: '4',
      title: 'Cookie O\' Clock',
      location: 'BU Spark',
      date: '3/19',
      time: '3pm',
      foodType: 'Cookies',
      hasNotification: false
    }
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

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
          <span role="img" aria-label="food" style={{ fontSize: '24px' }}>🍽️</span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            Find Free Food on Campus!
          </h1>
        </div>

        {/* Search bar */}
        <div style={{
          width: '100%',
          maxWidth: '650px',
          alignSelf: 'flex-start'
        }}>
          <Search
            placeholder="Type a location, food type, or keyword"
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            size="large"
            style={{ borderRadius: '50px' }}
          />
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>

        {/* !! Implement filter buttons !! */}

        {/* Event cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {events.map(event => (
            <EventCard
              key={event.id}
              title={event.title}
              location={event.location}
              date={event.date}
              time={event.time}
              foodType={event.foodType}
              hasNotification={event.hasNotification}
            />
          ))}
        </div>

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