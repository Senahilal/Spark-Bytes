"use client";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { Form, Input, DatePicker, Button, Card } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';

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

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <Card title="Create Event" style={{ marginBottom: '20px' }}>
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
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                POST
            </Button>
            </Item>
        </Form>
        </Card>
    </div>
  );
};

export default CreateEventPage;


