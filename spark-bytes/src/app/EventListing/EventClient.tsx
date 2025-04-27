// app/EventListing/EventClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Input, Space, Pagination, DatePicker, Select, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import EventCard from '../components/eventcard';
import Footer from '../components/footer';
import Button from '../components/button';
import dayjs, { Dayjs } from 'dayjs';
import { fetchAllEvents } from '../firebase/repository';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const { Option } = Select;

export default function EventClient() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<any[]>([]);
  const originalEventsRef = useRef<any[]>([]);

  // Check user roles
  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.admin === true);
          setIsOrganizer(userData.organizer === true);
        }
      }
    };
    checkUser();
  }, [user]);

  // Fetch events
  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchAllEvents();
      if (fetchedEvents) {
        originalEventsRef.current = fetchedEvents;
        setEvents(fetchedEvents);
      }
    };
    loadEvents();
  }, []);

  // Filters
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);

  useEffect(() => {
    let filtered = originalEventsRef.current;

    if (selectedDate) {
      const sel = selectedDate.format('MM/DD/YYYY');
      filtered = filtered.filter(
        (e) => e.start && dayjs(e.start.toDate()).format('MM/DD/YYYY') === sel
      );
    }

    if (selectedLocation.length) {
      filtered = filtered.filter((e) => selectedLocation.includes(e.area));
    }

    if (selectedFoodType.length) {
      filtered = filtered.filter((e) =>
        e.food_type?.some((t: string) => selectedFoodType.includes(t))
      );
    }

    setEvents(filtered);
  }, [selectedDate, selectedLocation, selectedFoodType]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#DEEFB7', padding: '60px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Link href="/">
            <Logo />
          </Link>
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: 10 }}>
            {isOrganizer && <Button href="/create">Post an Event</Button>}
            {isAdmin && <Button href="/admin">Admin</Button>}
            <Link href="/profile">
              <AccountIcon />
            </Link>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '40px auto 0', display: 'flex', flexDirection: 'column' }}>
          <span role="img" aria-label="food" style={{ fontSize: 32 }}>
            🍽️
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 'bold', margin: '10px 0' }}>
            Find Free Food on Campus!
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 30,
              border: '1.5px solid rgba(3,109,25,0.9)',
              padding: '2px 10px',
              maxWidth: 500,
              width: '100%',
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a location, food type, or keyword"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '8px 0' }}
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              style={{
                background: 'rgba(3,109,25,0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <SearchOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto', flex: 1 }}>
        <Space size="middle" style={{ marginBottom: 24 }}>
          <ConfigProvider
            theme={{
              token: { colorPrimary: '#036D19' },
              components: { DatePicker: { borderRadius: 8, controlHeight: 45 } },
            }}
          >
            <DatePicker
              format="MM/DD/YYYY"
              onChange={setSelectedDate}
              placeholder="Event Date"
              style={{ width: 350 }}
              popupStyle={{ zIndex: 2000 }}
            />
          </ConfigProvider>
          <ConfigProvider theme={{ token: { colorPrimary: '#036D19' } }}>
            <Select
              mode="multiple"
              placeholder="Location"
              onChange={setSelectedLocation}
              style={{ width: 350 }}
              allowClear
              maxTagCount={2}
            >
              <Option value="East Campus">East Campus</Option>
              <Option value="Central Campus">Central Campus</Option>
              <Option value="West Campus">West Campus</Option>
            </Select>
          </ConfigProvider>
          <ConfigProvider theme={{ token: { colorPrimary: '#036D19' } }}>
            <Select
              mode="multiple"
              placeholder="Food Type"
              onChange={setSelectedFoodType}
              style={{ width: 350 }}
              allowClear
              maxTagCount={2}
            >
              <Option value="Vegan">Vegan</Option>
              <Option value="Vegetarian">Vegetarian</Option>
              <Option value="Halal">Halal</Option>
            </Select>
          </ConfigProvider>
        </Space>

        {/* Event Grid */}
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>No events found matching your criteria.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
              gap: 24,
              marginBottom: 40,
            }}
          >
            {events.map((event) => {
              const start = event.start?.toDate?.();
              const date = start ? dayjs(start).format('MM/DD/YYYY') : 'Unknown Date';
              const time = start ? dayjs(start).format('h:mm A') : 'Unknown Time';
              const end = event.end?.toDate?.();
              const endTime = end ? dayjs(end).format('h:mm A') : 'Unknown';
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  user={event.user}
                  title={event.title}
                  area={event.area}
                  location={event.location}
                  date={date}
                  time={time}
                  description={event.description}
                  endTime={endTime}
                  foodType={event.foodType || event.food_type?.join(', ')}
                  foodProvider={event.foodProvider}
                  followers={event.followers}
                  hasNotification={event.hasNotification}
                  imageUrl={event.imageURL}
                />
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Pagination current={currentPage} total={events.length} onChange={handlePageChange} pageSize={4} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
