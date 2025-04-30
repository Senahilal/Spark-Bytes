// reqcard.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReqCard from './reqcard';

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdCalendarToday: () => <span data-testid="calendar-icon">Calendar</span>,
}));

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => 'mocked-doc-ref'),
  updateDoc: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/app/firebase/config', () => ({
  db: {},
}));

// Mock antd components
jest.mock('antd', () => {
  const Original = jest.requireActual('antd');
  return {
    ...Original,
    Modal: ({ title, open, onCancel, footer, children }) => (
      open ? (
        <div data-testid="modal">
          <h2 data-testid="modal-title">{title}</h2>
          <div data-testid="modal-content">{children}</div>
          <div data-testid="modal-footer">
            {Array.isArray(footer) && footer.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <button data-testid="modal-close" onClick={onCancel}>Close</button>
        </div>
      ) : null
    ),
    Button: (props) => {
      // Extract properties we need without using 'key'
      const { children, onClick, danger, disabled, type, style } = props;
      // Use the button text as a data-testid to identify it
      const buttonText = typeof children === 'string' ? children.toLowerCase() : 'button';
      return (
        <button 
          onClick={onClick} 
          disabled={disabled}
          data-testid={`button-${buttonText}`}
          data-danger={danger ? 'true' : 'false'}
          data-type={type || 'default'}
          style={style}
        >
          {children}
        </button>
      );
    },
    Tag: ({ children, color }) => (
      <span data-testid="status-tag" data-color={color}>
        {children}
      </span>
    )
  };
});

describe('ReqCard Component', () => {
  const mockProps = {
    id: 'req-123',
    user_id: 'user-456',
    user_name: 'John Doe',
    message: 'I would like to become an organizer to share events.',
    status: 'pending',
    date: '2023-05-15',
    time: '14:30'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the request card with correct information', () => {
    render(<ReqCard {...mockProps} />);
    
    // Check if user name is displayed
    expect(screen.getByText(`Request from ${mockProps.user_name}`)).toBeInTheDocument();
    
    // Check if date and time are displayed
    expect(screen.getByText(`${mockProps.date} @ ${mockProps.time}`)).toBeInTheDocument();
    
    // Check if status tag is displayed with correct status
    const statusTag = screen.getByTestId('status-tag');
    expect(statusTag).toHaveTextContent('Pending');
    expect(statusTag).toHaveAttribute('data-color', 'processing');
    
    // Check if calendar icon is present
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('opens modal when clicking on the card', () => {
    render(<ReqCard {...mockProps} />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    
    // Click on the card
    fireEvent.click(screen.getByText(`Request from ${mockProps.user_name}`));
    
    // Modal should now be visible
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Check modal title
    expect(screen.getByTestId('modal-title')).toHaveTextContent(`Organizer Request - ${mockProps.user_name}`);
    
    // Check modal content
    expect(screen.getByText('Submitted on:')).toBeInTheDocument();
    expect(screen.getByText(`${mockProps.date} at ${mockProps.time}`)).toBeInTheDocument();
    expect(screen.getByText('Message:')).toBeInTheDocument();
    expect(screen.getByText(mockProps.message)).toBeInTheDocument();
  });

  it('closes modal when clicking close button', () => {
    render(<ReqCard {...mockProps} />);
    
    // Open modal
    fireEvent.click(screen.getByText(`Request from ${mockProps.user_name}`));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Click close button
    fireEvent.click(screen.getByTestId('modal-close'));
    
    // Modal should be closed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders footer buttons in the modal', () => {
    render(<ReqCard {...mockProps} />);
    
    // Open modal
    fireEvent.click(screen.getByText(`Request from ${mockProps.user_name}`));
    
    // Modal should be visible
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Check if footer contains buttons
    const modalFooter = screen.getByTestId('modal-footer');
    expect(modalFooter).toBeInTheDocument();
    
    // Verify button text
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('renders correctly with a custom message', () => {
    const customMessage = "This is a custom request message for testing purposes.";
    render(<ReqCard {...mockProps} message={customMessage} />);
    
    // Open modal
    fireEvent.click(screen.getByText(`Request from ${mockProps.user_name}`));
    
    // Custom message should be displayed in modal
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});