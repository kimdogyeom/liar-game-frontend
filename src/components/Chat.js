// src/components/Chat.js
import React, { useState, useEffect } from 'react';

function Chat({ socket, roomId }) {
    const [message, setMessage] = useState('');
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        socket.on('receive-message', ({ userName, message }) => {
            setChatList((prev) => [...prev, { userName, message }]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [socket]);

    const sendMessage = () => {
        if (message) {
            socket.emit('send-message', { roomId, message });
            setMessage('');
        }
    };

    return (
        <div>
            <h3>채팅</h3>
            <div>
                {chatList.map((chat, index) => (
                    <p key={index}>
                        <strong>{chat.userName}:</strong> {chat.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                placeholder="메시지 입력"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>전송</button>
        </div>
    );
}

export default Chat;
