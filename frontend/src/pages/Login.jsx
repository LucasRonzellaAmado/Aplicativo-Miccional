import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Droplet, Mail, Lock } from 'lucide-react'
import '../styles/LoginNew.css'
import { API_URL } from '../config';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      if (response.ok) {
        const usuario = await response.json()
        onLogin(usuario.nome)
        navigate('/home')
      } else {
        setErro('Email ou senha inválidos')
      }
    } catch (err) {
      setErro('Erro ao fazer login. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-container-new">
      <div className="auth-content">
        {/* Left Side - Illustration */}
        <div className="auth-left">
          <div className="logo-section">
            <div className="logo-circle">
              <Droplet size={48} color="#E85D75" strokeWidth={1.5} />
            </div>
            <h1>Diário Miccional</h1>
            <p className="subtitle">Controle sua saúde com precisão</p>
          </div>

          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div>
                <h4>Rastreamento Completo</h4>
                <p>Registre todos os dados do seu diário</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div>
                <h4>Análise Detalhada</h4>
                <p>Veja seus padrões e histórico completo</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div>
                <h4>Privado e Seguro</h4>
                <p>Seus dados são totalmente protegidos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form-new">
            <div className="form-header">
              <h2>Bem-vindo de volta</h2>
              <p>Digite suas credenciais para continuar</p>
            </div>

            {erro && <div className="error-message-new">{erro}</div>}

            <div className="form-group-new">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group-new">
              <label htmlFor="senha">Senha</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-login" 
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="form-footer">
              <p>Não tem conta? <Link to="/signup">Criar conta</Link></p>
              <a href="#recuperar">Esqueceu sua senha?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}