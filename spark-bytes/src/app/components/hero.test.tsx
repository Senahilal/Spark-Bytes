// hero.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from './hero';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, style }: any) => (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      style={style}
      data-testid="next-image"
    />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

// Mock logo component
jest.mock('./logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock account icon component
jest.mock('./accounticon', () => ({
  __esModule: true,
  default: () => <div data-testid="account-icon">Account Icon</div>,
}));

// Mock button component
jest.mock('./button', () => ({
  __esModule: true,
  default: ({ children, href }: any) => (
    <a href={href} data-testid="button">
      {children}
    </a>
  ),
}));

// Mock Firebase hooks
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock Firebase config
jest.mock("@/app/firebase/config", () => ({
  auth: {},
  db: {},
}));

describe('Hero Component', () => {
  const mockUser = { uid: 'test-user-123' };
  
  // Mocked user data for different roles
  const mockUserData = {
    admin: { admin: true, organizer: false },
    organizer: { admin: false, organizer: true },
    both: { admin: true, organizer: true },
    regular: { admin: false, organizer: false },
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Default: no user logged in
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([null, false, null]);
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the hero section with logo and account icon', () => {
    render(<Hero />);
    
    // Check if logo is rendered
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    
    // Check if account icon is rendered and linked to profile
    const accountIcon = screen.getByTestId('account-icon');
    expect(accountIcon).toBeInTheDocument();
    expect(accountIcon.closest('a')).toHaveAttribute('href', '/profile');
    
    // Check if initial background image is rendered
    const images = screen.getAllByTestId('next-image');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('src', '/cds.jpg');
    
    // Check if title and description are rendered
    expect(screen.getByText('Free Food, Zero Waste')).toBeInTheDocument();
    expect(screen.getByText('Find, Share, and Enjoy Extra Food on Campus!')).toBeInTheDocument();
    
    // Check if "Find Free Food Now" button is rendered
    const findFoodButton = screen.getByText('Find Free Food Now');
    expect(findFoodButton).toBeInTheDocument();
    expect(findFoodButton.closest('a')).toHaveAttribute('href', '/EventListing');
    
    // "Post an Event" button should not be visible without user being organizer
    expect(screen.queryByText('Post an Event')).not.toBeInTheDocument();
    
    // Admin button should not be visible
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('shows image slider with navigation dots', () => {
    render(<Hero />);
    
    // Check if slider indicators (dots) are present
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots.length).toBe(5); // There should be 5 images in the slider
    
    // Check if first dot is active
    expect(dots[0]).toHaveStyle('background: rgb(255, 255, 255)');
    
    // Click on the third dot
    fireEvent.click(dots[2]);
    
    // Third dot should be active and related image should be shown
    expect(dots[2]).toHaveStyle('background: rgb(255, 255, 255)');
    
    const images = screen.getAllByTestId('next-image');
    expect(images[0]).toHaveAttribute('src', '/comm.jpg');
  });

  it('automatically advances the slider after interval', () => {
    render(<Hero />);
    
    // Initially the first image should be shown
    const initialImages = screen.getAllByTestId('next-image');
    expect(initialImages[0]).toHaveAttribute('src', '/cds.jpg');
    
    // Advance timer by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Now the second image should be shown
    const updatedImages = screen.getAllByTestId('next-image');
    expect(updatedImages[0]).toHaveAttribute('src', '/cas.jpg');
    
    // Advance timer by another 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Now the third image should be shown
    const thirdImages = screen.getAllByTestId('next-image');
    expect(thirdImages[0]).toHaveAttribute('src', '/comm.jpg');
  });

  it('shows admin button for admin users', async () => {
    // Mock authenticated user with admin role
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([mockUser, false, null]);
    
    const { getDoc, doc } = require("firebase/firestore");
    doc.mockReturnValue('user-doc-ref');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockUserData.admin
    });
    
    await act(async () => {
      render(<Hero />);
    });
    
    // Admin button should be visible
    const adminButton = screen.getByText('Admin');
    expect(adminButton).toBeInTheDocument();
    expect(adminButton.closest('a')).toHaveAttribute('href', '/admin');
    
    // Post an Event button should not be visible (user is admin but not organizer)
    expect(screen.queryByText('Post an Event')).not.toBeInTheDocument();
  });

  it('shows Post Event button for organizer users', async () => {
    // Mock authenticated user with organizer role
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([mockUser, false, null]);
    
    const { getDoc, doc } = require("firebase/firestore");
    doc.mockReturnValue('user-doc-ref');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockUserData.organizer
    });
    
    await act(async () => {
      render(<Hero />);
    });
    
    // Admin button should not be visible
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    
    // Post an Event button should be visible
    const postEventButton = screen.getByText('Post an Event');
    expect(postEventButton).toBeInTheDocument();
    expect(postEventButton.closest('a')).toHaveAttribute('href', '/create');
  });

  it('shows both admin and post event buttons for users with both roles', async () => {
    // Mock authenticated user with both admin and organizer roles
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([mockUser, false, null]);
    
    const { getDoc, doc } = require("firebase/firestore");
    doc.mockReturnValue('user-doc-ref');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockUserData.both
    });
    
    await act(async () => {
      render(<Hero />);
    });
    
    // Admin button should be visible
    const adminButton = screen.getByText('Admin');
    expect(adminButton).toBeInTheDocument();
    expect(adminButton.closest('a')).toHaveAttribute('href', '/admin');
    
    // Post an Event button should be visible
    const postEventButton = screen.getByText('Post an Event');
    expect(postEventButton).toBeInTheDocument();
    expect(postEventButton.closest('a')).toHaveAttribute('href', '/create');
  });

  it('handles case when user document does not exist', async () => {
    // Mock authenticated user with no document
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([mockUser, false, null]);
    
    const { getDoc, doc } = require("firebase/firestore");
    doc.mockReturnValue('user-doc-ref');
    getDoc.mockResolvedValue({
      exists: () => false,
      data: () => null
    });
    
    await act(async () => {
      render(<Hero />);
    });
    
    // Admin button should not be visible
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    
    // Post an Event button should not be visible
    expect(screen.queryByText('Post an Event')).not.toBeInTheDocument();
    
    // Regular UI elements should still be visible
    expect(screen.getByText('Find Free Food Now')).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    const { unmount } = render(<Hero />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});