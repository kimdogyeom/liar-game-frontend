// src/socket.js
import io from 'socket.io-client';

const serverUrls = ['http://192.168.1.107:4000', 'http://localhost:4000'];

let socket;
for (const url of serverUrls) {
    try {
        socket = io(url, {
            withCredentials: true,
        });
        break; // 연결이 성공하면 루프를 종료
    } catch (error) {
        console.error(`Failed to connect to ${url}`, error);
    }
}

export default socket;
