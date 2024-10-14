// src/components/Lobby.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';

function Lobby() {
    const socket = useContext(SocketContext);
    const [userName, setUserName] = useState('');
    const [roomIdInput, setRoomIdInput] = useState('');
    const navigate = useNavigate();

    const createRoom = () => {
        if (userName) {
            socket.emit('create-room', { userName }, ({ roomId }) => {
                navigate(`/room/${roomId}`, { state: { userName } });
            });
        } else {
            alert('이름을 입력하세요.');
        }
    };

    const joinRoom = () => {
        if (userName && roomIdInput) {
            socket.emit('join-room', { roomId: roomIdInput, userName }, (response) => {
                if (response.status === 'ok') {
                    navigate(`/room/${roomIdInput}`, { state: { userName } });
                } else {
                    alert(response.message);
                }
            });
        } else {
            alert('이름과 방 ID를 입력하세요.');
        }
    };

    return (
        <div>
            <h1>라이어 게임 with Gen AI</h1>
            <input
                type="text"
                placeholder="이름 입력"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <br />
            <button onClick={createRoom}>방 생성</button>
            <br />
            <input
                type="text"
                placeholder="방 ID 입력"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
            />
            <button onClick={joinRoom}>방 참가</button>
        </div>
    );
}

export default Lobby;
