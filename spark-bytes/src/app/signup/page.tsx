/**
 * Sign Up Page Component
 * 
 * This component provides a user registration interface that connects to Firebase 
 * Authentication and Firestore. It allows users with Boston University email addresses
 * (@bu.edu) to create new accounts, validates their input, and redirects them to their
 * profile upon successful registration.
 * 
 * The component features:
 * - Email validation (requires @bu.edu domain)
 * - Password input with masking
 * - Error handling for authentication issues
 * - User data storage in Firestore with default attributes
 * 
 * @module pages/signup
 * @requires react
 * @requires react-firebase-hooks/auth
 * @requires firebase/firestore
 * @requires next/navigation
 * @requires antd
 * @requires @/app/firebase/config
 */
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

// Destructure Ant Design components for cleaner usage in JSX
const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

/**
 * SignUp component for user registration
 * 
 * @returns {JSX.Element} The rendered signup form
 */
export default function SignUp() {
  /**
   * State Management
   * ------------------------------
   */
  
  // State for storing the user's email input
  const [email, setEmail] = useState("");
  
  // State for storing the user's password input
  const [password, setPassword] = useState("");
  
  // State for storing custom validation errors
  const [manualError, setManualError] = useState<String>("");
  
  // Next.js router for navigation after successful signup
  const router = useRouter();

  /**
   * Firebase Authentication Hook
   * ------------------------------
   * This hook provides:
   * - createUserWithEmailAndPassword: Function to create a new user
   * - user: The authenticated user object (null if not authenticated)
   * - loading: Boolean indicating if user creation is in progress
   * - error: Any error that occurred during user creation
   */
  const [createUserWithEmailAndPassword, user, loading, error] = 
    useCreateUserWithEmailAndPassword(auth);

  /**
   * Handles the signup form submission
   * 
   * Validates the form inputs, creates a new user in Firebase Authentication,
   * creates a corresponding user document in Firestore, and navigates to the 
   * profile page on success.
   * 
   * @async
   * @function handleSignUp
   * @returns {Promise<void>}
   */
  async function handleSignUp() {
    // Clear any previous error messages
    setManualError("");
    
    // Validate that both email and password are provided
    if (!email || !password) {
      setManualError("Please provide both email and password");
      return;
    }
    
    // Validate that the email ends with @bu.edu domain
    if (!email.endsWith("@bu.edu")) {
      setManualError("Please use a @bu.edu email address");
      return;
    }
    
    try {
      // Attempt to create user with Firebase Authentication
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      
      // Exit if user creation failed (res will be undefined/null)
      if (!res) return;
      
      /**
       * Create a new user document in Firestore with default fields:
       * - email: User's email address
       * - uid: User's unique identifier from Firebase Auth
       * - first_name, last_name: Empty strings to be filled later
       * - staff, organizer, admin: Boolean flags for user roles (default: false)
       * - phone: Empty string to be filled later
       * - phone_notification, email_notification: Notification preferences (default: false)
       */
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
      
      // Display success message
      message.success("Account created successfully!");
      
      // Clear form fields
      setEmail("");
      setPassword("");
      
      // Redirect to profile page if user was created successfully
      if (user != null || res.user) {
        router.push("/profile");
        return;
      };
    } catch (err) {
      // Log and display any errors that occur during signup
      console.log(err);
      message.error("Failed to create account");
    }
  }
  
  /**
   * Component Render
   * ------------------------------
   */
  return (
    // Full-height layout with light gray background
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Centered content container */}
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Sign up card with shadow and rounded corners */}
        <Card
          style={{
            width: 400,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "24px"
          }}
        >
          {/* Card header with title and description */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Create Account</Title>
            <Paragraph type="secondary">Enter your details to get started</Paragraph>
          </div>
          
          {/* Signup form */}
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
            
            {/* Sign up button with loading indicator while registration is in progress */}
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
          
          {/* Firebase authentication error message display */}
          {error && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {"Invalid email or password"}
            </div>
          )}

          {/* Custom validation error message display */}
          {manualError && (
            <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}>
              {manualError}
            </div>
          )}
          
          {/* Login link for users who already have an account */}
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