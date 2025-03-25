"use client";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from './CreateEventPage.module.css';

import { Form, Input, DatePicker, Button, Card } from 'antd';
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

const onDateChange: DatePickerProps['onChange'] = (date) => {
setEventDate(date);
};

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
// Handle form submission here
};

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
      date: eventDate ? eventDate.toISOString() : null,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "events"), eventData);
    console.log("Document written with ID: ", docRef.id);

    router.push("/dashboard"); // Navigate to dashboard after successful submission
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

  return (
    <>
    <div  className={styles.container}>
    </div>
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <Card title="Create Event" style={{ marginBottom: '20px' }} className={styles.card}>
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

            <Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select the event date!' }]}
            >
            <DatePicker onChange={onDateChange} style={{ width: '100%' }} />
            </Item>

            <Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              className={styles.button}
              onClick={handleFormSubmit}
            >
              POST
            </Button>
            </Item>
        </Form>
        </Card>
    </div>
    </>
  );
};

export default CreateEventPage;


