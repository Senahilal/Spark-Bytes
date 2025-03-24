'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../../components/Footer";
import { Form, Input, Button, Row, Col, Typography, Switch, Space } from "antd";
import ProfileImagePlaceholder from "../../../public/profile_placeholder.jpg";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const handleSignOut = () => {
        // TODO
    };

    //TODO: redirect to login if not logged in

    //TODO: fetch data

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#E3F4C9", padding: "24px" }}>
                <div
                    style={{
                        maxWidth: "1024px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Space>
                        <Image
                            src={ProfileImagePlaceholder}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            style={{ borderRadius: "50%" }}
                        />
                        <div>
                            <Text strong style={{ fontSize: "18px" }}>
                                {firstName || "Name"} {lastName || "Last Name"}
                            </Text>
                            <br />
                            <Text type="secondary">{email || "example@bu.edu"}</Text>
                        </div>
                    </Space>

                    <Button
                        type="primary"
                        style={{ backgroundColor: "#2E7D32" }}
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                </div>
            </div>

            {/* Main Form */}
            <div style={{ flex: 1, padding: "40px 24px" }}>
                <Form
                    layout="vertical"
                    style={{ maxWidth: "1024px", margin: "0 auto" }}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item label="First Name">
                                <Input
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    size="large"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Last Name">
                                <Input
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    size="large"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Phone Number">
                                <Input
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    size="large"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Email Address">
                                <Input
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    size="large"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: "48px" }}>
                        <Title level={4}>Notification Preferences</Title>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid #d9d9d9",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text>Enable SMS Notifications</Text>
                            <Switch
                                checked={smsNotifications}
                                onChange={(checked) => setSmsNotifications(checked)}
                                style={{ backgroundColor: smsNotifications ? "#2E7D32" : undefined }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid #d9d9d9",
                                padding: "12px 16px",
                                borderRadius: "8px",
                            }}
                        >
                            <Text>Enable Email Notifications</Text>
                            <Switch
                                checked={emailNotifications}
                                onChange={(checked) => setEmailNotifications(checked)}
                                style={{ backgroundColor: emailNotifications ? "#2E7D32" : undefined }}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: "center", marginTop: "48px" }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{ backgroundColor: "#2E7D32", padding: "10px 32px" }}
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </div>
                </Form>
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;
