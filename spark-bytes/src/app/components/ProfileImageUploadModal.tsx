"use client";
import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

const ProfileImageUploadModal: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleOk = () => {
        if (file) {
            onUpload(file);
        } else {
            message.error("Please select a file to upload.");
        }
    };

    return (
        <Modal
            title="Upload Profile Picture"
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            okButtonProps={{ disabled: !file }}
            okText="Upload"
        >
            <Upload
                beforeUpload={(file) => {
                    setFile(file);
                    return false; // prevent automatic upload
                }}
                accept="image/*"
                showUploadList={{ showRemoveIcon: true }}
                onRemove={() => setFile(null)}
            >
                <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>

            {file && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }}
                    />
                </div>
            )}
        </Modal>
    );
};

export default ProfileImageUploadModal;
