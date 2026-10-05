import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Plus, TrendingUp, Calendar, Droplet, AlertCircle } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard({ usuario, onLogout }) {
  const [registros, setRegistros] = useState([])
  const [novoRegistro, setNovoRegistro] = useState({
    tipo: 'miccao',
    horario: new Date().toISOString().slice(0, 16),
    volume: '',
    notas: ''
  })
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarRegistros()
  }, [usuario.id])

  const carregarRegistros = async () => {
    try {
      const response = await fetch(`/api/registros/${usuario.id}`)
      if (response.ok) {
        const dados = await response.json()
        setRegistros(dados)
      }
    } catch (err) {
      console.error('Erro ao carregar registros:', err)
    } finally {
      setCarregando(false)
    }
  }

  const handleAddRegistro = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario.id,
          ...novoRegistro
        })
      })

      if (response.ok) {
        const registro = await response.json()
        setRegistros([registro, ...registros])
        setNovoRegistro({
          tipo: 'miccao',
          horario: new Date().toISOString().slice(0, 16),
          volume: '',
          notas: ''
        })
      }
    } catch (err) {
      console.error('Erro ao adicionar registro:', err)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'miccao':
        return <AlertCircle size={20} />
      case 'hidratacao':
        return <Droplet size={20} />
      case 'perda':
        return <AlertCircle size={20} />
      default:
        return <Calendar size={20} />
    }
  }

  const getTipoLabel = (tipo) => {
    switch(tipo) {
      case 'miccao':
        return 'Micção'
      case 'hidratacao':
        return 'Hidratação'
      case 'perda':
        return 'Perda Urinária'
      default:
        return tipo
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Bem-vindo, {usuario.nome}!</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={20} />
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        {/* Stats */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={32} />
            </div>
            <h3>Registros Hoje</h3>
            <p className="stat-number">
              {registros.filter(r => new Date(r.horario).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Droplet size={32} />
            </div>
            <h3>Total de Registros</h3>
            <p className="stat-number">{registros.length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Acompanhamento</h3>
            <p className="stat-text">Em dia</p>
          </div>
        </section>

        {/* Novo Registro */}
        <section className="new-record-section">
          <h2>Novo Registro</h2>
          <form onSubmit={handleAddRegistro} className="record-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tipo</label>
                <select 
                  value={novoRegistro.tipo}
                  onChange={(e) => setNovoRegistro({...novoRegistro, tipo: e.target.value})}
                >
                  <option value="miccao">Micção</option>
                  <option value="hidratacao">Ingestão de Líquidos</option>
                  <option value="perda">Perda Urinária</option>
                </select>
              </div>
              <div className="form-group">
                <label>Horário</label>
                <input 
                  type="datetime-local"
                  value={novoRegistro.horario}
                  onChange={(e) => setNovoRegistro({...novoRegistro, horario: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Volume (ml)</label>
                <input 
                  type="number"
                  value={novoRegistro.volume}
                  onChange={(e) => setNovoRegistro({...novoRegistro, volume: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notas</label>
              <textarea 
                value={novoRegistro.notas}
                onChange={(e) => setNovoRegistro({...novoRegistro, notas: e.target.value})}
                placeholder="Adicione observações..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              <Plus size={20} /> Adicionar Registro
            </button>
          </form>
        </section>

        {/* Histórico */}
        <section className="history-section">
          <h2>Histórico de Registros</h2>
          {carregando ? (
            <p>Carregando registros...</p>
          ) : registros.length === 0 ? (
            <p className="empty-state">Nenhum registro ainda. Comece a adicionar!</p>
          ) : (
            <div className="registros-list">
              {registros.map(registro => (
                <div key={registro.id} className="registro-item">
                  <div className="registro-icon">
                    {getTipoIcon(registro.tipo)}
                  </div>
                  <div className="registro-info">
                    <h4>{getTipoLabel(registro.tipo)}</h4>
                    <p className="registro-hora">
                      {new Date(registro.horario).toLocaleString('pt-BR')}
                    </p>
                    {registro.volume && <p className="registro-volume">Volume: {registro.volume}ml</p>}
                    {registro.notas && <p className="registro-notas">{registro.notas}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
