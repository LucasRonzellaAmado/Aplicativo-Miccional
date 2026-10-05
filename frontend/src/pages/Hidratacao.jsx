import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Clock, FileText } from 'lucide-react';

const LIQUID_TYPES = [
  'água',
  'suco',
  'café',
  'chá',
  'leite',
  'refrigerante',
  'alcoólico',
  'outro',
];

export default function Hidratacao() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: new Date().toISOString().slice(0, 16),
    volume: '',
    tipo: 'água',
    notas: '',
  });

  const [records, setRecords] = useState([]);
  const [totalLiquids, setTotalLiquids] = useState(0);

  useEffect(() => {
    // Buscar registros de hidratação de hoje
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/hydrations');
        const data = await response.json();

        const today = new Date().toISOString().split('T')[0];
        const todayRecords = data.filter(
          (r) => new Date(r.timestamp).toISOString().split('T')[0] === today
        );

        setRecords(todayRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

        const total = todayRecords.reduce((sum, r) => sum + r.volume, 0);
        setTotalLiquids(total);
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

  const handleQuickAdd = (volume) => {
    const newRecord = {
      volume: volume,
      type: 'água',
      notes: 'Adicionado rapidamente',
      timestamp: new Date().toISOString(),
    };

    addRecord(newRecord);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.volume) {
      alert('Por favor, informe o volume');
      return;
    }

    const newRecord = {
      volume: parseInt(form.volume),
      type: form.tipo,
      notes: form.notas,
      timestamp: form.horario,
    };

    addRecord(newRecord);

    // Reset form
    setForm({
      horario: new Date().toISOString().slice(0, 16),
      volume: '',
      tipo: 'água',
      notas: '',
    });
  };

  const addRecord = async (record) => {
    try {
      const response = await fetch('/api/hydrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        const savedRecord = await response.json();
        setRecords([savedRecord, ...records]);
        setTotalLiquids(totalLiquids + record.volume);
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  const progressPercentage = Math.min((totalLiquids / 2000) * 100, 100);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>Hidratação</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Progress Section */}
      <div className="hydration-progress">
        <div className="progress-label">
          <span>Ingestão de Líquidos Hoje</span>
          <span>
            {(totalLiquids / 1000).toFixed(2)}L / 2.0L
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="quick-add-buttons">
          <button
            className="quick-add-button"
            onClick={() => handleQuickAdd(200)}
          >
            + 200ml
          </button>
          <button
            className="quick-add-button"
            onClick={() => handleQuickAdd(250)}
          >
            + 250ml
          </button>
          <button
            className="quick-add-button"
            onClick={() => handleQuickAdd(500)}
          >
            + 500ml
          </button>
          <button
            className="quick-add-button"
            onClick={() => handleQuickAdd(1000)}
          >
            + 1L
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h3>Registrar Bebida</h3>
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
            <label htmlFor="tipo">Tipo de Líquido</label>
            <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
              {LIQUID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
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
              placeholder="Adicione observações..."
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Registrar Bebida
          </button>
        </form>
      </div>

      {/* Records Section */}
      <div className="records-section">
        <h3>Bebidas Registradas Hoje ({records.length})</h3>
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
                    <strong>Tipo</strong>
                    {record.type}
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