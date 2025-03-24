"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { Button, Card, Typography, Layout, Avatar, Divider, message, Space } from "antd";
import { UserOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function Account() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  
  useEffect(() => {
    // If user is not logged in and not in loading state, redirect to login
    if (!loading && !user) {
      router.push("/login");
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
              
              {user.displayName && (
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Display Name
                  </Text>
                  <Text strong>{user.displayName}</Text>
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