"use client";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from './CreateEventPage.module.css';

import { Form, Input, DatePicker, Button, Card, Row, Col, List, Tag } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

const { Item } = Form;

const CreateEventPage: React.FC = () => {

const router = useRouter();
// const [user] = useAuthState(auth);
const [form] = Form.useForm();
const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(null);
const [foodItems, setFoodItems] = useState<string[]>([]);
const [currentFoodItem, setCurrentFoodItem] = useState("");

const onDateChange: DatePickerProps['onChange'] = (date) => {
setEventDate(date);
};

// const onFinish = (values: any) => {
//   console.log('Received values of form: ', values);
// // Handle form submission here
// };

//Used coPilot to help with the form submission
const handleFormSubmit = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    const values = form.getFieldsValue();
    const eventData = {
      title: values.title,
      location: values.location,
      start_date: eventDate ? eventDate.toISOString() : null,
      end_date: values.endDate ? values.endDate.toISOString() : null,
      foodItems: values.foodItems,
      userId: user.uid,
      createdAt: new Date().toISOString(),

    };

    const docRef = await addDoc(collection(db, "events"), eventData);
    console.log("Document written with ID: ", docRef.id);

    router.push("/"); // Navigate to dashboard after successful submission
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const handleAddFoodItem = () => {
  if (currentFoodItem.trim()) {
    setFoodItems([...foodItems, currentFoodItem.trim()]);
    setCurrentFoodItem("");
  }
};

const handleRemoveFoodItem = (index: number) => {
  const newItems = [...foodItems];
  newItems.splice(index, 1);
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
                onChange={(date) => setEventDate(date)} 
                style={{ width: '100%' }} 
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
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
                onChange={(date) => console.log('End date selected:', date)} 
                style={{ width: '100%' }} 
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                />
              </Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Food Items" className={styles.card}>
          <div style={{ marginBottom: 16 }}>
            <Input
              value={currentFoodItem}
              onChange={(e) => setCurrentFoodItem(e.target.value)}
              placeholder="Enter food item"
              onPressEnter={handleAddFoodItem}
              style={{ width: 'calc(100% - 80px)', marginRight: 8 }}
            />
            <Button 
              onClick={handleAddFoodItem} 
              type="primary"
              disabled={!currentFoodItem.trim()}
            >
              Add
            </Button>
          </div>

          <List
            size="small"
            bordered
            dataSource={foodItems}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    danger 
                    onClick={() => handleRemoveFoodItem(index)}
                  >
                    Remove
                  </Button>
                ]}
              >
                <Tag color="geekblue">{item}</Tag>
              </List.Item>
            )}
            locale={{ emptyText: 'No food items added yet' }}
          />
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


