import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import '../index.css';

const { Text } = Typography;

// Define a color palette
const colors = {
    primary: '#4CAF50', // Green
    secondary: '#FF9800', // Orange
    text: '#333', // Dark text
    background: '#f9f9f9', // Light background
    buttonBackground: '#f6893a', // Custom button color
};

const FileTransfer = ({ onConnect }) => {
    const [recipientID, setRecipientID] = useState('');

    const handleConnectClick = () => {
        if (recipientID) {
            onConnect(recipientID);
        }
    };

    return (
        <div style={{ padding: '16px', borderRadius: '8px', maxWidth: '400px', margin: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: colors.text }}>Enter Recipient’s ID</Text>
                <Input
                    placeholder="The ID..."
                    value={recipientID}
                    onChange={(e) => setRecipientID(e.target.value)}
                    style={{ marginTop: '8px', borderRadius: '4px' }}
                />
                <Button
                    type="primary"
                    onClick={handleConnectClick}
                    style={{
                        marginTop: '16px',
                        backgroundColor: colors.buttonBackground,
                        borderColor: colors.buttonBackground,
                        color: '#fff'
                    }}
                >
                    Connect
                </Button>
            </div>
        </div>
    );
};

export default FileTransfer;
