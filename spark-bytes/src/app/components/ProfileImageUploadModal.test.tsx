// ProfileImageUploadModal.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileImageUploadModal from './ProfileImageUploadModal';

// Mock antd components
jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  
  return {
    __esModule: true,
    ...originalModule,
    Modal: ({ 
      title, 
      open, 
      onCancel, 
      onOk, 
      okText, 
      cancelText, 
      okButtonProps, 
      children 
    }) => (
      open ? (
        <div data-testid="mock-modal">
          <div data-testid="modal-title">{title}</div>
          <div data-testid="modal-content">{children}</div>
          <button 
            onClick={onOk} 
            disabled={okButtonProps?.disabled} 
            data-testid="ok-button"
          >
            {okText}
          </button>
          <button onClick={onCancel} data-testid="cancel-button">
            {cancelText}
          </button>
        </div>
      ) : null
    ),
    Button: ({ children, icon, style, onClick }) => (
      <button 
        onClick={onClick} 
        style={style} 
        data-testid="antd-button"
      >
        {icon && <span data-testid="button-icon">{icon}</span>}
        {children}
      </button>
    ),
    Upload: ({ beforeUpload, children, showUploadList, onRemove, accept }) => (
      <div data-testid="upload-component">
        <input 
          type="file" 
          data-testid="file-input" 
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && beforeUpload) {
              beforeUpload(file);
            }
          }}
        />
        {children}
        {showUploadList?.showRemoveIcon && (
          <button 
            data-testid="remove-file-button" 
            onClick={() => onRemove && onRemove()}
          >
            Remove
          </button>
        )}
      </div>
    ),
    message: {
      error: jest.fn(),
    },
  };
});

// Mock icons
jest.mock('@ant-design/icons', () => ({
  UploadOutlined: () => <span data-testid="upload-icon">UploadIcon</span>,
}));

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn();
URL.createObjectURL = mockCreateObjectURL;

describe('ProfileImageUploadModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onUpload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-image-url');
  });

  it('renders the modal when isOpen is true', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Upload Profile Picture');
    expect(screen.getByTestId('upload-component')).toBeInTheDocument();
    expect(screen.getByText('Select Image')).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    render(<ProfileImageUploadModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('cancel-button'));
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('has disabled upload button when no file is selected', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    const uploadButton = screen.getByTestId('ok-button');
    expect(uploadButton).toBeDisabled();
  });

  it('enables the upload button when a file is selected', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Upload button should be enabled
    const uploadButton = screen.getByTestId('ok-button');
    expect(uploadButton).not.toBeDisabled();
  });

  it('shows image preview when a file is selected', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Check if preview is shown
    const previewImage = screen.getByAltText('Preview');
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute('src', 'mock-image-url');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
  });

  it('removes the file when remove button is clicked', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Preview should be visible
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    
    // Click remove button
    fireEvent.click(screen.getByTestId('remove-file-button'));
    
    // Preview should not be visible anymore
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    
    // Upload button should be disabled again
    expect(screen.getByTestId('ok-button')).toBeDisabled();
  });

  it('calls onUpload with file when upload button is clicked', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Click upload button
    fireEvent.click(screen.getByTestId('ok-button'));
    
    // onUpload should be called with the file
    expect(mockProps.onUpload).toHaveBeenCalledTimes(1);
    expect(mockProps.onUpload).toHaveBeenCalledWith(file);
  });

  it('only accepts image files', () => {
    render(<ProfileImageUploadModal {...mockProps} />);
    
    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });
});