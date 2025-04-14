"use client";
import React, { useState } from "react";
import Link from 'next/link';
import Logo from '../components/logo';
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import styles from './CreateEventPage.module.css';

import { Form, Input, DatePicker, Button, Card, Row, Col, List, Tag, Select, Menu, Checkbox, Dropdown  } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LocalEvent from "@/app/classes/LocalEvent";
import AccountIcon from "../components/accounticon";

dayjs.extend(utc);
dayjs.extend(timezone);

const easternTimeZone = 'America/New_York';


const { Item } = Form;

const CreateEventPage: React.FC = () => {

const router = useRouter();
// const [user] = useAuthState(auth);
const [form] = Form.useForm();
const [eventDate, setEventDate] = useState<dayjs.Dayjs>(dayjs());
const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs());
const [foodItems, setFoodItems] = useState<string[]>([]);
const [currentFoodItem, setCurrentFoodItem] = useState("");
const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);


const options = ['Halal', 'Vegetarian', 'Vegan', 'Gluten Free', 'Nut Free'];

interface MenuClickEvent {
  key: string;
}

const handleMenuClick = (e: MenuClickEvent): void => {
  const value = e.key;
  setSelectedFoodType((prev: string[]) =>
    prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value]
  );
};

// const menu = (
//   <Menu>
//     {options.map((item) => (
//       <Menu.Item key={item} onClick={handleMenuClick}>
//         <Checkbox checked={selectedFoodType.includes(item)}>{item}</Checkbox>
//       </Menu.Item>
//     ))}
//   </Menu>
// );

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

    var eventData: LocalEvent = {
      title: values.title,
      location: values.location,
      area: values.area,
      start: eventDate.toDate(), //Need to change this to be a Date Object e.g. new Date()
      end: endDate.toDate(), //Need to change this to be a Date Object e.g. new Date()
      food_type: selectedFoodType,
      user: user.uid,
      date: new Date(),
      description: values.description,
      food_provider: foodItems,
    };
    const docRef = await addDoc(collection(db, "events"), eventData);
    console.log("Document written with ID: ", docRef.id);

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
  <div className={styles.container}/>
  <Link href="/">
    <Logo />
  </Link>
  <Link href="/profile">
    <AccountIcon />
  </Link>
  <div style={{ padding: '24px' }}>
    <Row gutter={24}>
      <Col span={12}>
        <Card title="Event Details" className={styles.card}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input the event title!' }]}
            >
              <Input placeholder="Enter event title" />
            </Item>

            <Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input the event description!' }]}
            >
              <Input placeholder="Enter description" />
            </Item>

            <Item
              label="Area"
              name="area"
              rules={[{ required: true, message: 'Please input the event area!' }]}
            >
              <Select placeholder="Select a campus">
                <Select.Option value="West Campus">West Campus</Select.Option>
                <Select.Option value="East Campus">East Campus</Select.Option>
                <Select.Option value="Central Campus">Central Campus</Select.Option>
              </Select>
            </Item>

            <Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please input the event location!' }]}
            >
              <Input placeholder="Enter event location" />
            </Item>

            <Row gutter={16}>
              <Col span={12}>
              <Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: 'Please select the start date!' }]}
              >
                <DatePicker 
                onChange={(date) => {
                  if (date) {
                    const easternDate = dayjs(date).tz(easternTimeZone);
                    console.log('Start date in ET:', easternDate.format('YYYY-MM-DD hh:mm A'));
                    setEventDate(easternDate);
                  }
                }} 
                style={{ width: '100%' }} 
                showTime={{ format: 'hh:mm A',
                  use12Hours: true,
                 }}
                format="MMMM DD, YYYY hh:mm A"
                />
              </Item>
              </Col>
              <Col span={12}>
              <Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: 'Please select the end date!' }]}
              >
                <DatePicker
                  onChange={(date) => {
                    if (date) {
                      const easternDate = dayjs(date).tz(easternTimeZone);
                      console.log('End date in ET:', easternDate.format('YYYY-MM-DD hh:mm A'));
                      setEndDate(easternDate);
                    }
                  }}
                  style={{ width: '100%' }}
                  showTime={{
                    format: 'hh:mm A',
                    use12Hours: true,
                  }}
                  format="MMMM DD, YYYY hh:mm A"
                />
              </Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Food Type" className={styles.card}>
          <div style={{ marginBottom: 16 }}/>
          <Dropdown menu={{ items: options.map((item) => ({
            key: item,
            label: (
              <Checkbox
                checked={selectedFoodType.includes(item)}
                onChange={() => handleMenuClick({ key: item })}
              >
                {item}
              </Checkbox>
            ),
          })) }} trigger={['click']}>
            <Button>
              {selectedFoodType.length > 0
                ? selectedFoodType.join(', ')
                : 'Select Food Type'}{' '}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Card>

        <Card>
          <Form form={form} onFinish={onFinish} layout="vertical">
          <Item
            label="Food Provider"
            rules={[{ required: true, message: 'Please input at least one food provider!' }]}
          >
            <div>
              <Input
                placeholder="Enter provider and press Enter"
                value={currentFoodItem}
                onChange={(e) => setCurrentFoodItem(e.target.value)}
                onPressEnter={handleAddFoodProvider}
                style={{ width: 'calc(100% - 80px)', marginRight: 8 }}
              />
              <Button
                type="primary"
                onClick={handleAddFoodProvider}
                disabled={!currentFoodItem.trim()}
              >
                Add
              </Button>
            </div>
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
          </Item>
          </Form>
        </Card>
      </Col>
    </Row>
    <div style={{ marginTop: 24, textAlign: 'center' }}>
      <Button
        type="primary"
        size="large"
        onClick={handleFormSubmit}
        style={{ width: 200 }}
        className={styles.button}
      >
        POST EVENT
      </Button>
    </div>
  </div>
  </>
);
};

export default CreateEventPage;


