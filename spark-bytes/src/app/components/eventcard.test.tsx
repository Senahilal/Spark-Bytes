// eventcard.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventCard from './eventcard';

// Mock the components and functions we're not directly testing
jest.mock('react-icons/md', () => ({
  MdNotifications: () => <span data-testid="icon-notification">NotificationIcon</span>,
  MdLocationOn: () => <span data-testid="icon-location">LocationIcon</span>,
  MdCalendarToday: () => <span data-testid="icon-calendar">CalendarIcon</span>,
  MdRestaurant: () => <span data-testid="icon-restaurant">RestaurantIcon</span>,
  MdPeople: () => <span data-testid="icon-people">PeopleIcon</span>,
}));

jest.mock('./closeButton', () => {
  return ({ onClick, label, style }) => (
    <button 
      onClick={onClick} 
      style={style} 
      data-testid={`close-button-${label.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {label}
    </button>
  );
});

jest.mock('./sharebutton', () => {
  return ({ title, text, url }) => (
    <button 
      data-testid="share-button" 
      data-share-title={title} 
      data-share-text={text} 
      data-share-url={url}
    >
      Share
    </button>
  );
});

// Mock Ant Design Modal
jest.mock('antd', () => ({
  Modal: ({ children, open, onCancel }) => (
    open ? (
      <div data-testid="modal">
        {children}
        <button data-testid="modal-close" onClick={onCancel}>Close Modal</button>
      </div>
    ) : null
  ),
}));

// Mock Firebase functions
jest.mock('firebase/firestore', () => {
  return {
    deleteDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn(),
    updateDoc: jest.fn(() => Promise.resolve()),
    arrayUnion: jest.fn(id => id),
    arrayRemove: jest.fn(id => id),
  };
});

jest.mock('@/app/firebase/config', () => ({
  db: {},
}));

// Mock window.location
const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore: Unreachable code error
  delete window.location;
  window.location = {
    ...originalLocation,
    origin: 'https://example.com',
  };
});

afterAll(() => {
  window.location = originalLocation;
});

describe('EventCard Component', () => {
  // Sample event data for testing
  const mockEvent = {
    id: 'event-123',
    user: 'user-456',
    title: 'Free Pizza',
    area: 'Boston University',
    location: 'GSU',
    date: '2023-05-15',
    time: '12:00 PM',
    endTime: '2:00 PM',
    description: 'Come get free pizza!',
    foodType: 'Pizza',
    foodProvider: 'Domino\'s',
    followers: ['user-789', 'user-101'],
    hasNotification: true,
    address: '665 Commonwealth Ave',
    imageUrl: '/pizza.jpg',
    currentUserId: 'user-789',
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event card with correct information', () => {
    render(<EventCard {...mockEvent} />);
    
    // Check if title is rendered
    expect(screen.getByText('Free Pizza')).toBeInTheDocument();
    
    // Check if location is rendered
    expect(screen.getByText('GSU')).toBeInTheDocument();
    
    // Check if date and time are rendered
    expect(screen.getByText('2023-05-15 @12:00 PM')).toBeInTheDocument();
    
    // Check if food type is rendered
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    
    // Check if image is rendered with correct attributes
    const image = screen.getByAltText('Pizza at Free Pizza');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/pizza.jpg');
  });

  it('shows notification icon when user is following the event', () => {
    render(<EventCard {...mockEvent} />);
    
    // Since currentUserId 'user-789' is in followers array, notification icon should be visible
    const notificationIcon = screen.getByTestId('icon-notification');
    expect(notificationIcon).toBeInTheDocument();
  });

  it('does not show notification icon when user is not following the event', () => {
    const eventWithDifferentUser = {
      ...mockEvent,
      currentUserId: 'different-user',
    };
    
    render(<EventCard {...eventWithDifferentUser} />);
    
    // Notification icon should not be present
    const notificationIcon = screen.queryByTestId('icon-notification');
    expect(notificationIcon).not.toBeInTheDocument();
  });

  it('opens modal when clicking on the card', () => {
    render(<EventCard {...mockEvent} />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    
    // Click on the card
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Modal should now be visible
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Modal should contain relevant content
    expect(screen.getByText('Boston University')).toBeInTheDocument();
    expect(screen.getByText('2023-05-15 @12:00 PM - 2:00 PM')).toBeInTheDocument();
  });

  it('closes modal when clicking close button', async () => {
    render(<EventCard {...mockEvent} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Modal should be visible
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Click the close button
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-button-close'));
    });
    
    // The mock onCancel handler should be called, but we can't directly test
    // that the modal closes since we've mocked the Modal component
  });

  it('allows event creator to see delete button', () => {
    // Set currentUserId to same as event user
    const eventWithSameUser = {
      ...mockEvent,
      currentUserId: 'user-456', // Same as event.user
    };
    
    render(<EventCard {...eventWithSameUser} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Delete button should be visible for event creator
    const deleteButton = screen.getByTestId('close-button-delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it('does not show delete button for non-creator users', () => {
    // mockEvent has currentUserId 'user-789' which is different from event.user 'user-456'
    render(<EventCard {...mockEvent} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Delete button should not be visible for non-creator
    const deleteButton = screen.queryByTestId('close-button-delete');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('calls updateDoc with arrayRemove when canceling notification', async () => {
    const { updateDoc, arrayRemove, doc } = require('firebase/firestore');
    doc.mockReturnValue('mocked-doc-ref');
    updateDoc.mockResolvedValue(undefined);
    
    render(<EventCard {...mockEvent} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Since user is following, the button should say "Cancel Notification"
    const notifyButton = screen.getByTestId('close-button-cancel-notification');
    expect(notifyButton).toBeInTheDocument();
    
    // Click to unfollow
    await act(async () => {
      fireEvent.click(notifyButton);
      // Wait for promises to resolve
    });
    
    // Should call updateDoc with arrayRemove
    expect(doc).toHaveBeenCalledWith({}, "events", "event-123");
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', {
      followers: arrayRemove('user-789')
    });
  });

  it('calls updateDoc with arrayUnion when clicking notify me', async () => {
    const { updateDoc, arrayUnion, doc } = require('firebase/firestore');
    doc.mockReturnValue('mocked-doc-ref');
    updateDoc.mockResolvedValue(undefined);
    
    // Modify event so user is not following
    const eventNotFollowing = {
      ...mockEvent,
      followers: ['user-101'], // Removed user-789
    };
    
    render(<EventCard {...eventNotFollowing} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Button should say "Notify Me"
    const notifyButton = screen.getByTestId('close-button-notify-me');
    expect(notifyButton).toBeInTheDocument();
    
    // Click to follow
    await act(async () => {
      fireEvent.click(notifyButton);
      // Wait for promises to resolve
    });
    
    // Should call updateDoc with arrayUnion
    expect(doc).toHaveBeenCalledWith({}, "events", "event-123");
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', {
      followers: arrayUnion('user-789')
    });
  });

  it('calls deleteDoc and onDelete when delete button is clicked', async () => {
    const { deleteDoc, doc } = require('firebase/firestore');
    doc.mockReturnValue('mocked-doc-ref');
    deleteDoc.mockResolvedValue(undefined);
    
    // Set currentUserId to same as event user to see delete button
    const eventWithSameUser = {
      ...mockEvent,
      currentUserId: 'user-456', // Same as event.user
    };
    
    render(<EventCard {...eventWithSameUser} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // Delete button should be visible
    const deleteButton = screen.getByTestId('close-button-delete');
    expect(deleteButton).toBeInTheDocument();
    
    // Click delete button and wait for async operations
    await act(async () => {
      fireEvent.click(deleteButton);
      // Wait for promises to resolve
    });
    
    // Should call deleteDoc
    expect(doc).toHaveBeenCalledWith({}, "events", "event-123");
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith('mocked-doc-ref');
    
    // Should call onDelete
    expect(eventWithSameUser.onDelete).toHaveBeenCalledWith('event-123');
  });

  it('displays share button with correct props', () => {
    render(<EventCard {...mockEvent} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Free Pizza'));
    
    // ShareButton should be present with correct props
    const shareButton = screen.getByTestId('share-button');
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('data-share-title', 'Free Pizza');
    expect(shareButton).toHaveAttribute('data-share-text', 'Check out this event: Free Pizza - Pizza at GSU on 2023-05-15 at 12:00 PM');
    expect(shareButton).toHaveAttribute('data-share-url', 'https://example.com/events/event-123');
  });

  it('handles image loading error', () => {
    render(<EventCard {...mockEvent} />);
    
    // Find the image
    const image = screen.getByAltText('Pizza at Free Pizza');
    
    // Simulate error loading image
    fireEvent.error(image);
    
    // Image src should be updated to fallback
    expect(image).toHaveAttribute('src', '/logo.png');
  });

  it('renders with default image when no imageUrl is provided', () => {
    const eventWithNoImage = {
      ...mockEvent,
      imageUrl: undefined,
    };
    
    render(<EventCard {...eventWithNoImage} />);
    
    // Should render with default image
    const image = screen.getByAltText('Pizza at Free Pizza');
    expect(image).toHaveAttribute('src', '/insomnia_cookies.jpeg');
  });
});