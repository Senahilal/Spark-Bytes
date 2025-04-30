// ImageSearch.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageSearch from './ImageSearch';

// Mock fetch API
global.fetch = jest.fn();

describe('ImageSearch Component', () => {
  const mockOnImageSelect = jest.fn();
  
  // Sample data for mocking API responses
  const mockUnsplashData = {
    results: [
      {
        id: '1',
        urls: {
          regular: 'https://example.com/image1.jpg',
          thumb: 'https://example.com/thumb1.jpg',
          small: 'https://example.com/small1.jpg',
        },
        alt_description: 'Sample image 1',
      },
      {
        id: '2',
        urls: {
          regular: 'https://example.com/image2.jpg',
          thumb: 'https://example.com/thumb2.jpg',
          small: 'https://example.com/small2.jpg',
        },
        alt_description: 'Sample image 2',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the insert image button', () => {
    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    expect(screen.getByText('Insert image')).toBeInTheDocument();
  });

  it('opens the modal when the insert image button is clicked', () => {
    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Modal is initially closed
    expect(screen.queryByText('Search images')).not.toBeInTheDocument();
    
    // Click the insert image button
    fireEvent.click(screen.getByText('Insert image'));
    
    // Modal should now be open
    expect(screen.getByText('Search images')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for images')).toBeInTheDocument();
  });

  it('closes the modal when the cancel button is clicked', () => {
    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Insert image'));
    expect(screen.getByText('Search images')).toBeInTheDocument();
    
    // Find and click the cancel button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Modal should be closed
    expect(screen.queryByText('Search images')).not.toBeInTheDocument();
  });

  it('shows empty state when no search has been performed', () => {
    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Insert image'));
    
    // Should show the empty state message
    expect(screen.getByText('Enter a search term to find images.')).toBeInTheDocument();
  });

  it('shows loading state when searching', async () => {
    // Mock fetch to return a delayed promise
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(mockUnsplashData)
          });
        }, 100);
      })
    );

    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Insert image'));
    
    // Perform a search
    const searchInput = screen.getByPlaceholderText('Search for images');
    fireEvent.change(searchInput, { target: { value: 'nature' } });
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    // Should show loading spinner
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.queryByRole('img', { name: /loading/i })).not.toBeInTheDocument();
    });
  });

  it('performs a search and displays results', async () => {
    // Mock fetch to return sample data
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUnsplashData)
    });

    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Insert image'));
    
    // Perform a search
    const searchInput = screen.getByPlaceholderText('Search for images');
    fireEvent.change(searchInput, { target: { value: 'nature' } });
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/unsplash-search?query=${encodeURIComponent('nature')}&per_page=30`
    );
    
    // Wait for results to display
    await waitFor(() => {
      expect(screen.getByAltText('Sample image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Sample image 2')).toBeInTheDocument();
    });
  });

  it('selects an image when clicked', async () => {
    // Mock fetch to return sample data
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUnsplashData)
    });

    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open modal and perform search
    fireEvent.click(screen.getByText('Insert image'));
    const searchInput = screen.getByPlaceholderText('Search for images');
    fireEvent.change(searchInput, { target: { value: 'nature' } });
    fireEvent.click(screen.getByText('Search'));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByAltText('Sample image 1')).toBeInTheDocument();
    });
    
    // Click on first image
    fireEvent.click(screen.getByAltText('Sample image 1'));
    
    // Verify onImageSelect was called with correct URL
    expect(mockOnImageSelect).toHaveBeenCalledWith('https://example.com/image1.jpg');
    
    // Modal should close after selection
    expect(screen.queryByText('Search images')).not.toBeInTheDocument();
  });

  it('shows no results message when search returns empty', async () => {
    // Mock fetch to return empty results
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] })
    });

    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open modal and perform search
    fireEvent.click(screen.getByText('Insert image'));
    const searchInput = screen.getByPlaceholderText('Search for images');
    fireEvent.change(searchInput, { target: { value: 'nonexistentimage' } });
    fireEvent.click(screen.getByText('Search'));
    
    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText('No images found. Try a different search term.')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open modal and perform search
    fireEvent.click(screen.getByText('Insert image'));
    const searchInput = screen.getByPlaceholderText('Search for images');
    fireEvent.change(searchInput, { target: { value: 'nature' } });
    fireEvent.click(screen.getByText('Search'));
    
    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error searching images:', expect.any(Error));
    });
    
    // Clean up spy
    consoleSpy.mockRestore();
  });

  it('does not search if search term is empty', async () => {
    render(<ImageSearch onImageSelect={mockOnImageSelect} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Insert image'));
    
    // Try to search with empty input
    fireEvent.click(screen.getByText('Search'));
    
    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });
});