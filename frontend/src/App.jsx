import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DiarioMiccional from './pages/DiarioMiccional';
import Hidratacao from './pages/Hidratacao';
import Historico from './pages/Historico';
import Nocturia from './pages/Nocturia';
import Header from './components/Header';
import { getSessao, limparSessao } from './auth';
import './App.css';
import './styles/Header.css';
import './styles/Pages.css';

function App() {
  // Lê a sessão salva no localStorage, para continuar logado depois do F5
  const sessaoInicial = getSessao();

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(sessaoInicial?.token));
  const [userName, setUserName] = useState(sessaoInicial?.nome || '');

  const handleLogin = (name) => {
    // Se name for um objeto, extrai só o nome
    const nomeUsuario = typeof name === 'string' ? name : name.nome || name.email || 'Usuária';
    setUserName(nomeUsuario);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    limparSessao();
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
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home userName={userName} />} />
            <Route path="/diario" element={<DiarioMiccional />} />
            <Route path="/hidratacao" element={<Hidratacao />} />
            <Route path="/nocturia" element={<Nocturia />} />
            <Route path="/historico" element={<Historico userName={userName} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;