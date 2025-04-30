// closeButton.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CloseButton from './closeButton';

describe('CloseButton Component', () => {
  // Test 1: Basic rendering with default props
  it('renders the button with default label', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    
    const buttonElement = screen.getByText('Close');
    expect(buttonElement).toBeInTheDocument();
  });

  // Test 2: Rendering with custom label
  it('renders the button with custom label', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} label="Cancel" />);
    
    const buttonElement = screen.getByText('Cancel');
    expect(buttonElement).toBeInTheDocument();
  });

  // Test 3: Test onClick handler
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    
    const buttonElement = screen.getByText('Close');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });

  // Test 4: Test applying custom className
  it('applies custom className when provided', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} className="custom-class" />);
    
    const buttonElement = screen.getByText('Close');
    expect(buttonElement).toHaveClass('custom-class');
  });

  // Test 5: Test applying custom style
  it('applies custom style when provided', () => {
    const handleClick = jest.fn();
    const customStyle = { marginTop: '10px', width: '200px' };
    
    render(<CloseButton onClick={handleClick} style={customStyle} />);
    
    const buttonElement = screen.getByText('Close');
    expect(buttonElement).toHaveStyle('margin-top: 10px');
    expect(buttonElement).toHaveStyle('width: 200px');
    
    // Also check that default styles are still applied
    expect(buttonElement).toHaveStyle('background-color: #036D19');
    expect(buttonElement).toHaveStyle('color: white');
  });

  // Test 6: Test mouseOver event
  it('changes background color on mouse over', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    
    const buttonElement = screen.getByText('Close');
    
    // Initial background color
    expect(buttonElement).toHaveStyle('background-color: #036D19');
    
    // Trigger mouse over
    fireEvent.mouseOver(buttonElement);
    
    // Check if background color changed
    expect(buttonElement).toHaveStyle('background-color: #025414');
  });

  // Test 7: Test mouseOut event
  it('reverts background color on mouse out', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    
    const buttonElement = screen.getByText('Close');
    
    // Trigger mouse over first
    fireEvent.mouseOver(buttonElement);
    expect(buttonElement).toHaveStyle('background-color: #025414');
    
    // Then trigger mouse out
    fireEvent.mouseOut(buttonElement);
    
    // Check if background color reverted
    expect(buttonElement).toHaveStyle('background-color: #036D19');
  });
  
  // Test 8: Test event object is passed to onClick handler
  it('passes the event object to onClick handler', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    
    const buttonElement = screen.getByText('Close');
    fireEvent.click(buttonElement);
    
    // Check that the first argument to handleClick is a mouse event
    expect(handleClick.mock.calls[0][0]).toHaveProperty('target');
    expect(handleClick.mock.calls[0][0].type).toBe('click');
  });
});