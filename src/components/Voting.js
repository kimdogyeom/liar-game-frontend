// src/components/Voting.js
import React, { useState } from 'react';

function Voting({ socket, roomId, players }) {
    const [selectedPlayerId, setSelectedPlayerId] = useState('');

    const submitVote = () => {
        if (selectedPlayerId) {
            socket.emit('vote', { roomId, suspectId: selectedPlayerId });
        } else {
            alert('플레이어를 선택하세요.');
        }
    };

    return (
        <div>
            <h3>투표하기</h3>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        <label>
                            <input
                                type="radio"
                                name="vote"
                                value={player.id}
                                onChange={(e) => setSelectedPlayerId(e.target.value)}
                            />
                            {player.name}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={submitVote}>투표 제출</button>
        </div>
    );
}

export default Voting;
