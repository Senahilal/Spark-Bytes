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
                disabled: !file,
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
            bodyStyle={{
                paddingTop: 20,
                borderRadius: '12px',
            }}
            style={{
                borderRadius: '12px',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Upload
                    beforeUpload={(file) => {
                        setFile(file);
                        return false;
                    }}
                    accept="image/*"
                    showUploadList={{ showRemoveIcon: true }}
                    onRemove={() => setFile(null)}
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

                {file && (
                    <div style={{ marginTop: 24 }}>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            style={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: "50%",
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
