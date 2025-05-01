"use client"

import React, { useState } from 'react';
import { MdNotifications, MdLocationOn, MdCalendarToday, MdRestaurant, MdPeople } from 'react-icons/md';
import { Modal, Form, Row, Col, Card, Input, Select, DatePicker, Button, Space, Tag } from 'antd';
import CloseButton from './closeButton';
import ShareButton from './sharebutton';
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const easternTimeZone = "America/New_York";


// interface - add more if needed
interface EventCardProps {
  id: string;
  user: string; //user id of the event organizer
  title: string;
  area?: string;
  location: string;
  date: string;
  time: string;
  endTime?: string;
  description?: string;
  foodType: string;
  foodProvider?: string;
  followers: string[];
  hasNotification?: boolean;
  address?: string;
  imageUrl?: string; 
  currentUserId?: string;
  onDelete?: (id: string) => void; 
  availability: string;
}


const EventCard = ({
  id,
  user, //event organizer
  currentUserId,//logged in user
  onDelete, 
  title,
  area,
  location,
  date,
  time,
  endTime,
  foodType,
  foodProvider,
  followers,
  hasNotification,
  availability,
  // address = "665 Commonwealth Ave", // default value for demo
  imageUrl = "/insomnia_cookies.jpeg"
}: EventCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [available, setAvailability] = useState<string>("Available"); 
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(
    currentUserId && followers && Array.isArray(followers) ? 
      followers.includes(currentUserId) : false
  );
  const router = useRouter(); // Initialize the router
  const [form] = Form.useForm();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    area: "",
    location: "",
    startDate: null,
    endDate: null,
    foodProvider: [],
    availability: "Available",
  });


  const fetchEventData = async () => {
    try {
      const eventRef = doc(db, "events", id);
      const eventDoc = await getDoc(eventRef);
      const eventData = eventDoc.data();
  
      if (eventData) {
        form.setFieldsValue({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          area: eventData.area,
          startDate: dayjs(eventData.start.toDate()).tz(easternTimeZone),
          endDate: dayjs(eventData.end.toDate()).tz(easternTimeZone), 
        });
      } else {
        console.error("Event data is undefined.");
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };
  
  const showEditModal = () => {
    fetchEventData(); // Fetch event data before showing the modal
    setIsEditModalVisible(true);
  };
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    setIsEditModalVisible(false);
    e.stopPropagation();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  const handleNotifyMe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUserId) {
      // Handle case when user is not logged in
      console.log("User must be logged in to follow events");
      return;
    }
    
    try {
      const eventRef = doc(db, "events", id);
      
      if (isFollowing) {
        // remove user from followers
        await updateDoc(eventRef, {
          followers: arrayRemove(currentUserId)
        });
      } else {
        // Add user to followers
        await updateDoc(eventRef, {
          followers: arrayUnion(currentUserId)
        });
      }
      
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating event followers:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "events", id));
      console.log("Event deleted successfully.");
      setIsModalVisible(false);

      //notify parent to refresh events
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/eventEdit?id=${id}`); // Redirect to the EventEdit page with the event ID
  };


  const getShareText = () => {
    return `Check out this event: ${title} - ${foodType} at ${location} on ${date} at ${time}`;
  };

  const handleAddFoodProvider = () => {
    const currentFoodItem = form.getFieldValue("foodProviderInput") || ""; // Default to an empty string
    if (currentFoodItem.trim()) {
      setFoodItems([...foodItems, currentFoodItem.trim()]);
      form.setFieldsValue({ foodProviderInput: "" }); // Clear the input field
    }
  };

  const handleRemoveFoodProvider = (index: number) => {
    const newItems = [...foodItems];
    newItems.splice(index, 1);
    setFoodItems(newItems);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // Log the form values
      const { title, description, area, location, startDate, endDate } = values;
  
      // Validate dates
      if (!startDate || !endDate) {
        console.error("Start date or end date is missing.");
        return;
      }
  
      // Update the event in Firestore
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        title,
        description,
        area,
        location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        foodProvider: foodItems,
        availability,
      });
  
      console.log("Event updated successfully.");
      setIsEditModalVisible(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating event:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <>
      {/* card container */}
      <div
        onClick={showModal}
        style={{
          width: '280px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backgroundColor: 'white',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '13px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}>

        {/* Image */}
        {imageUrl && (
          <div style={{
            width: '100%',
            height: '160px',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            <img
              src={imageUrl}
              alt={`${foodType} at ${title}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo.png'; // Fallback image
              }}
            />
          </div>
        )}

        {/* title and notification icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>{title}</h3>
          {currentUserId && isFollowing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MdNotifications size={20} />
            </div>
          )}
        </div>

        {/* location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdLocationOn size={16} />
          <span style={{ fontSize: '0.9rem' }}>{location}</span>
        </div>

        {/* date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdCalendarToday size={16} />
          <span style={{ fontSize: '0.9rem' }}>{date} @{time}</span>
        </div>

        {/* food type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdRestaurant size={16} />
          <span style={{ fontSize: '0.9rem' }}>{foodType}</span>
        </div>
      </div>

      {/* Modal for detail view */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        closeIcon={null}
        styles={{
          body: { padding: 0, borderRadius: '12px', overflow: 'hidden' }
        }}
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative' }}>
          {/* Green header */}
          <div style={{
            backgroundColor: '#036D19',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>{title}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              {currentUserId && isFollowing && <MdNotifications size={24} color="white" />}
              <ShareButton 
                title={title}
                text={getShareText()}
                url={`${window.location.origin}/events/${id}`} // Adjust the URL structure as needed
              />
            </div>
          </div>

          {/* Image */}
          <div style={{
            padding: '30px 20px 20px 20px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}>
            {imageUrl ? (
              <div style={{
                width: '90%',
                height: '300px',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={imageUrl}
                  alt={`${foodType} at ${title}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/logo.png'; // Fallback image
                    console.log('Error loading image:', imageUrl);
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '90%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                color: '#666',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                No image available
              </div>
            )}
          </div>

          {/* Event details */}
          <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Location */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdLocationOn size={24} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{location}</div>
                  <div>{area}</div>
                </div>
              </div>

              {/* Availability */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'black',
                  fontWeight: 'bold'
                }}>
                  <MdPeople size={18} />
                  Availability: 
                  {availability === 'high' ? 'Available' : availability === 'medium' ? 'Few' : availability === 'none' ? 'None' : 'Unknown'}
                  <div style={{
                    
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: availability === 'high' ? 'green' : availability === 'medium' ? 'orange' : availability === 'none' ? 'red' : 'transparent'
                    }}></div>
                </div>
              </div>
            </div>

            {/* Date */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <MdCalendarToday size={24} />
              <div>{date} @{time} - {endTime}</div>
            </div>

            {/* Food */}
            <div style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <MdRestaurant size={24} />
              <div>{foodType}</div>
            </div>
          </div>

          {/* Buttons at the bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ width: '90%', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            {currentUserId ? (
              <CloseButton
                onClick={handleNotifyMe}
                label={isFollowing ? "Cancel Notification" : "Notify Me"}
                style={isFollowing ? { backgroundColor: '#888', cursor: 'pointer', whiteSpace: 'nowrap' } : { backgroundColor: '#036D19' } }
              />
                ) : null}
              <CloseButton
                onClick={handleCancel}
                label="Close"
              />

              {currentUserId === user && (
                <CloseButton
                  onClick={handleDelete}
                  label="Delete"
                  style={{ backgroundColor: "#036D19 ", color: "white" }}
                />
              )}

              {/* EDIT button for organization */}
              {currentUserId === user && (
                <CloseButton
                  onClick={showEditModal}
                  label="Edit"
                  style={{ backgroundColor: "#036D19 ", color: "white" }}
                />
              )}

            </div>
          </div>
        </div>
      </Modal>

      {/* Modal for EDITING event */}
      <Modal
        title="Edit Event"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={600}
        centered
        closeIcon={null}
        styles={{
          body: { padding: 0, borderRadius: '12px', overflow: 'hidden' }
        }}
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      >
        <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Form form={form} layout="vertical">
          <Row gutter={[24, 24]}>
            {/* Left column - Event Details */}
            <Col xs={24} md={12}>
              <Card title="Event Details" style={{ marginBottom: 20 }}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please input the event title!" }]}>
                <Input
                  placeholder="Enter event title"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the event description!" }]}>
                <Input
                  placeholder="Enter description"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
                </Form.Item>

                <Form.Item label="Area" name="area" rules={[{ required: true, message: "Please input the event area!" }]}>
                  <Select
                    placeholder="Select a campus"
                    value={eventData.area}
                    onChange={(value) => setEventData({ ...eventData, area: value })}
                  >
                    <Select.Option value="West Campus">West Campus</Select.Option>
                    <Select.Option value="East Campus">East Campus</Select.Option>
                    <Select.Option value="Central Campus">Central Campus</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please input the event location!" }]}>
                <Input
                  placeholder="Enter event location"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: "Please select the start date!" }]}>
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A", use12Hours: true }}
                      format="MMMM DD, YYYY hh:mm A"
                      value={eventData.startDate}
                      onChange={(date) => setEventData({ ...eventData, startDate: date })}
                    />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: "Please select the end date!" }]}>
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A", use12Hours: true }}
                      format="MMMM DD, YYYY hh:mm A"
                      value={eventData.endDate}
                      onChange={(date) => setEventData({ ...eventData, endDate: date })}
                    />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Right column - Food Info */}
            <Col xs={24} md={12}>
              <Card title="Food Provider" style={{ marginBottom: 20 }}>
                <Space.Compact style={{ width: "100%" }}>
                <Form.Item name="foodProviderInput">
                      <Input placeholder="Enter provider and press Enter" />
                  </Form.Item>
                  <Button type="primary" onClick={handleAddFoodProvider}>
                    Add
                  </Button>
                </Space.Compact>

                <div style={{ marginTop: 8 }}>
                  {foodItems.map((item, index) => (
                    <Tag key={index} closable onClose={() => handleRemoveFoodProvider(index)} color="green">
                      {item}
                    </Tag>
                  ))}
                </div>
              </Card>
              <Form.Item name="availability" initialValue={availability}>
                  <Card title="Availability" style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <Button
                          type={availability === "high" ? "primary" : "default"}
                          onClick={() => {
                              setAvailability("high");
                              form.setFieldsValue({ availability: "high" });
                          }}
                          style={{ backgroundColor: "green" }}
                          >
                          Available
                          </Button>
                          <Button
                          type={availability === "medium" ? "primary" : "default"}
                          onClick={() => {
                              setAvailability("medium");
                              form.setFieldsValue({ availability: "medium" });
                          }}
                          style={{ backgroundColor: "orange" }}
                          >
                          Few
                          </Button>
                          <Button
                          type={availability === "none" ? "primary" : "default"}
                          onClick={() => {
                              setAvailability("none");
                              form.setFieldsValue({ availability: "none" });
                          }}
                          style={{ backgroundColor: "red" }}
                          >
                          None
                          </Button>
                      </div>
                  </Card>
                  </Form.Item>
            </Col>
          </Row>

          {/* Form action buttons */}
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: "16px" }}>
            <Button danger size="large" style={{ width: 200 }} onClick={handleEditCancel}>
              Cancel
            </Button>
            <Button type="primary" size="large" style={{ width: 200 }} onClick={handleSave}>
              Save
            </Button>
          </div>
        </Form>
      </div>
      </Modal>
    </>
  );
};

export default EventCard;

