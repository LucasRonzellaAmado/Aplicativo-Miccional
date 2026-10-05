import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Droplet, Mail, Lock, User } from 'lucide-react'
import '../styles/LoginNew.css'
import { API_URL } from '../config';

export default function Signup({ onLogin }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não correspondem')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setCarregando(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      })

      if (response.ok) {
        const usuario = await response.json()
        onLogin(usuario.nome)
        navigate('/home')
      } else {
        const data = await response.json()
        setErro(data.message || 'Erro ao criar conta')
      }
    } catch (err) {
      setErro('Erro ao criar conta. Tente novamente.')
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
              <h2>Criar Conta</h2>
              <p>Preencha os dados para começar</p>
            </div>

            {erro && <div className="error-message-new">{erro}</div>}

            <div className="form-group-new">
              <label htmlFor="nome">Nome</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

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

            <div className="form-group-new">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
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
              {carregando ? 'Criando conta...' : 'Criar Conta'}
            </button>

            <div className="form-footer">
              <p>Já tem conta? <Link to="/">Fazer login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}