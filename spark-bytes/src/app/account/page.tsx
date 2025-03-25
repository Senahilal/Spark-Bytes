"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { Button, Card, Typography, Layout, Avatar, Divider, message, Space } from "antd";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { fetchUserData } from "../firebase/repository";
import { create } from "domain";


const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function Account() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  console.log({user, loading, error});

  // user data
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [staff, setStaff] = useState(false);
  const [phone_notification, setPhoneNotification] = useState(false);
  const [email_notification, setEmailNotification] = useState(false);


  async function fetchData(user: any) {
    try {
      const userDoc = await fetchUserData(user);
      if (userDoc) {
        console.log("User data:", userDoc);
        setEmail(userDoc.email);
        setFirstName(userDoc.first_name);
        setLastName(userDoc.last_name);
        setPhone(userDoc.phone);
        setStaff(userDoc.staff);
        setPhoneNotification(userDoc.phone_notification);
        setEmailNotification(userDoc.email_notification);

      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };



  useEffect(() => {
    // If user is not logged in and not in loading state, redirect to login
    if (!loading && !user) {
      router.push("/login");
    }

    else if (user) {
      // Fetch user data from Firestore if user is logged in
      fetchData(user);
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    try {
      await signOut(auth);
      message.success("Signed out successfully");
      router.push("/login");
    } catch (err) {
      console.error(err);
      message.error("Failed to sign out");
    }
  }
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>Loading...</div>
        </Content>
      </Layout>
    );
  }
  
  // If no user and not loading, the useEffect will handle redirect
  if (!user) {
    return null;
  }
  
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card
          style={{
            width: 400,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "24px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
            />
            <Title level={2} style={{ marginBottom: 8 }}>My Account</Title>
            <Paragraph type="secondary">Manage your account information</Paragraph>
          </div>
          
          <Divider />
          
          <div style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  Email Address
                </Text>
                <Text strong>{user.email}</Text>
              </div>
              
              {user && (
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    First Name
                  </Text>
                  <Text strong>{first_name}</Text>

                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Last Name
                  </Text>
                  <Text strong>{last_name}</Text>

                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Phone
                  </Text>
                  <Text strong>{phone}</Text>

                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Staff
                  </Text>
                  <Text strong>{staff ? "Yes" : "No"}</Text>

                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Phone Notification
                  </Text>
                  <Text strong>{phone_notification ? "Yes" : "No"}</Text>

                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Email Notification
                  </Text>
                  <Text strong>{email_notification ? "Yes" : "No"}</Text>
                </div>
              )}
            </Space>
          </div>
          
          <Divider />
          
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              danger
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
          
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Text>
              <a href="/">Return to Home</a>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}