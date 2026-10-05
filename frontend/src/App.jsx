import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import DiarioMiccional from './pages/DiarioMiccional';
import Hidratacao from './pages/Hidratacao';
import Historico from './pages/Historico';
import Header from './components/Header';
import './App.css';
import './styles/Header.css';
import './styles/Pages.css';
import Nocturia from './pages/Nocturia';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name) => {
    // Se name for um objeto, extrai só o nome
    const userName = typeof name === 'string' ? name : name.nome || name.email || 'Usuária';
    setUserName(userName);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <Router>
      {isAuthenticated && <Header userName={userName} onLogout={handleLogout} />}
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home userName={userName} />} />
            <Route path="/diario" element={<DiarioMiccional />} />
            <Route path="/hidratacao" element={<Hidratacao />} />
            <Route path="/nocturia" element={<Nocturia />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;