"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Home Page</h1>
      <Link href="/eCreate">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Go to Create Event Page
        </button>
      </Link>
    </div>
  );
}