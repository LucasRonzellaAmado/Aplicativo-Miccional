import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplet, Palette, FileText } from 'lucide-react';

export default function DiarioMiccional() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: new Date().toISOString().slice(0, 16),
    volume: '',
    consistencia: 'normal',
    cor: 'incolor',
    notas: '',
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Buscar registros de micção de hoje
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/api/micturitions`);
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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.volume) {
      alert('Por favor, informe o volume');
      return;
    }

    try {
      const response = await fetch('/api/micturitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volume: parseInt(form.volume),
          consistency: form.consistencia,
          color: form.cor,
          notes: form.notas,
          timestamp: form.horario,
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);

        // Reset form
        setForm({
          horario: new Date().toISOString().slice(0, 16),
          volume: '',
          consistencia: 'normal',
          cor: 'incolor',
          notas: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>Diário Miccional</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h3>Registrar Micção</h3>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="consistencia">Consistência</label>
              <select
                id="consistencia"
                name="consistencia"
                value={form.consistencia}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="liquida">Líquida</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cor">
                <Palette size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Cor
              </label>
              <select id="cor" name="cor" value={form.cor} onChange={handleChange}>
                <option value="incolor">Incolor</option>
                <option value="amarela">Amarela</option>
                <option value="amarela-forte">Amarela Forte</option>
                <option value="marrom">Marrom</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notas">
              <FileText size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Notas (Opcional)
            </label>
            <textarea
              id="notas"
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Adicione observações importantes..."
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Registrar Micção
          </button>
        </form>
      </div>

      {/* Records Section */}
      <div className="records-section">
        <h3>Registros de Hoje ({records.length})</h3>
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
                    <strong>Consistência</strong>
                    {record.consistency}
                  </div>
                  <div className="record-detail">
                    <strong>Cor</strong>
                    {record.color}
                  </div>
                </div>
                {record.notes && <div className="record-notes">📝 {record.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}