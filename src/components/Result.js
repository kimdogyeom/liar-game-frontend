// src/components/Result.js
import React from 'react';

function Result({ result, players }) {
    const { suspects, liarId } = result;
    const liar = players.find((player) => player.id === liarId);
    const isLiarCaught = suspects.includes(liarId);

    return (
        <div>
            <h3>투표 결과</h3>
            <p>최다 득표자: {suspects.map((id) => players.find((p) => p.id === id)?.name).join(', ')}</p>
            <p>라이어: {liar?.name}</p>
            <p>{isLiarCaught ? '라이어가 잡혔습니다!' : '라이어가 승리했습니다!'}</p>
        </div>
    );
}

export default Result;
