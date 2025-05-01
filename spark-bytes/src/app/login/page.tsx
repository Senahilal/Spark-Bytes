/**
 * Login Page Component
 * 
 * This component provides a user authentication interface using Firebase authentication.
 * It displays a login form with email and password fields, a "remember me" option,
 * error handling, and navigation to related pages (signup, forgot password).
 * 
 * @module pages/login
 * @requires react
 * @requires react-firebase-hooks/auth
 * @requires next/navigation
 * @requires antd
 * @requires @/app/firebase/config
 */
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { Input, Button, Card, Typography, Layout, Form, message, Divider, Checkbox } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";


// Destructure Ant Design components for cleaner usage in JSX
const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

/**
 * Login component for user authentication
 * 
 * @returns {JSX.Element} The rendered login form
 */
export default function Login() {
  /**
   * State Management
   * ------------------------------
   */
  
  // State for storing the user's email input
  const [email, setEmail] = useState("");
  
  // State for storing the user's password input (never persisted)
  const [password, setPassword] = useState("");
  
  // State for the "remember me" checkbox
  const [rememberMe, setRememberMe] = useState(false);
  
  // Next.js router for navigation after successful login
  const router = useRouter();

  /**
   * Firebase Authentication Hook
   * ------------------------------
   * This hook provides:
   * - signInWithEmailAndPassword: Function to attempt authentication
   * - user: The authenticated user object (null if not authenticated)
   * - loading: Boolean indicating if authentication is in progress
   * - error: Any error that occurred during authentication
   */
  const [signInWithEmailAndPassword, user, loading, error] = 
    useSignInWithEmailAndPassword(auth);

  /**
   * Handles the login form submission
   * 
   * Validates form inputs, attempts authentication with Firebase,
   * and navigates to the profile page on success.
   * 
   * @async
   * @function handleLogin
   * @returns {Promise<void>}
   */
  async function handleLogin() {
    // Input validation - both email and password must be provided
    if (!email || !password) {
      message.error("Please provide both email and password");
      return;
    }
    
    try {
      // Attempt to sign in with provided credentials
      const res = await signInWithEmailAndPassword(email, password);
      console.log({res});
      
      // Wait for loading to complete (NOTE: This is a busy wait and may cause issues)
      while (loading) {
        console.log("Loading...");
      }
      
      // Check if authentication was successful and a user was returned
      if (res && res.user != null) {
        // Clear form fields on successful authentication
        setEmail("");
        setPassword("");
        
        // Redirect to profile page
        router.push("/profile");
      };
    } catch (err) {
      // Log and display any errors that occur during login
      console.log(err);
      message.error("Failed to log in");
    }
  }

  /**
   * Remember Me Functionality
   * ------------------------------
   * If enabled, save the email to localStorage for future convenience
   * 
   * Note: This runs on every render when rememberMe is true, which is not ideal.
   * Should be moved to a useEffect or the handleLogin function for better performance.
   */
  if (rememberMe) {
    localStorage.setItem("email", email);
  };
  
  /**
   * Component Render
   * ------------------------------
   */
  return (
    // Full-height layout with light gray background
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Centered content container */}
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Login card with shadow and rounded corners */}
        <Card
          style={{
            width: 400,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "24px"
          }}
        >
          {/* Card header with welcome message */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Welcome Back</Title>
            <Paragraph type="secondary">Log in to your account</Paragraph>
          </div>
          
          {/* Login form */}
          <Form layout="vertical">
            {/* Email input field with mail icon */}
            <Form.Item>
              <Input
                size="large"
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            
            {/* Password input field with lock icon and password masking */}
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
              {/* Row with "Remember me" checkbox and "Forgot password" link */}
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
              
              {/* Login button with loading indicator while authentication is in progress */}
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
          
          {/* Error message display - only shown when there is an authentication error */}
          {error && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {"Invalid email or password"}
            </div>
          )}
          
          {/* Sign up link for users without an account */}
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