import React from 'react';
import { Typography, Button, message } from 'antd';
import '../index.css';

const { Text } = Typography;

// Define a color palette
const colors = {
    primary: '#4CAF50', // Green
    secondary: '#FF9800', // Orange
    text: '#333', // Dark text
    background: '#f9f9f9', // Light background
};

const IDDisplay = ({ peerID }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(peerID);
        message.success('ID copied to clipboard!');
    };

    return (
        <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '8px',
        }}>
            <Text style={{ color: colors.text }}>
                Your ID: <Text strong >{peerID || 'Loading...'}</Text>
            </Text>
            <Button
                type="link"
                onClick={handleCopy}
                style={{ marginLeft: '8px', color: colors.secondary }}
            >
                📋
            </Button>
        </div>
    );
};

export default IDDisplay;
