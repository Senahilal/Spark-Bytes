import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Tag, Row, Col, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
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
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);

    // Disable dates before today - for start date date picker
    const disablePastDates = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    // Disable end dates before selected start date
    const disableInvalidEndDates = (current: Dayjs): boolean => {
        if (!current) return false;
        const today = dayjs().startOf('day');
        if (!startDate) return current.isBefore(today);

        return current.isBefore(today) || current.isBefore(startDate.startOf('day'));
    };


    // Disable end time before selected start time
    const getDisabledEndTime = (): {
        disabledHours?: () => number[];
        disabledMinutes?: (hour: number) => number[];
    } => {
        if (!startDate) return {};

        const isToday = (date: Dayjs) => date.isSame(startDate, 'day');

        return {
            disabledHours: () => {
                const now = form.getFieldValue('endDate');
                if (!now || !isToday(now)) return [];
                const startHour = startDate.hour();
                return Array.from({ length: 24 }, (_, h) => h).filter(h => h < startHour);
            },
            disabledMinutes: (selectedHour) => {
                const now = form.getFieldValue('endDate');
                if (!now || !isToday(now)) return [];
                const startHour = startDate.hour();
                const startMinute = startDate.minute();
                return selectedHour === startHour
                    ? Array.from({ length: 60 }, (_, m) => m).filter(m => m < startMinute)
                    : [];
            }
        };
    };






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
            width={720}
            centered
            closeIcon={null}
            styles={{
                body: { padding: 0, borderRadius: '12px', overflow: 'hidden', minHeight: '90vh', }
            }}
            style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
            <div style={{ backgroundColor: '#036D19', padding: '20px 28px' }}>
                <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>Edit Event</h2>
            </div>

            <div style={{ padding: '40px 28px' }}>
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        {/* Left column */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                                <Input placeholder="Enter event title" />
                            </Form.Item>

                            <Form.Item label="Description" name="description">
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

                            <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
                                <DatePicker
                                    showTime={{ format: "hh:mm A", use12Hours: true }}
                                    format="MMMM DD, YYYY hh:mm A"
                                    style={{ width: '100%' }}
                                    disabledDate={disablePastDates} // <- disable past dates
                                    onChange={(date) => setStartDate(date)}// <- track selected start date
                                />
                            </Form.Item>
                            <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
                                <DatePicker
                                    showTime={{ format: "hh:mm A", use12Hours: true }}
                                    format="MMMM DD, YYYY hh:mm A"
                                    style={{ width: '100%' }}
                                    disabledDate={disableInvalidEndDates}
                                    disabledTime={getDisabledEndTime}
                                />

                            </Form.Item>


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
                        marginTop: 40,
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
