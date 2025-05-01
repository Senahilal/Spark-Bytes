/**
 * ImageSearch Component
 * 
 * A client-side component that allows users to search for and select images from Unsplash.
 * This component displays a button that opens a modal with search functionality.
 * Users can search for images and select one, which is then passed to the parent component
 * via the onImageSelect callback.
 * 
 * @component
 * @example
 * // Basic usage:
 * <ImageSearch onImageSelect={(url) => setSelectedImage(url)} />
 */
"use client";

import React, { useState } from "react";
import { Button, Input, Modal, Spin, Empty, Typography, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/**
 * Props for the ImageSearch component
 * 
 * @interface ImageSearchProps
 * @property {Function} onImageSelect - Callback function that receives the selected image URL
 */
interface ImageSearchProps {
  onImageSelect: (imageUrl: string) => void;
}

/**
 * Interface representing an Unsplash image object returned from the API
 * 
 * @interface UnsplashImage
 * @property {string} id - Unique identifier for the image
 * @property {Object} urls - Object containing different sized URLs for the image
 * @property {string} urls.regular - Standard resolution image URL
 * @property {string} urls.thumb - Thumbnail image URL
 * @property {string} urls.small - Small image URL
 * @property {string} alt_description - Accessibility description of the image
 */
interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
    small: string;
  };
  alt_description: string;
}

/**
 * ImageSearch component implementation
 * 
 * @param {ImageSearchProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function ImageSearch({ onImageSelect }: ImageSearchProps) {
  // State for managing the search query input
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for storing the search results from Unsplash
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  
  // State for tracking loading status during API requests
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for controlling the visibility of the search modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**
   * Handles the image search process
   * 
   * Makes an API request to the backend Unsplash search endpoint with the provided search term.
   * Updates the component state with the search results or error state.
   * 
   * @param {string} value - The search query entered by the user
   * @returns {Promise<void>}
   */
  const handleSearch = async (value: string) => {
    // Don't proceed if the search value is empty
    if (!value.trim()) return;
    
    // Update search query state and set loading state to true
    setSearchQuery(value);
    setLoading(true);

    try {
      // Make API request to the backend Unsplash search endpoint
      const response = await fetch(
        `/api/unsplash-search?query=${encodeURIComponent(value)}&per_page=30`
      );
      
      // Handle non-successful responses
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      
      // Parse response data and update search results state
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      // Log errors to the console
      console.error("Error searching images:", error);
    } finally {
      // Always turn off loading state when done, regardless of success or failure
      setLoading(false);
    }
  };

  /**
   * Handles the image selection process
   * 
   * Called when a user clicks on an image in the search results.
   * Passes the selected image URL to the parent component via the onImageSelect callback
   * and closes the modal.
   * 
   * @param {UnsplashImage} image - The selected image object
   */
  const handleImageSelect = (image: UnsplashImage) => {
    // Call the callback function with the regular-sized image URL
    onImageSelect(image.urls.regular);
    // Close the modal after selection
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button to open the image search modal */}
      <Button icon={<SearchOutlined />} onClick={() => setIsModalOpen(true)}>
        Insert image
      </Button>

      {/* Modal containing the image search interface */}
      <Modal
        title="Search images"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // No footer buttons needed
        width={800} // Wider modal for better image grid display
      >
        {/* Search input field */}
        <Input.Search
          placeholder="Search for images"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />

        {/* Conditional rendering based on loading and search result states */}
        {loading ? (
          // Loading spinner when search is in progress
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : searchResults.length > 0 ? (
          // Grid layout for search results when images are found
          <Row gutter={[16, 16]}>
            {searchResults.map((image) => (
              <Col key={image.id} xs={12} sm={8} md={6}>
                <div
                  onClick={() => handleImageSelect(image)}
                  className="image-item-hover"
                  style={{
                    cursor: "pointer",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #f0f0f0",
                    transition: "all 0.3s",
                  }}
                >
                  <img
                    src={image.urls.thumb}
                    alt={image.alt_description || "Image"}
                    style={{ width: "100%", height: 100, objectFit: "cover" }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : searchQuery ? (
          // Empty state when search was performed but no results were found
          <Empty description="No images found. Try a different search term." />
        ) : (
          // Default empty state before any search has been performed
          <Empty description="Enter a search term to find images." />
        )}

        {/* Attribution notice for Unsplash */}
        <Typography.Text
          type="secondary"
          style={{ display: "block", marginTop: 16, fontSize: 12 }}
        >
          Images provided by Unsplash. Please respect copyright and usage rights.
        </Typography.Text>
      </Modal>

      {/* CSS-in-JS styling for image hover effects */}
      <style jsx global>{`
        .image-item-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}