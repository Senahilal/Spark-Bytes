"use client"

import React, { useState } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import { Button, Tag, Modal } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface ReqCardProps {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  status: string;
  date: string;
  time: string;
}

const ReqCard = ({
  id,
  user_id,
  user_name,
  message,
  status,
  date,
  time
}: ReqCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleDecision = async (decision: "accepted" | "rejected") => {
    try {
      await updateDoc(doc(db, "requests", id), {
        status: decision
      });

      if (decision === "accepted") {
        await updateDoc(doc(db, "users", user_id), {
          organizer: true
        });
      }

      await updateDoc(doc(db, "users", user_id), {
        request_pending: false
      });

      setCurrentStatus(decision);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  return (
    <>
      {/* Summary Card */}
      <div
        onClick={() => setIsModalVisible(true)}
        style={{
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backgroundColor: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Request from {user_name}</h3>
          <Tag color={
            currentStatus === "accepted" ? "success" :
              currentStatus === "rejected" ? "error" : "processing"
          }>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdCalendarToday size={16} />
          <span>{date} @ {time}</span>
        </div>
      </div>

      {/* Modal for request details - showing accept/reject buttons*/}
      <Modal
        title={`Organizer Request - ${user_name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="reject" 
            danger 
            onClick={() => handleDecision("rejected")}
            disabled={status === "accepted" || status === "rejected"}>
            Reject
          </Button>,
          <Button
            key="accept"
            type="primary"
            style={{ backgroundColor: "#2E7D32" }}
            onClick={() => handleDecision("accepted")}
            disabled={status === "accepted" || status === "rejected"}
          >
            Accept
          </Button>,
        ]}
      >
        <p style={{ fontWeight: 500, marginBottom: 4 }}>Submitted on:</p>
        <p style={{ marginBottom: 16 }}>{date} at {time}</p>

        <p style={{ fontWeight: 500, marginBottom: 4 }}>Message:</p>
        <p>{message}</p>
      </Modal>
    </>
  );
};

export default ReqCard;
