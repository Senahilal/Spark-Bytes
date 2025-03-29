'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input, Dropdown, Space, Pagination, DatePicker, Select, ConfigProvider } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import EventCard from '../components/eventcard';
import Footer from '../components/footer';
import Button from '../components/button';
import dayjs, { Dayjs } from "dayjs";
import { fetchAllEvents } from '../firebase/repository';

const { Search } = Input;
const { Option } = Select;

<ConfigProvider
  theme={{
    components: {
      Select: {
        selectorBg: "#E3F4C9",           // background of the input
        optionSelectedBg: "#C5E1A5",     // background when you select an item
        multipleItemBg: "#E3F4C9",       // background of the tags
        controlHeight: 40,               // makes height match DatePicker
        borderRadius: 8,                 // rounded corners
      },
    },
  }}
></ConfigProvider>

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<any[]>([]);

  //fetching all events
  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchAllEvents();
      if (data) setEvents(data);
    };

    loadEvents();
  }, []);

  //Filtering
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);


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

        {/*FILTER*/}
        <Space size="middle" style={{ marginBottom: 24 }}>

          {/* Date Picker */}
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#036D19",
                colorBorder: "#E3F4C9",
                colorBgContainer: "#E3F4C9",
              },
              components: {
                DatePicker: {
                  borderRadius: 8,
                  controlHeight: 45,
                },
              },
            }}
          >
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              placeholder="Event Date"
              style={{
                width: 350,
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
              popupStyle={{ zIndex: 2000 }}
            />
          </ConfigProvider>


          {/* Location Select */}
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  selectorBg: "#E3F4C9",              // Background color
                  multipleItemBg: "#E3F4C9",          // Tags in multi-select
                  optionSelectedBg: "#E3F4C9",        // Background color when option is selected
                  activeOutlineColor: "transparent",  // Prevent blue glow
                  controlHeight: 45,
                  borderRadius: 8,
                },
              },
              token: {
                colorBorder: "#E3F4C9",
                colorPrimary: "#036D19",
              },
            }}
          >
            <Select
              mode="multiple"
              placeholder="Location"
              onChange={(value) => setSelectedLocation(value)}
              style={{
                width: 350,
                backgroundColor: "#E3F4C9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                borderRadius: "8px",
              }}
              allowClear
              maxTagCount={2}
            >
              <Option value="East Campus">East Campus</Option>
              <Option value="Central Campus">Central Campus</Option>
              <Option value="West Campus">West Campus</Option>
            </Select>
          </ConfigProvider>

          {/* Food Type Select */}
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  selectorBg: "#E3F4C9",              // Background color
                  multipleItemBg: "#E3F4C9",          // Tags in multi-select
                  optionSelectedBg: "#E3F4C9",        // Background color when option is selected
                  activeOutlineColor: "transparent",  // Prevent blue glow
                  controlHeight: 45,
                  borderRadius: 8,
                },
              },
              token: {
                colorBorder: "#E3F4C9",
                colorPrimary: "#036D19",
              },
            }}
          >
            <Select
              mode="multiple"
              placeholder="Food Type"
              onChange={(value) => setSelectedFoodType(value)}
              style={{
                width: 350,
                backgroundColor: "#E3F4C9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                borderRadius: "8px",
              }}
              allowClear
              maxTagCount={2}
            >
              <Option value="Vegan">Vegan</Option>
              <Option value="Vegetarian">Vegetarian</Option>
              <Option value="Halal">Halal</Option>
            </Select>
          </ConfigProvider>

        </Space>
        {/* FILTER ENDS HERE */}


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