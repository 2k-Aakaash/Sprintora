import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';

const { Text } = Typography;

const FileTransfer = ({ onConnect }) => {
    const [recipientID, setRecipientID] = useState('');

    const handleConnectClick = () => {
        if (recipientID) {
            onConnect(recipientID);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <Text>Enter Recipient’s ID</Text>
                <Input
                    placeholder="7aBcDeFgHiJkLmN0..."
                    value={recipientID}
                    onChange={(e) => setRecipientID(e.target.value)}
                    style={{ marginTop: '8px' }}
                />
                <Button type="primary" onClick={handleConnectClick} style={{ marginTop: '16px', backgroundColor: '#f6893a' }}>
                    Connect
                </Button>
            </div>
        </div>
    );
};

export default FileTransfer;
