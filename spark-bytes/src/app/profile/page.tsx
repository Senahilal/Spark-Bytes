'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import Footer from '../components/footer';
import { Form, Input, Button, Row, Col, Typography, Switch, Space } from "antd";
import ProfileImagePlaceholder from "../../../public/profile_placeholder.jpg";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { fetchUserData, updateUserData } from "@/app/firebase/repository";
import { signOut } from "firebase/auth";
import { message, Tag } from "antd";
import { fetchUserIdEvents } from "@/app/firebase/repository";
import EventCard from '../components/eventcard';
import Logo from '../components/logo';
import dayjs, { Dayjs } from "dayjs";


import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // make sure this import exists

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [requestPending, setRequestPending] = useState(false);

    const [user, loading] = useAuthState(auth);

    const [showMyEvents, setShowMyEvents] = useState(true);
    const [userEvents, setUserEvents] = useState<any[]>([]);

    const [showRequestForm, setShowRequestForm] = useState(false);


    const router = useRouter();

    //redirect to login if not logged in
    //if logged in fetch user data and display
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchData(user);
            fetchUserEvents(user.uid);
        }
    }, [user, loading, router]);


    const handleSignOut = async () => {
        try {
            await signOut(auth); // 1. Firebase sign out
            localStorage.removeItem("user"); // clear local storage
            router.push("/login"); // 4. Redirect to login
        } catch (error) {
            console.error("Sign out error:", error);
            message.error("Failed to sign out");
        }
    };




    //fetch user data
    const fetchData = async (user: any) => {
        try {
            const userDoc = await fetchUserData(user.uid);
            if (userDoc) {
                setFirstName(userDoc.first_name || "");
                setLastName(userDoc.last_name || "");
                setPhoneNumber(userDoc.phone || "");
                setEmail(userDoc.email || "");
                setSmsNotifications(userDoc.phone_notification || false);
                setEmailNotifications(userDoc.email_notification || false);
                setRequestPending(userDoc.request_pending || false);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    //fetch user events
    const fetchUserEvents = async (userId: string) => {
        const events = await fetchUserIdEvents(userId);
        if (events) {
            setUserEvents(events);
        }
    };

    const handleEventDelete = (deletedEventId: string) => {
        setUserEvents(prev => prev.filter(event => event.id !== deletedEventId));
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



    const handleRequestSubmit = async (values: any) => {
        if (!user) return;
        try {
            //saves the document into requests collection
            await addDoc(collection(db, "requests"), {
                user_id: user.uid,
                user_name: `${firstName} ${lastName}`,
                message: values.requestMessage,
                status: "pending",
                created_at: new Date(),
            });

            //Update user's request_pending flag in user document
            await updateUserData(user, { request_pending: true });

            message.success("Request submitted!");
            setShowRequestForm(false);
            setRequestPending(true);
        } catch (err) {
            console.error("Error submitting request:", err);
            message.error("Failed to submit request.");
        }
    };


    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

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

                </div>
            </div>

            {/* Toggle buttons to switch between posts and account information */}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
                <Button
                    type={showMyEvents ? "primary" : "default"}
                    style={{ backgroundColor: showMyEvents ? "#2E7D32" : undefined }}
                    onClick={() => setShowMyEvents(true)}
                >
                    My Events
                </Button>
                <Button
                    type={!showMyEvents ? "primary" : "default"}
                    style={{ backgroundColor: !showMyEvents ? "#2E7D32" : undefined }}
                    onClick={() => setShowMyEvents(false)}
                >
                    Account Info
                </Button>
            </div>

            {/* Horizontal line to separate sections */}
            <hr style={{
                marginTop: '16px',
                marginBottom: '32px',
                border: 'none',
                borderTop: '1px solidrgb(8, 6, 6)', // light grey
                maxWidth: '1024px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }} />


            {showMyEvents ? (
                //USER EVENTS SECTION
                <div style={{
                    display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "10px", minHeight: '60vh',
                    justifyContent: 'center'
                }}>

                    {userEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: "30px" }}>
                            <span style={{ fontSize: '18px', color: '#666' }}>
                                No events posted yet.
                            </span>
                            <br />
                            <Button
                                type="primary"
                                style={{ marginTop: '16px', backgroundColor: "#2E7D32" }}
                                onClick={() => router.push("/create")}
                            >
                                + Post Event
                            </Button>
                        </div>

                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '24px',
                                padding: '0 24px',
                                marginTop: '10px',
                                marginBottom: '40px',
                                minHeight: '60vh',
                            }}
                        >
                            <Button
                                type="primary"
                                style={{ backgroundColor: "#2E7D32" }}
                                onClick={() => router.push("/create")}
                            >
                                + Post Event
                            </Button>
                            {userEvents.map(event => {
                                const start = event.start?.toDate?.();
                                const formattedDate = start ? dayjs(start).format("MM/DD/YYYY") : "Unknown Date";
                                const formattedTime = start ? dayjs(start).format("h:mm A") : "Unknown Time";
                                const end = event.end?.toDate?.();
                                const formattedEndTime = start ? dayjs(end).format("h:mm A") : "Unknown Time";

                                return (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        user={event.user}
                                        title={event.title}
                                        area={event.area}
                                        location={event.location}
                                        date={formattedDate}
                                        time={formattedTime}
                                        endTime={formattedEndTime}
                                        description={event.description}
                                        foodType={event.foodType || event.food_type?.join(", ")}
                                        foodProvider={event.foodProvider}
                                        followers={event.followers}
                                        hasNotification={event.hasNotification}
                                        imageUrl={event.imageURL}
                                        currentUserId={user?.uid}
                                        onDelete={handleEventDelete}
                                    />
                                );
                            })}
                        </div>

                    )}
                </div>
            ) : (

                <div style={{ flex: 1, padding: "40px 24px" }}>
                    {/* Account Info Edit Form */}
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
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                            <Button
                                type="primary"
                                style={{ backgroundColor: "#2E7D32" }}
                                onClick={async () => {
                                    if (isEditing) await handleSaveChanges();
                                    setIsEditing(prev => !prev);
                                }}
                            >
                                {isEditing ? "Save" : "Edit"}
                            </Button>
                        </div>
                    </Form>

                    {/* Notification Preferences */}
                    <div style={{ maxWidth: "1024px", margin: "48px auto 0 auto" }}>
                        <Title level={4}>Notification Preferences</Title>

                        {/* Wont be used*/}
                        {/* <div
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
                        </div> */}

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

                    {/* Request to be Organizer */}
                    <div style={{ maxWidth: "1024px", margin: "48px auto 0 auto" }}>
                        <Title level={4}>
                            Want to be an Organizer?
                        </Title>

                        {requestPending ? (
                            <Tag color="processing" style={{ marginLeft: "30px" }}>Pending Approval</Tag>

                        ) : !showRequestForm ? (
                            <Button
                                type="dashed"
                                onClick={() => setShowRequestForm(true)}
                                style={{ color: "#2E7D32", borderColor: "#2E7D32" }}
                            >
                                Apply to be an Organizer
                            </Button>
                        ) : (
                            <Form layout="vertical" onFinish={handleRequestSubmit}>
                                <Form.Item
                                    label={
                                        <div>
                                            <div>Why do you want to be an organizer?</div>
                                            <div style={{ fontSize: "10px", fontWeight: "normal", fontStyle: "italic" }}>
                                                (Include your BU ID, email, and the organization or club you'll represent.)
                                            </div>
                                        </div>
                                    }
                                    name="requestMessage"
                                    rules={[{ required: true, message: "Please enter your reason." }]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Button danger onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "#2E7D32" }}>
                                        Submit Request
                                    </Button>
                                </div>
                            </Form>
                        )}

                    </div>

                    {/* Sign Out */}
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
                </div>


            )}

            <Footer />
        </div>
    );
};

export default ProfilePage;
