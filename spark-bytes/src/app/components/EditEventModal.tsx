import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Tag, Row, Col, Card } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/config';
import { updateEvent } from "@/app/firebase/repository";


dayjs.extend(utc);
dayjs.extend(timezone);

const easternTimeZone = 'America/New_York';

interface EditEventModalProps {
    eventId: string;
    visible: boolean;
    onClose: () => void;
    onEventUpdated?: (updatedEvent: any) => void; // <- notify parent to update the specific card
}

const EditEventModal: React.FC<EditEventModalProps> = ({ eventId, visible, onClose, onEventUpdated }) => {
    const [form] = Form.useForm();
    const [foodItems, setFoodItems] = useState<string[]>([]);
    const [availability, setAvailability] = useState<string>('high');

    useEffect(() => {
        if (!eventId || !visible) return;

        const fetchEvent = async () => {
            const ref = doc(db, 'events', eventId);
            const snap = await getDoc(ref);
            const data = snap.data();
            if (data) {
                form.setFieldsValue({
                    title: data.title,
                    description: data.description,
                    location: data.location,
                    area: data.area,
                    startDate: dayjs(data.start.toDate()).tz(easternTimeZone),
                    endDate: dayjs(data.end.toDate()).tz(easternTimeZone),
                    availability: data.availability || 'high',
                    foodProviderInput: '',
                });
                setFoodItems(data.foodProvider || []);
                setAvailability(data.availability || 'high');
            }
        };

        fetchEvent();
    }, [eventId, visible, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            // Save updated fields
            await updateEvent(eventId, {
                title: values.title,
                description: values.description,
                area: values.area,
                location: values.location,
                start: values.startDate.toDate(),
                end: values.endDate.toDate(),
                food_provider: foodItems,
                availability: values.availability,
                last_updated_by: currentUser.uid,
                last_updated_at: new Date()
            });

            // Refetch updated event
            const updatedDoc = await getDoc(doc(db, "events", eventId));
            if (!updatedDoc.exists()) {
                console.error("Updated event not found.");
                return;
            }

            const updatedEvent = {
                id: eventId,
                ...updatedDoc.data()
            };

            // Notify parent to update this event in state
            if (onEventUpdated) {
                onEventUpdated(updatedEvent);
            }

            onClose(); // Close modal
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };


    const handleAddFoodProvider = () => {
        const current = form.getFieldValue('foodProviderInput') || '';
        if (current.trim()) {
            setFoodItems([...foodItems, current.trim()]);
            form.setFieldsValue({ foodProviderInput: '' });
        }
    };

    const handleRemoveFoodProvider = (index: number) => {
        const updated = [...foodItems];
        updated.splice(index, 1);
        setFoodItems(updated);
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={650}
            centered
            closeIcon={null}
            styles={{
                body: { padding: 0, borderRadius: '12px', overflow: 'hidden' }
            }}
            style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
            <div style={{ backgroundColor: '#036D19', padding: '20px 28px' }}>
                <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>Edit Event</h2>
            </div>

            <div style={{ padding: '32px 28px' }}>
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        {/* Left column */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                                <Input placeholder="Enter event title" />
                            </Form.Item>

                            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                                <Input placeholder="Enter description" />
                            </Form.Item>

                            <Form.Item label="Area" name="area" rules={[{ required: true }]}>
                                <Select placeholder="Select area">
                                    <Select.Option value="West Campus">West Campus</Select.Option>
                                    <Select.Option value="East Campus">East Campus</Select.Option>
                                    <Select.Option value="Central Campus">Central Campus</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Location" name="location" rules={[{ required: true }]}>
                                <Input placeholder="Enter location" />
                            </Form.Item>
                        </Col>

                        {/* Right column */}
                        <Col xs={24} md={12}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
                                        <DatePicker
                                            showTime={{ format: "hh:mm A", use12Hours: true }}
                                            format="MMMM DD, YYYY hh:mm A"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
                                        <DatePicker
                                            showTime={{ format: "hh:mm A", use12Hours: true }}
                                            format="MMMM DD, YYYY hh:mm A"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Food Provider" name="foodProviderInput">
                                <Input.Search
                                    placeholder="Enter provider and press Add"
                                    enterButton="Add"
                                    onSearch={handleAddFoodProvider}
                                />
                            </Form.Item>

                            {/* Food Provider Tags */}
                            <div style={{ marginBottom: 20 }}>
                                {foodItems.map((item, index) => (
                                    <Tag key={index} closable onClose={() => handleRemoveFoodProvider(index)} color="green">
                                        {item}
                                    </Tag>
                                ))}
                            </div>

                            {/* Availability Buttons */}
                            <Form.Item label="Availability" name="availability">
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                }}>
                                    {[
                                        { value: 'high', label: 'High', color: 'green' },
                                        { value: 'medium', label: 'Medium', color: 'orange' },
                                        { value: 'low', label: 'Low', color: 'red' },
                                        { value: 'none', label: 'None', color: '#aaa' }
                                    ].map(({ value, label, color }) => (
                                        <Button
                                            key={value}
                                            type={availability === value ? 'primary' : 'default'}
                                            onClick={() => {
                                                setAvailability(value);
                                                form.setFieldsValue({ availability: value });
                                            }}
                                            style={{
                                                borderColor: color,
                                                backgroundColor: availability === value ? color : '#fff',
                                                color: availability === value ? '#fff' : color,
                                                fontWeight: 600
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{
                        marginTop: 32,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px'
                    }}>
                        <Button onClick={onClose} size="large" style={{ width: 200 }}>
                            Cancel
                        </Button>
                        <Button type="primary" size="large" style={{ width: 200, backgroundColor: '#036D19' }} onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>

    );
};

export default EditEventModal;
