"use client";
import React, { useState, useEffect } from "react";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import styles from './CreateEventPage.module.css';

import { Form, Input, DatePicker, Button, Card, Row, Col, List, Typography, Tag, Select, Menu, Checkbox, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';


import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LocalEvent from "@/app/classes/LocalEvent";
import { createEvent } from "@/app/firebase/repository";
import Link from 'next/link';
import Logo from '../components/logo';
import AccountIcon from '../components/accounticon';
import Footer from '../components/footer';
import ButtonComponent from '../components/button';

import type { MenuInfo } from 'rc-menu/lib/interface';


dayjs.extend(utc);
dayjs.extend(timezone);

const easternTimeZone = 'America/New_York';
const { Title, Text } = Typography;


const { Item } = Form;

const CreateEventPage: React.FC = () => {

  const [form] = Form.useForm();
  const [eventDate, setEventDate] = useState<dayjs.Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs());
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [currentFoodItem, setCurrentFoodItem] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);

  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const router = useRouter();

  //redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    else{
      const checkUser = async () => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (!userData.organizer) {
              router.push("/profile");
            }

            setIsAdmin(userData.admin === true);
            setIsOrganizer(userData.organizer === true);
          }
        }
      };
  
      checkUser();
    }
  }, [user, loading, router]);

  const options = ['Halal', 'Vegetarian', 'Vegan', 'Gluten Free', 'Nut Free'];

  const handleMenuClick = (e: MenuInfo) => {
    const value = e.key;
    setSelectedFoodType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };


  const menu = (
    <Menu>
      {options.map((item) => (
        <Menu.Item key={item} onClick={handleMenuClick}>
          <Checkbox checked={selectedFoodType.includes(item)}>{item}</Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  //Used coPilot to help with the form submission
  const handleFormSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      const values = form.getFieldsValue();
      /** 
      const eventData = {
        title: values.title,
        location: values.location,
        area: values.area,
        start: eventDate ? eventDate.toDate() : null,
        end: values.endDate ? dayjs(values.endDate).toDate() : null,
        food_type: selectedFoodType,
        user: user.uid,
        createdAt: new Date(),
        description: values.description,
  
      };
      */

      const eventData: LocalEvent = {
        title: values.title,
        location: values.location,
        area: values.area,
        start: eventDate.toDate(),
        end: endDate.toDate(),
        food_type: selectedFoodType,
        user: user.uid,
        date: new Date(),
        description: values.description,
        food_provider: foodItems,
        followers: [user.uid],
        created_at: new Date(),
        last_updated_by: user.uid,
      };

      await createEvent(eventData);


      router.push("/"); // Navigate to dashboard after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAddFoodProvider = () => {
    if (currentFoodItem.trim()) {
      setFoodItems([...foodItems, currentFoodItem.trim()]);
      setCurrentFoodItem(""); // Clear the input field
    }
  };

  const handleRemoveFoodProvider = (index: number) => {
    const newItems = [...foodItems];
    newItems.splice(index, 1); // Remove the item at the specified index
    setFoodItems(newItems);
  };

  const onFinish = (values: any) => {
    const eventData = {
      ...values,
      date: eventDate ? eventDate.toISOString() : null,
      foodItems: foodItems,
    };
    console.log('Event data:', eventData);
    // Handle form submission here
  };


  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: "#E3F4C9", padding: "24px" }}>
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
            {isAdmin && (
              <ButtonComponent href="/admin">
                Admin
              </ButtonComponent>
            )}
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
                Create a New Event
              </Text>
            </div>
          </Space>
        </div>
      </div>

      <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[24, 24]}>
            {/* Left column - Event Details */}
            <Col xs={24} md={12}>
              <Card title="Event Details" className={styles.card}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the event title!' }]}>
                  <Input placeholder="Enter event title" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the event description!' }]}>
                  <Input placeholder="Enter description" />
                </Form.Item>

                <Form.Item label="Area" name="area" rules={[{ required: true, message: 'Please input the event area!' }]}>
                  <Select placeholder="Select a campus">
                    <Select.Option value="West Campus">West Campus</Select.Option>
                    <Select.Option value="East Campus">East Campus</Select.Option>
                    <Select.Option value="Central Campus">Central Campus</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please input the event location!' }]}>
                  <Input placeholder="Enter event location" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select the start date!' }]}>
                      <DatePicker
                        onChange={(date) => date && setEventDate(dayjs(date).tz(easternTimeZone))}
                        style={{ width: '100%' }}
                        showTime={{ format: 'hh:mm A', use12Hours: true }}
                        format="MMMM DD, YYYY hh:mm A"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please select the end date!' }]}>
                      <DatePicker
                        onChange={(date) => date && setEndDate(dayjs(date).tz(easternTimeZone))}
                        style={{ width: '100%' }}
                        showTime={{ format: 'hh:mm A', use12Hours: true }}
                        format="MMMM DD, YYYY hh:mm A"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Right column - Food Info */}
            <Col xs={24} md={12}>
              <Card title="Food Type" className={styles.card}>
                <Dropdown
                  menu={{
                    items: options.map(option => ({
                      key: option,
                      label: (
                        <Checkbox
                          checked={selectedFoodType.includes(option)}
                          onChange={() => handleMenuClick({ key: option } as MenuInfo)}
                        >
                          {option}
                        </Checkbox>
                      )
                    }))
                  }}
                >
                  <Button>
                    {selectedFoodType.length > 0 ? selectedFoodType.join(', ') : 'Select Food Type'} <DownOutlined />
                  </Button>
                </Dropdown>
              </Card>

              <Card title="Food Provider">
                {/* Label outside Form.Item */}
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Enter provider and press Enter"
                    value={currentFoodItem}
                    onChange={(e) => setCurrentFoodItem(e.target.value)}
                    onPressEnter={handleAddFoodProvider}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    onClick={handleAddFoodProvider}
                    disabled={!currentFoodItem.trim()}
                  >
                    Add
                  </Button>
                </Space.Compact>

                {/* Tags below input */}
                <div style={{ marginTop: 8 }}>
                  {foodItems.map((item, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => handleRemoveFoodProvider(index)}
                      color="green"
                    >
                      {item}
                    </Tag>
                  ))}
                </div>
              </Card>

            </Col>
          </Row>

          {/* Form buttons */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button danger size="large" style={{ width: 200 }} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="primary" size="large" style={{ width: 200 }} onClick={handleFormSubmit}>
              POST EVENT
            </Button>
          </div>

        </Form>
      </div>

      <Footer />
    </>
  );
};

export default CreateEventPage;


