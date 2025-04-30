"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Form, Input, DatePicker, Button, Card, Row, Col, Tag, Space, Select } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const easternTimeZone = "America/New_York";

const EventEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [availability, setAvailability] = useState<string>("Available"); 

  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id"); // Get the event ID from the query parameters

  useEffect(() => {
    // Redirect to login if not logged in
    if (!loadingUser && !user) {
      router.push("/login");
    }
  }, [user, loadingUser, router]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !user) return;

      try {
        const eventRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          const eventData = eventDoc.data();

          // Ensure the user is the organizer of the event
          if (eventData.user !== user.uid) {
            router.push("/profile");
            return;
          }

          // Prefill the form with event data
          if (!loadingEvent && eventId && user) {
            form.setFieldsValue({
              title: eventData.title,
              description: eventData.description,
              location: eventData.location,
              area: eventData.area,
              startDate: dayjs(eventData.start.toDate()).tz(easternTimeZone),
                endDate: dayjs(eventData.end.toDate()).tz(easternTimeZone), 
            });
          }

          setEventDate(dayjs(eventData.start.toDate()).tz(easternTimeZone));
          setEndDate(dayjs(eventData.end.toDate()).tz(easternTimeZone));
          setFoodItems(eventData.food_provider || []);
          setSelectedFoodType(eventData.food_type || []);
          setSelectedImageUrl(eventData.imageUrl || "");
        } else {
          console.error("Event not found.");
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/profile");
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [loadingEvent, eventId, user, form, router]);

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      const eventRef = doc(db, "events", eventId!);

      await updateDoc(eventRef, {
        title: values.title,
        description: values.description,
        location: values.location,
        area: values.area,
        start: values.startDate?.toDate(), // Save start date
        end: values.endDate?.toDate(),
        food_provider: foodItems,
        food_type: selectedFoodType,
        imageUrl: selectedImageUrl,
        availability: availability,
        last_updated_by: user?.uid,
        updated_at: new Date(),
      });

      console.log("Event updated successfully.");
      router.push("/profile"); // Redirect to "My Events" page
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCancel = () => {
    router.push("/profile"); // Redirect to "My Events" page
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

  if (loadingEvent || loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Form form={form} layout="vertical">
        <Row gutter={[24, 24]}>
          {/* Left column - Event Details */}
          <Col xs={24} md={12}>
            <Card title="Event Details" style={{ marginBottom: 20 }}>
              <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please input the event title!" }]}>
                <Input placeholder="Enter event title" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the event description!" }]}>
                <Input placeholder="Enter description" />
              </Form.Item>

              <Form.Item label="Area" name="area" rules={[{ required: true, message: "Please input the event area!" }]}>
                <Select placeholder="Select a campus">
                  <Select.Option value="West Campus">West Campus</Select.Option>
                  <Select.Option value="East Campus">East Campus</Select.Option>
                  <Select.Option value="Central Campus">Central Campus</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please input the event location!" }]}>
                <Input placeholder="Enter event location" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: "Please select the start date!" }]}>
                    <DatePicker
                            style={{ width: "100%" }}
                            showTime={{ format: "hh:mm A", use12Hours: true }}
                            format="MMMM DD, YYYY hh:mm A"
                        />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: "Please select the end date!" }]}>
                    <DatePicker
                            style={{ width: "100%" }}
                            showTime={{ format: "hh:mm A", use12Hours: true }}
                            format="MMMM DD, YYYY hh:mm A"
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
            <Card title="Availability" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <Button
                type={availability === "Available" ? "primary" : "default"}
                onClick={() => setAvailability("high")}
                style={{ backgroundColor: "green" }}
                >
                Available
                </Button>
                <Button
                type={availability === "Few" ? "primary" : "default"}
                onClick={() => setAvailability("medium")}
                style={{ backgroundColor: "orange" }}
                >
                Few
                </Button>
                <Button
                type={availability === "None" ? "primary" : "default"}
                onClick={() => setAvailability("none")}
                style={{ backgroundColor: "red" }}
                >
                None
                </Button>
            </div>
            </Card>
          </Col>
        </Row>

        {/* Form action buttons */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button danger size="large" style={{ width: 200 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" size="large" style={{ width: 200 }} onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EventEditPage;