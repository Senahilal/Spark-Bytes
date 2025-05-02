/**
 * ProfileImageUploadModal.tsx
 *
 * This component renders a modal for uploading a user profile image.
 * It uses Ant Design's Modal and Upload components.
 *
 * Features:
 * - Displays a modal popup with a button to select an image file
 * - Shows a preview of the selected image in a circular frame
 * - Disables the upload button if no file is selected
 * - Triggers the parent upload handler when "Upload" is clicked
 *
 * Props:
 * - isOpen: boolean → whether the modal is visible
 * - onClose: () => void → function to close the modal
 * - onUpload: (file: File) => void → function to upload the selected image file
 */

"use client";
import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


// Props interface defining expected inputs for the component
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

// Main component
const ProfileImageUploadModal: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null); // State to store selected file

    // Called when the user clicks "Upload"
    const handleOk = () => {
        if (file) {
            // Trigger parent upload handler
            // Parent - profile page will handle uploading logic
            onUpload(file);
        } else {
            message.error("Please select a file to upload.");
        }
    };

    return (
        <Modal
            title={
                <div style={{ fontWeight: 600, fontSize: '20px', color: '#2E7D32' }}>
                    Upload Profile Picture
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            okText="Upload"
            cancelText="Cancel"
            okButtonProps={{
                disabled: !file,  // Disable upload button if no file is selected
                style: {
                    backgroundColor: "#2E7D32",
                    borderColor: "#2E7D32",
                    borderRadius: "20px",
                },
            }}
            cancelButtonProps={{
                style: {
                    borderRadius: "20px",
                }
            }}
            styles={{
                body: {
                    paddingTop: 20,
                    borderRadius: '12px',
                }
            }}
            style={{
                borderRadius: '12px',
            }}
        >

            <div style={{ textAlign: 'center' }}>

                {/* File Upload Section */}
                <Upload
                    beforeUpload={(file) => {
                        setFile(file);
                        return false;
                    }}
                    accept="image/*" // Accept only image files
                    showUploadList={{ showRemoveIcon: true }}
                    onRemove={() => setFile(null)} // Clear file if removed
                >
                    <Button
                        icon={<UploadOutlined />}
                        style={{
                            backgroundColor: "#E3F4C9",
                            color: "#2E7D32",
                            borderColor: "#2E7D32",
                            borderRadius: "9999px",
                            fontWeight: 500,
                        }}
                    >
                        Select Image
                    </Button>
                </Upload>

                {/* Image preview section */}
                {file && (
                    <div style={{ marginTop: 24 }}>
                        <img
                            src={URL.createObjectURL(file)} // Create preview URL from file
                            alt="Preview"
                            style={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: "50%", // Circle preview (this is how profile pics are shown in website)
                                border: "2px solid #2E7D32",
                            }}
                        />
                    </div>
                )}
            </div>
        </Modal>

    );
};

export default ProfileImageUploadModal;
