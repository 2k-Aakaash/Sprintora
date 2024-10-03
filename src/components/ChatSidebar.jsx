import React, { useState, useEffect } from 'react';
import { Input, Button, List, Typography } from 'antd';
import '../index.css';
const { Text } = Typography;

const ChatSidebar = ({ conn, showChat }) => {
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
        <div className={`chat-sidebar ${showChat ? 'slide-in' : 'slide-out'}`} style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '300px',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease-in-out',
            transform: showChat ? 'translateX(0)' : 'translateX(100%)',
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
                                backgroundColor: msg.isSender ? 'var(--sender-chat-color)' : 'var(--receiver-chat-color)', // Use CSS variables
                                color: msg.isSender ? 'var(--text-color-sender)' : 'var(--text-color-receiver)',
                            }}
                        >
                            <Text>{msg.text}</Text>
                        </div>
                    </List.Item>
                )}
                style={{ flex: 1, overflowY: 'auto' }} // Allow the list to take available space
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
