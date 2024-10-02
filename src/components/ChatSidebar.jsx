import React, { useState, useEffect } from 'react';
import { Input, Button, List, Typography } from 'antd';

const { Text } = Typography;

const ChatSidebar = ({ conn }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        if (conn) {
            conn.on('data', (data) => {
                setMessages((prev) => [...prev, { text: data, isSender: false }]);
            });
        }
    }, [conn]);

    const sendMessage = () => {
        if (conn && inputMessage.trim()) {
            conn.send(inputMessage);
            setMessages((prev) => [...prev, { text: inputMessage, isSender: true }]);
            setInputMessage('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '300px',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            overflowY: 'auto',
        }}>
            <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Chat</h2>
            <List
                dataSource={messages}
                renderItem={(msg, index) => (
                    <List.Item
                        key={index}
                        style={{
                            justifyContent: msg.isSender ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                maxWidth: '70%',
                                padding: '8px',
                                borderRadius: '16px',
                                backgroundColor: msg.isSender ? '#1890ff' : '#f0f0f0',
                                color: msg.isSender ? '#fff' : '#000',
                            }}
                        >
                            <Text>{msg.text}</Text>
                        </div>
                    </List.Item>
                )}
            />
            <div style={{ display: 'flex', marginTop: '16px' }}>
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flexGrow: 1, marginRight: '8px' }}
                />
                <Button type="primary" onClick={sendMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default ChatSidebar;
