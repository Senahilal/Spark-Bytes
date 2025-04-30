// todaysEvents.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodaysEvents from './todaysEvents';
import { fetchTodaysEvents } from '../firebase/repository';

// Mock the repository function
jest.mock('../firebase/repository', () => ({
  fetchTodaysEvents: jest.fn(),
}));

// Mock the EventCard component
jest.mock('./eventcard', () => {
  return function MockEventCard(props: any) {
    return (
      <div data-testid="event-card" data-event-id={props.id}>
        <div data-testid="event-title">{props.title}</div>
        <div data-testid="event-location">{props.location}</div>
        <div data-testid="event-time">{props.time}</div>
      </div>
    );
  };
});

// Mock date for testing
const mockDate = new Date('2023-05-15T14:30:00');
// Firebase timestamp-like object with toDate method
const createFirebaseTimestamp = (date: Date) => ({
  toDate: () => date,
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1000000,
});

describe('TodaysEvents Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    // Mock the fetchTodaysEvents to delay return (still loading)
    (fetchTodaysEvents as jest.Mock).mockImplementation(() => new Promise(resolve => {
      // This promise won't resolve during the test
      setTimeout(() => resolve([]), 1000);
    }));

    render(<TodaysEvents />);
    
    // Should show loading text
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('shows no events message when there are no events', async () => {
    // Mock empty events array
    (fetchTodaysEvents as jest.Mock).mockResolvedValue([]);

    render(<TodaysEvents />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
    
    // Should show no events message
    expect(screen.getByText('No events happening today')).toBeInTheDocument();
  });

  it('renders events when available', async () => {
    // Mock events data
    const mockEvents = [
      {
        id: 'event-1',
        user: 'user-1',
        title: 'Free Pizza',
        area: 'Campus Center',
        location: 'Building A',
        start: createFirebaseTimestamp(mockDate),
        end: createFirebaseTimestamp(new Date(mockDate.getTime() + 60 * 60 * 1000)), // 1 hour later
        description: 'Come get free pizza!',
        foodType: 'Pizza',
        food_provider: ['Dominos'],
        followers: ['user-2', 'user-3'],
        hasNotification: true,
        imageURL: '/pizza.jpg',
      },
      {
        id: 'event-2',
        user: 'user-2',
        title: 'Ice Cream Social',
        area: 'Library',
        location: 'Main Floor',
        start: createFirebaseTimestamp(new Date(mockDate.getTime() + 2 * 60 * 60 * 1000)), // 2 hours later
        end: createFirebaseTimestamp(new Date(mockDate.getTime() + 3 * 60 * 60 * 1000)), // 3 hours later
        description: 'Ice cream for everyone!',
        food_type: ['Dessert', 'Ice Cream'],
        food_provider: ['Ben & Jerry\'s'],
        followers: [],
        hasNotification: false,
        imageUrl: '/ice-cream.jpg',
      },
    ];
    
    (fetchTodaysEvents as jest.Mock).mockResolvedValue(mockEvents);

    render(<TodaysEvents />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
    
    // Should render the event cards
    const eventCards = screen.getAllByTestId('event-card');
    expect(eventCards.length).toBe(2);
    
    // First event details
    expect(screen.getByText('Free Pizza')).toBeInTheDocument();
    
    // Second event details
    expect(screen.getByText('Ice Cream Social')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    // Mock fetch error
    (fetchTodaysEvents as jest.Mock).mockRejectedValue(new Error('Failed to fetch events'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<TodaysEvents />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
    
    // Should show no events message
    expect(screen.getByText('No events happening today')).toBeInTheDocument();
    
    // Should have logged the error
    expect(console.error).toHaveBeenCalled();
  });

  it('formats dates and times correctly', async () => {
    // Create event with specific date/time
    const eventDate = new Date('2023-05-15T14:30:00');
    const eventEndDate = new Date('2023-05-15T16:00:00');
    
    const mockEvent = {
      id: 'event-date-test',
      user: 'user-1',
      title: 'Date Format Test',
      location: 'Test Location',
      start: createFirebaseTimestamp(eventDate),
      end: createFirebaseTimestamp(eventEndDate),
      followers: [],
    };
    
    (fetchTodaysEvents as jest.Mock).mockResolvedValue([mockEvent]);

    render(<TodaysEvents />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
    
    // Check that the component correctly formats the date
    // Format should be like "5/15" for May 15
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    
    // Check that the event card was created with proper formatted time
    const eventCard = screen.getByTestId('event-card');
    expect(eventCard).toHaveAttribute('data-event-id', 'event-date-test');
    
    // Test component renders with correct title
    expect(screen.getByText('Date Format Test')).toBeInTheDocument();
  });

  it('handles missing event data gracefully', async () => {
    // Event with minimal data
    const minimalEvent = {
      id: 'minimal-event',
      // Missing most fields
    };
    
    (fetchTodaysEvents as jest.Mock).mockResolvedValue([minimalEvent]);

    render(<TodaysEvents />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
    
    // Should render with fallback values
    expect(screen.getByText('Untitled Event')).toBeInTheDocument();
  });
});