// src/App.js
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import socket from './socket';

export const SocketContext = React.createContext();

function App() {
    return (
        <div>
            <h1>테스트 페이지</h1>
            <SocketContext.Provider value={socket}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Lobby/>}/>
                        <Route path="/room/:roomId" element={<GameRoom/>}/>
                    </Routes>
                </Router>
            </SocketContext.Provider>
        </div>
    );
}

export default App;
