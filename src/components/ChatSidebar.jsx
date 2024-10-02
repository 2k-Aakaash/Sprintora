import React, { useState, useEffect } from 'react';

const ChatSidebar = ({ peer, conn }) => {
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
            transition: 'transform 0.3s ease',
            transform: 'translateX(0)',
        }}>
            <h2 className="text-xl mb-4">Chat</h2>
            <div className="flex flex-col h-72 overflow-auto border border-gray-300 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.isSender ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block px-3 py-2 rounded-lg ${msg.isSender ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-md">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatSidebar;
