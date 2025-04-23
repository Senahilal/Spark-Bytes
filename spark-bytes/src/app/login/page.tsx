"use client";
import React from "react";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { Input, Button, Card, Typography, Layout, Form, message, Divider, Checkbox } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const [signInWithEmailAndPassword, user, loading, error] = 
    useSignInWithEmailAndPassword(auth);

  async function handleLogin() {
    if (!email || !password) {
      message.error("Please provide both email and password");
      return;
    }
    
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({res});
      // message.success("Logged in successfully!");
      setEmail("");
      setPassword("");
      // Redirect to account page
      router.push("/profile");
    } catch (err) {
      console.log(err);
      message.error("Failed to log in");
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
            <Title level={2} style={{ marginBottom: 8 }}>Welcome Back</Title>
            <Paragraph type="secondary">Log in to your account</Paragraph>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <a href="/forgot-password" style={{ fontSize: 14, color: "#036D19" }}>
                  Forgot password?
                </a>
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleLogin}
                loading={loading}
                style={{ backgroundColor: "#036D19", borderColor: "#036D19" }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
          
          {error && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {error.message}
            </div>
          )}
          
          <div style={{ textAlign: "center" }}>
            <Text>
              Don't have an account? <a href="/signup" style={{color: "#036D19"}}>Sign up</a>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}