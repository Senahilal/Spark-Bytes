import React from "react";
import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        backgroundColor: "#E3F4C9", // ✅ light green like in Figma
        textAlign: "center",
        padding: "20px 0",
        height: "60px",
        borderTop: "1px solid #d9d9d9",
      }}
    >
      <Text style={{ color: "#4B5563", fontSize: "14px" }}>
        (footer)
      </Text>
    </AntFooter>
  );
};

export default Footer;
