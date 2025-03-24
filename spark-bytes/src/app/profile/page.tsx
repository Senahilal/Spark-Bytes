'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../../components/Footer";
import { Form, Input, Button, Row, Col, Typography, Switch, Space } from "antd";
import ProfileImagePlaceholder from "../../../public/profile_placeholder.jpg";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { fetchUserData, updateUserData } from "@/app/firebase/repository";
import { signOut } from "firebase/auth";
import { message } from "antd";

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [user, loading] = useAuthState(auth);

    const router = useRouter();

    //redirect to login if not logged in
    //if logged in fetch user data and display
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchData(user);
        }
    }, [user, loading, router]);


    const handleSignOut = async () => {
        try {
            await signOut(auth); // 1. Firebase sign out
            localStorage.removeItem("user"); // 2. Optional: clear local storage (if you set it)
            message.success("Signed out successfully"); // 3. Show confirmation
            router.push("/login"); // 4. Redirect to login
        } catch (error) {
            console.error("Sign out error:", error);
            message.error("Failed to sign out");
        }
    };




    //fetch user data
    const fetchData = async (user: any) => {
        try {
            const userDoc = await fetchUserData(user);
            if (userDoc) {
                setFirstName(userDoc.first_name || "");
                setLastName(userDoc.last_name || "");
                setPhoneNumber(userDoc.phone || "");
                setEmail(userDoc.email || "");
                setSmsNotifications(userDoc.phone_notification || false);
                setEmailNotifications(userDoc.email_notification || false);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    //update user data
    const handleSaveChanges = async () => {
        if (!user) return;

        const updatedData = {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            email: email,
        };

        try {
            await updateUserData(user, updatedData);
            console.log("User data updated successfully.");
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    //handle sms switch
    const handleSMSToggle = async (checked: boolean) => {
        setSmsNotifications(checked);
        if (user) {
            await updateUserData(user, { phone_notification: checked });
        }
    };

    //handle email switch
    const handleEmailToggle = async (checked: boolean) => {
        setEmailNotifications(checked);
        if (user) {
            await updateUserData(user, { email_notification: checked });
        }
    };


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
                        onClick={async () => {
                            if (isEditing) {
                                await handleSaveChanges();
                            }
                            setIsEditing((prev) => !prev);
                        }}
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
                                onChange={handleSMSToggle}
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
                                onChange={handleEmailToggle}
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
