import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Droplet, Mail, Lock, User } from 'lucide-react'
import './Auth.css'

export default function Signup({ onLogin }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (senha !== confirmaSenha) {
      setErro('As senhas não conferem')
      return
    }

    setCarregando(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, nome })
      })

      if (response.ok) {
        const usuario = await response.json()
        onLogin(usuario)
        navigate('/home')
      } else {
        setErro('Email já cadastrado ou erro no registro')
      }
    } catch (err) {
      setErro('Erro ao criar conta. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <div className="illustration-box">
          <Droplet size={64} color="var(--primary-pink)" />
          <h1>Diário Miccional</h1>
        </div>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Criar minha conta</h2>
          
          {erro && <div className="error-message">{erro}</div>}

          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <div className="input-with-icon">
              <User size={20} />
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={20} />
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

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="input-with-icon">
              <Lock size={20} />
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

          <div className="form-group">
            <label htmlFor="confirmaSenha">Confirmar Senha</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type="password"
                id="confirmaSenha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar minha conta'}
          </button>

          <div className="auth-links">
            <p>
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
