"use client";
import React from "react";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { Input, Button, Card, Typography, Layout, Form, message, Divider } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] = 
    useCreateUserWithEmailAndPassword(auth);

  const router = useRouter();

  const [manualError, setManualError] = useState<String>("");

  async function handleSignUp() {
    if (!email || !password) {
      setManualError("Please provide both email and password");
      return;
    }
    // prevent non @bu.edu emails
    if (!email.endsWith("@bu.edu")) {
      setManualError("Please use a @bu.edu email address");
      return;
    }
    
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      // create user in firestore
      if (!res) return;
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        uid: res.user.uid,
        first_name: "",
        last_name: "",
        staff: false,
        phone: "",
        phone_notification: false,
        email_notification: false,
        organizer: false,
        admin: false,
      });
      

      message.success("Account created successfully!");
      setEmail("");
      setPassword("");
      router.push("/profile");
    } catch (err) {
      console.log(err);
      message.error("Failed to create account");
    }
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
            <Title level={2} style={{ marginBottom: 8 }}>Create Account</Title>
            <Paragraph type="secondary">Enter your details to get started</Paragraph>
          </div>
          
          <Form layout="vertical">
            <Form.Item>
              <Input
                size="large"
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            
            <Form.Item>
              <Input.Password
                size="large"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSignUp}
                loading={loading}
                style={{ backgroundColor: "#036D19", borderColor: "#036D19" }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          
          {error && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {error.message}
            </div>
          )}

          {manualError && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {manualError}
            </div>
          )}
          
          
          <div style={{ textAlign: "center" }}>
            <Text>
              Already have an account? <a href="/login" style={{color: "#036D19"}}>Log in</a>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}