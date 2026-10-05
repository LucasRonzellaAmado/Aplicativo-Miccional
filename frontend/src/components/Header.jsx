import React from 'react';
import { LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ userName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="header-home-button"
            onClick={() => navigate('/home')}
            title="Voltar para Home"
          >
            <Home size={24} />
          </button>
          <div className="header-title">
            <h1>Diário Miccional 💗</h1>
            <p className="header-subtitle">Controle sua saúde</p>
          </div>
        </div>

        <div className="header-right">
          <span className="header-user">Bem-vinda, {userName}!</span>
          <button className="header-logout-button" onClick={handleLogout} title="Sair">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}