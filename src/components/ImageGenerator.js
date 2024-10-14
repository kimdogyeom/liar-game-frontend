// src/components/ImageGenerator.js

import React, { useState, useEffect } from 'react';

function ImageGenerator({ socket, roomId }) {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        socket.on('receive-image', ({ imageUrl }) => {
            setImageUrl(imageUrl);
        });

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            socket.off('receive-image');
        };
    }, [socket]);

    const requestImage = () => {
        if (prompt) {
            socket.emit('request-image', { roomId, prompt });
        } else {
            alert('프롬프트를 입력하세요.');
        }
    };

    return (
        <div>
            <h3>이미지 생성</h3>
            <input
                type="text"
                placeholder="이미지 생성 프롬프트 입력"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={requestImage}>이미지 생성</button>
            {imageUrl && (
                <div>
                    <h4>생성된 이미지:</h4>
                    <img src={imageUrl} alt="생성된 이미지" />
                </div>
            )}
        </div>
    );
}

export default ImageGenerator;
