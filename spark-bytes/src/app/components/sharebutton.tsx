import React from 'react';
import { MdShare } from 'react-icons/md';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}
// This component is used to share content 

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if the browser supports the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url || window.location.href
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Failed to copy link. Please try again.');
      }
    }
  };

  return (
    <div onClick={handleShare} style={{ cursor: 'pointer' }}>
      <MdShare size={24} color="white" />
    </div>
  );
};

export default ShareButton;