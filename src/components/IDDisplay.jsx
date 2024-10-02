import React from 'react';
import { Typography, Button, message } from 'antd';

const { Text } = Typography;

const IDDisplay = ({ peerID }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(peerID);
        message.success('ID copied to clipboard!');
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Text>Your ID: <Text strong>{peerID || 'Loading...'}</Text></Text>
            <Button type="link" onClick={handleCopy} style={{ marginLeft: '8px' }}>📋</Button>
        </div>
    );
};

export default IDDisplay;
