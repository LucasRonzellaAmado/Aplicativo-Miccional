import { useNavigate } from 'react-router-dom'
import { Droplet, CheckCircle, Share2, Lock } from 'lucide-react'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <Droplet className="logo-icon" />
            <span>Diário Miccional</span>
          </div>
          <div className="header-buttons">
            <button onClick={() => navigate('/login')} className="btn-secondary">
              Entrar
            </button>
            <button onClick={() => navigate('/signup')} className="btn-primary">
              Criar minha conta
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Seu cuidado começa pelo registro</h1>
          <p className="hero-subtitle">
            Um diário miccional digital para organizar informações e acompanhar sua rotina de forma simples.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="btn-primary btn-large">
              Criar minha conta
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary btn-large">
              Entrar
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'var(--primary-pink)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'var(--secondary-pink)', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            
            {/* Celular */}
            <rect x="80" y="40" width="140" height="220" rx="15" fill="white" stroke="var(--primary-pink)" strokeWidth="3"/>
            <rect x="90" y="50" width="120" height="180" rx="10" fill="var(--very-light-pink)"/>
            
            {/* Gota de água animada */}
            <path d="M 150 80 Q 140 95 140 105 Q 140 120 150 125 Q 160 120 160 105 Q 160 95 150 80" 
                  fill="url(#dropGradient)" opacity="0.8"/>
            
            {/* Texto dentro do celular */}
            <text x="150" y="145" textAnchor="middle" fill="var(--text-secondary)" fontSize="8">
              Registros
            </text>
            <text x="150" y="160" textAnchor="middle" fill="var(--text-secondary)" fontSize="8">
              Horários
            </text>
          </svg>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="how-it-works">
        <h2>Como funciona</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">
              <Droplet size={32} />
            </div>
            <h3>Registre</h3>
            <p>Adicione seus dados de forma rápida e simples</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <CheckCircle size={32} />
            </div>
            <h3>Acompanhe</h3>
            <p>Visualize seu histórico com gráficos claros</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Share2 size={32} />
            </div>
            <h3>Compartilhe</h3>
            <p>Envie dados para seu profissional de saúde</p>
          </div>
        </div>
      </section>

      {/* Privacidade */}
      <section className="privacy">
        <div className="privacy-content">
          <Lock size={48} className="privacy-icon" />
          <h2>Seus dados estão protegidos</h2>
          <p>
            Todos os seus dados são criptografados e compartilhados apenas com sua autorização. 
            Seu privacidade é nossa prioridade.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2024 Diário Miccional. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
