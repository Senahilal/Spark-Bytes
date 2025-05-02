/**
 * EventClient.tsx
 *
 * This is the main public-facing event discovery page.
 * It displays all posted events and supports:
 * - Text search (by title, description, location, area, or food type)
 * - Filters for date, campus location, and food type
 * - Pagination to view events 6 per page
 * - Conditional  navigation buttons for logged-in organizers (post event) and admins (admin page)
 * - Real-time Firebase integration for fetching events and user roles
 *
 * 
 */

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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";


const { Search } = Input;
const { Option } = Select;

export default function EventClient() {

  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<any[]>([]);
  const originalEventsRef = useRef<any[]>([]);

  const getPagedEvents = () => {

    const sortedEvents = [...events].sort((a, b) => {
      const dateA = a.start?.toDate?.() || new Date(0);
      const dateB = b.start?.toDate?.() || new Date(0);
      return dateB - dateA; // newest first
    });

    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    return sortedEvents.slice(startIndex, endIndex);
  };

  // On user login state change, check if the user is an admin or organizer
  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.admin === true);
          setIsOrganizer(userData.organizer === true);
        }
      }
    };

    checkUser();
  }, [user]);



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

  // Re-apply filters whenever user types or changes filter criteria
  useEffect(() => {
    const applyFilters = () => {
      let filtered = originalEventsRef.current;

      // Keyword text search across title, description, location, etc.
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.area?.toLowerCase().includes(query) ||
          (event.food_type && event.food_type.some((type: string) =>
            type.toLowerCase().includes(query)
          ))
        );
      }

      // Date filter (match only events that happen on selected date)
      if (selectedDate) {
        const selected = selectedDate.format("MM/DD/YYYY");

        filtered = filtered.filter((event) => {
          // Skip if start is missing
          if (!event.start) return false;

          const eventDate = dayjs(event.start.toDate()).format("MM/DD/YYYY");
          return eventDate === selected;
        });
      }

      // Filter by food types (match any of selected types)
      if (selectedFoodType.length > 0) {
        filtered = filtered.filter((event) =>
          event.food_type?.some((type: string) => selectedFoodType.includes(type))
        );
      }

      setEvents(filtered);
    };

    applyFilters();
  }, [selectedDate, selectedLocation, selectedFoodType, searchQuery]);

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
            position: 'absolute',
            top: '16px',
            right: '16px',
            gap: '10px'
          }}>

            {/* Show Post Event if user is organizer */}
            {isOrganizer && (
              <Button href="/create">
                Post an Event
              </Button>
            )}

            {/* Show Admin Panel button if user is admin */}
            {isAdmin && (
              <Button href="/admin">
                Admin
              </Button>
            )}
            <Link href="/profile">
              <AccountIcon />
            </Link>
          </div>
        </div>

        {/* Fixed heading and search container */}
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          {/* Heading section */}
          <div style={{ marginBottom: '20px' }}>
            <span role="img" aria-label="food" style={{ fontSize: '32px', marginRight: '10px' }}>🍽️</span>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              Find Free Food on Campus!
            </h1>
          </div>

          {/* Search bar - positioned directly below the heading */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '30px',
              border: '1.5px solid rgba(3, 109, 25, 0.9)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: '2px 10px',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            {/* Text input search bar for filtering by keywords */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="  Type a location, food type, or keyword"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#333',
                fontSize: '16px',
                padding: '8px 0',
                marginRight: '6px',
              }}
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              style={{
                backgroundColor: 'rgba(3, 109, 25, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              aria-label="Search"
            >
              <SearchOutlined />
            </button>
          </div>
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
                colorBgContainer: "transparent",
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
                  selectorBg: "transparent",              // background
                  multipleItemBg: "rgba(227, 244, 201, 0.5)",  //  tags in multi-select
                  optionSelectedBg: "rgba(227, 244, 201, 0.7)", // background when option is selected
                  activeOutlineColor: "#E3F4C9",
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
                backgroundColor: "transparent",
                border: "0.8px solid #E3F4C9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
                  selectorBg: "#transparent",              // Background color
                  multipleItemBg: "rgba(227, 244, 201, 0.5)",  //  tags in multi-select
                  optionSelectedBg: "rgba(227, 244, 201, 0.7)",        // Background color when option is selected
                  activeOutlineColor: "#E3F4C9",
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
                backgroundColor: "transparent",
                border: "0.8px solid #E3F4C9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
              allowClear
              maxTagCount={2}
            >
              <Option value="Pizza">Pizza</Option>
              <Option value="Mexican">Mexican</Option>
              <Option value="Asian">Asian</Option>
              <Option value="Snacks">Snacks</Option>
              <Option value="Desserts">Desserts</Option>
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
            {getPagedEvents().map(event => {

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
                  endTime={formattedEndTime}
                  description={event.description}
                  foodType={event.foodType || event.food_type?.join(", ")}
                  foodProvider={event.foodProvider}
                  followers={event.followers}
                  hasNotification={event.hasNotification}
                  imageUrl={event.imageURL}
                  currentUserId={user?.uid}
                  availability={event.availability}
                />
              );
            })}

          </div>
        )}

        {/* Pagination */}

        {/* Pagination */}
        <div style={{
          marginTop: '50px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#036D19",
                colorBorder: "#E3F4C9",
              },
              components: {
                Pagination: {
                  itemActiveBg: "rgba(3, 109, 25, 0.1)",
                }
              }
            }}>
            <Pagination
              current={currentPage}
              total={events.length}
              onChange={handlePageChange}
              pageSize={6}
              style={{
                textAlign: 'center',
                margin: '0 auto'
              }}

            />
          </ConfigProvider>
        </div>
      </div>

      <Footer />
    </div>
  );
}