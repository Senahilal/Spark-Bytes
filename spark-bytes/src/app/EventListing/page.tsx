'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<any[]>([]);
  const originalEventsRef = useRef<any[]>([]);


  //fetching all events
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


  //Filtering
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = originalEventsRef.current;

      if (selectedDate) {
        const selected = selectedDate.format("MM/DD/YYYY");

        filtered = filtered.filter((event) => {
          // Skip if start is missing
          if (!event.start) return false;

          const eventDate = dayjs(event.start.toDate()).format("MM/DD/YYYY");
          return eventDate === selected;
        });
      }

      if (selectedLocation.length > 0) {
        filtered = filtered.filter((event) =>
          selectedLocation.includes(event.area)
        );
      }

      if (selectedFoodType.length > 0) {
        filtered = filtered.filter((event) =>
          event.food_type?.some((type: string) => selectedFoodType.includes(type))
        );
      }

      setEvents(filtered);
    };

    applyFilters();
  }, [selectedDate, selectedLocation, selectedFoodType]);




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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '30px',
            border: '1.5px solid #036D19',
            backgroundColor: 'transparent',
            padding: '2px 10px',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a location, food type, or keyword"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '13px',
              padding: '4px 0',
              marginRight: '6px',
            }}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            style={{
              backgroundColor: '#024e13',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            aria-label="Search"
          >
            <SearchOutlined />
          </button>
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
              format="MM/DD/YYYY"
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
                  activeOutlineColor: "transparent",
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
              <Option value="Test Location">Test Location</Option>
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
                  activeOutlineColor: "transparent",
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
              <Option value="Test Food Type">Test Food Type</Option>
            </Select>
          </ConfigProvider>

        </Space>
        {/* FILTER ENDS HERE */}



        {/* Event cards grid */}
        {events && events.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "18px", color: "#666", margin: "30px", }}>
            No events found matching your criteria.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {events.map(event => {

            const start = event.start?.toDate?.();
            const formattedDate = start ? dayjs(start).format("MM/DD/YYYY") : "Unknown Date";
            const formattedTime = start ? dayjs(start).format("h:mm A") : "Unknown Time";
            const end = event.end?.toDate?.();
            const formattedEndTime = start ? dayjs(end).format("h:mm A") : "Unknown Time";

            return (
              <EventCard
                key={event.id}
                id={event.id}
                user={event.user}
                title={event.title}
                area={event.area}
                location={event.location}
                date={formattedDate}
                time={formattedTime}
                description={event.description}
                endTime={formattedEndTime}
                foodType={event.foodType || event.food_type?.join(", ")}
                foodProvider={event.foodProvider}
                followers={event.followers}
                hasNotification={event.hasNotification}
                imageUrl={event.imageURL}
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