import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplet, AlertCircle } from 'lucide-react';

export default function Nocturia() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: new Date().toISOString().slice(0, 16),
    volume: '',
    teve_perda: false,
    notas: '',
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/nocturia');
        const data = await response.json();

        const today = new Date().toISOString().split('T')[0];
        const todayRecords = data.filter(
          (r) => new Date(r.timestamp).toISOString().split('T')[0] === today
        );

        setRecords(todayRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
      }
    };

    fetchRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.volume) {
      alert('Por favor, informe o volume');
      return;
    }

    try {
      const response = await fetch('/api/nocturia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volume: parseInt(form.volume),
          had_loss: form.teve_perda,
          notes: form.notas,
          timestamp: form.horario,
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);

        setForm({
          horario: new Date().toISOString().slice(0, 16),
          volume: '',
          teve_perda: false,
          notas: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  const totalVolume = records.reduce((sum, r) => sum + r.volume, 0);
  const withLosses = records.filter((r) => r.had_loss).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>Noctúria</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Summary Cards */}
      <div className="daily-stats">
        <div className="stat-card">
          <div className="stat-label">Despertares</div>
          <div className="stat-number">{records.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Volume Total</div>
          <div className="stat-number">{totalVolume} ml</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Com Perdas</div>
          <div className="stat-number">{withLosses}</div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h3>Registrar Despertar Noturno</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horario">
                <Clock size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Horário
              </label>
              <input
                type="datetime-local"
                id="horario"
                name="horario"
                value={form.horario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="volume">
                <Droplet size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Volume (ml)
              </label>
              <input
                type="number"
                id="volume"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                placeholder="Ex: 250"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="teve_perda"
                checked={form.teve_perda}
                onChange={handleChange}
                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <AlertCircle size={16} style={{ marginRight: '8px', color: '#E85D75' }} />
              Houve perda involuntária?
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="notas">Observações (Opcional)</label>
            <textarea
              id="notas"
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Adicione observações sobre o despertar..."
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Registrar Despertar
          </button>
        </form>
      </div>

      {/* Records Section */}
      <div className="records-section">
        <h3>Registros da Noite ({records.length})</h3>
        {records.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            Nenhum registro ainda
          </p>
        ) : (
          <div className="record-list">
            {records.map((record, index) => (
              <div key={index} className="record-item">
                <div className="record-header">
                  <span className="record-time">
                    {new Date(record.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="record-volume">{record.volume} ml</span>
                </div>
                <div className="record-details">
                  <div className="record-detail">
                    <strong>Status</strong>
                    {record.had_loss ? 'Com perda' : 'Sem perda'}
                  </div>
                </div>
                {record.notes && <div className="record-notes">Obs: {record.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}