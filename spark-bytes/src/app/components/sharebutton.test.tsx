// sharebutton.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShareButton from './sharebutton';

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdShare: () => <span data-testid="share-icon">Share Icon</span>,
}));

// Mock window.location
const originalLocation = window.location;

describe('ShareButton Component', () => {
  const mockProps = {
    title: 'Test Share Title',
    text: 'Test share text for social media',
    url: 'https://example.com/share-url',
  };

  // Mock console methods
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const mockConsoleLog = jest.fn();
  const mockConsoleError = jest.fn();

  beforeEach(() => {
    // Delete navigator.share and navigator.clipboard for clean testing
    // @ts-ignore: Temporary property deletion for testing
    delete navigator.share;
    // @ts-ignore: Temporary property deletion for testing
    delete navigator.clipboard;

    // Mock console methods
    console.log = mockConsoleLog;
    console.error = mockConsoleError;

    // Mock window.alert
    window.alert = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('renders the share button with icon', () => {
    render(<ShareButton {...mockProps} />);
    
    // Check if share icon is rendered
    const shareIcon = screen.getByTestId('share-icon');
    expect(shareIcon).toBeInTheDocument();
    
    // Check if the share button is clickable (cursor pointer)
    const shareButton = shareIcon.closest('div');
    expect(shareButton).toHaveStyle('cursor: pointer');
  });

  it('uses default URL when no URL is provided', async () => {
    // Set up window.location.href mock
    // @ts-ignore: Testing override
    delete window.location;
    window.location = { ...originalLocation, href: 'https://example.com/default-page' };
    
    // Mock the navigator.share API
    const mockShare = jest.fn().mockResolvedValue(undefined);
    // @ts-ignore: Mock implementation
    navigator.share = mockShare;

    // Render without URL prop
    const { title, text } = mockProps;
    render(<ShareButton title={title} text={text} />);
    
    // Click the share button
    const shareButton = screen.getByTestId('share-icon').closest('div');
    fireEvent.click(shareButton!);
    
    // Check if navigator.share was called with correct parameters
    expect(mockShare).toHaveBeenCalledWith({
      title,
      text,
      url: 'https://example.com/default-page'
    });
  });

  afterAll(() => {
    // Restore window.location
    window.location = originalLocation;
  });
});