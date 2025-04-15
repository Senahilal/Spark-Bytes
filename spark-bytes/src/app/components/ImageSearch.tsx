"use client";
import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Spin, Empty, Typography, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Define types for the component props and image data
interface ImageSearchProps {
  onImageSelect: (imageUrl: string) => void;
  apiKey?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
    small: string;
  };
  alt_description: string;
}

export default function ImageSearch({ 
  onImageSelect, 
  apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY 
}: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle the image search
  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    
    setSearchQuery(value);
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(value)}&per_page=30`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (image: UnsplashImage) => {
    onImageSelect(image.urls.regular);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button 
        icon={<SearchOutlined />} 
        onClick={() => setIsModalOpen(true)}
      >
        Insert image
      </Button>

      <Modal
        title="Search images"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Input.Search
          placeholder="Search for images"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : searchResults.length > 0 ? (
          <Row gutter={[16, 16]}>
            {searchResults.map(image => (
              <Col key={image.id} xs={12} sm={8} md={6}>
                <div 
                  onClick={() => handleImageSelect(image)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s'
                  }}
                  className="image-item-hover"
                >
                  <img 
                    src={image.urls.thumb} 
                    alt={image.alt_description || 'Image'} 
                    style={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : searchQuery ? (
          <Empty description="No images found. Try a different search term." />
        ) : (
          <Empty description="Enter a search term to find images." />
        )}

        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12 }}>
          Images provided by Unsplash. Please respect copyright and usage rights.
        </Typography.Text>
      </Modal>

      <style jsx global>{`
        .image-item-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
} 

// EXAMPLE FOR HOW TO CALL THE COMPONENT FOR EVENT CREATION OR EDITING
/**
"use client";
import ImageSearch from '../components/ImageSearch';

export default function YourComponent() {
  const handleImageSelect = (imageUrl: string) => {
    // Access the selected image URL here to add to the event being created or edited
    console.log(imageUrl);
  };
  
  return (
    <div>
      <ImageSearch onImageSelect={handleImageSelect} />
    </div>
  );
}

 */