// src/components/GameRoom.js

import React, {useState, useEffect, useContext} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Chat from './Chat';
import ImageGenerator from './ImageGenerator';
import Voting from './Voting';
import Result from './Result';
import { SocketContext } from '../App';

function GameRoom() {
    const socket = useContext(SocketContext);
    const { roomId } = useParams();
    const location = useLocation();
    const userName = location.state?.userName;

    const [players, setPlayers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isLiar, setIsLiar] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [images, setImages] = useState([]);
    const [votingPhase, setVotingPhase] = useState(false);
    const [result, setResult] = useState(null);
    const [currentPlayerId, setCurrentPlayerId] = useState('');
    const [discussionTimeLeft, setDiscussionTimeLeft] = useState(null);
    const [discussionPhase, setDiscussionPhase] = useState(false);

    useEffect(() => {
        if (!userName) {
            // 사용자 이름이 없으면 로비로 이동
            window.location.href = '/';
            return;
        }

        // 방 참가
        socket.emit('join-room', { roomId, userName }, () => {});

        // 이벤트 리스너 설정
        socket.on('update-players', (players) => {
            setPlayers(players);
        });

        socket.on('game-started', ({ currentPlayerId }) => {
            setGameStarted(true);
            setCurrentPlayerId(currentPlayerId);
        });

        socket.on('assign-keyword', ({ keyword, isLiar }) => {
            setKeyword(keyword);
            setIsLiar(isLiar);
        });

        socket.on('next-turn', ({ currentPlayerId }) => {
            setCurrentPlayerId(currentPlayerId);
        });

        socket.on('all-images-generated', ({ images }) => {
            setImages(images);
            setDiscussionPhase(true);
        });

        socket.on('discussion-started', ({ timeLeft }) => {
            setDiscussionTimeLeft(timeLeft);
        });

        socket.on('discussion-timer', ({ timeLeft }) => {
            setDiscussionTimeLeft(timeLeft);
        });

        socket.on('discussion-ended', () => {
            setDiscussionPhase(false);
        });

        socket.on('start-voting', () => {
            setVotingPhase(true);
        });

        socket.on('voting-result', (data) => {
            setResult(data);
        });

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            socket.off('update-players');
            socket.off('game-started');
            socket.off('assign-keyword');
            socket.off('next-turn');
            socket.off('all-images-generated');
            socket.off('discussion-started');
            socket.off('discussion-timer');
            socket.off('discussion-ended');
            socket.off('start-voting');
            socket.off('voting-result');
        };
    }, [socket, roomId, userName]);

    const startGame = () => {
        socket.emit('start-game', { roomId });
    };

    const isMyTurn = socket.id === currentPlayerId;

    return (
        <div>
            <h2>방 ID: {roomId}</h2>
            <h3>플레이어 목록</h3>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name} {currentPlayerId === player.id ? '(현재 차례)' : ''}
                    </li>
                ))}
            </ul>
            {!gameStarted && (
                <button onClick={startGame}>게임 시작</button>
            )}
            {gameStarted && !discussionPhase && !votingPhase && !result && (
                <>
                    <p>{isLiar ? '당신은 라이어입니다!' : `키워드: ${keyword}`}</p>
                    {isMyTurn ? (
                        <ImageGenerator socket={socket} roomId={roomId} />
                    ) : (
                        <p>다른 플레이어가 이미지를 생성 중입니다...</p>
                    )}
                </>
            )}
            {discussionPhase && !votingPhase && !result && (
                <>
                    <h3>이미지 목록</h3>
                    <div>
                        {images.map((img) => (
                            <div key={img.playerId}>
                                <p>{img.userName}</p>
                                <img src={img.imageUrl} alt="생성된 이미지" />
                            </div>
                        ))}
                    </div>
                    <p>토론 시간: {discussionTimeLeft}초 남음</p>
                    <Chat socket={socket} roomId={roomId} />
                </>
            )}
            {votingPhase && !result && (
                <Voting socket={socket} roomId={roomId} players={players} />
            )}
            {result && (
                <Result result={result} players={players} />
            )}
        </div>
    );
}

export default GameRoom;
