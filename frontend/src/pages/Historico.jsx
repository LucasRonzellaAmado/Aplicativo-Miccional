import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Filter } from 'lucide-react';

export default function Historico() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('todos');
  const [records, setRecords] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    micturitions: 0,
    liquids: 0,
    losses: 0,
  });

  useEffect(() => {
    fetchHistoryData();
  }, [selectedDate, filterType]);

  const fetchHistoryData = async () => {
    try {
      const [micResponse, hydResponse, lossResponse] = await Promise.all([
        fetch(`${API_URL}/api/micturitions`),
        fetch('/api/hydrations'),
        fetch('/api/losses'),
      ]);

      const micData = await micResponse.json();
      const hydData = await hydResponse.json();
      const lossData = await lossResponse.json();

      // Filtrar por data selecionada
      const mic = micData.filter(
        (m) => new Date(m.timestamp).toISOString().split('T')[0] === selectedDate
      );
      const hyd = hydData.filter(
        (h) => new Date(h.timestamp).toISOString().split('T')[0] === selectedDate
      );
      const loss = lossData.filter(
        (l) => new Date(l.timestamp).toISOString().split('T')[0] === selectedDate
      );

      // Montar timeline combinada
      let combined = [];

      mic.forEach((m) => {
        combined.push({
          type: 'micturition',
          timestamp: m.timestamp,
          volume: m.volume,
          consistency: m.consistency,
          color: m.color,
          notes: m.notes,
        });
      });

      hyd.forEach((h) => {
        combined.push({
          type: 'hydration',
          timestamp: h.timestamp,
          volume: h.volume,
          liquidType: h.type,
          notes: h.notes,
        });
      });

      loss.forEach((l) => {
        combined.push({
          type: 'loss',
          timestamp: l.timestamp,
          notes: l.notes,
        });
      });

      // Ordenar por hora
      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Aplicar filtro
      if (filterType !== 'todos') {
        combined = combined.filter((r) => r.type.includes(filterType));
      }

      setRecords(combined);

      // Calcular estatísticas
      setDailyStats({
        micturitions: mic.length,
        liquids: (hyd.reduce((sum, h) => sum + h.volume, 0) / 1000).toFixed(2),
        losses: loss.length,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const getRecordLabel = (type) => {
    switch (type) {
      case 'micturition':
        return 'Micção';
      case 'hydration':
        return 'Hidratação';
      case 'loss':
        return 'Perda';
      default:
        return 'Registro';
    }
  };

  const getRecordDescription = (record) => {
    switch (record.type) {
      case 'micturition':
        return `${record.volume}ml - ${record.consistency} (Cor: ${record.color})`;
      case 'hydration':
        return `${record.volume}ml de ${record.liquidType}`;
      case 'loss':
        return 'Perda registrada';
      default:
        return '';
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
        <h1>Histórico</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <div className="form-group">
            <label htmlFor="date-picker">
              <Calendar size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Data
            </label>
            <input
              type="date"
              id="date-picker"
              className="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${filterType === 'todos' ? 'active' : ''}`}
            onClick={() => setFilterType('todos')}
          >
            Todos
          </button>
          <button
            className={`filter-button ${filterType === 'micturition' ? 'active' : ''}`}
            onClick={() => setFilterType('micturition')}
          >
            Micções
          </button>
          <button
            className={`filter-button ${filterType === 'hydration' ? 'active' : ''}`}
            onClick={() => setFilterType('hydration')}
          >
            Líquidos
          </button>
          <button
            className={`filter-button ${filterType === 'loss' ? 'active' : ''}`}
            onClick={() => setFilterType('loss')}
          >
            Perdas
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="daily-summary">
        <div className="summary-title">Resumo do dia {selectedDate}</div>
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="summary-stat-number">{dailyStats.micturitions}</div>
            <div className="summary-stat-label">Micções</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-number">{dailyStats.liquids}L</div>
            <div className="summary-stat-label">Líquidos</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-number">{dailyStats.losses}</div>
            <div className="summary-stat-label">Perdas</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        <div className="timeline-title">Timeline</div>
        {records.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            Nenhum registro para esta data
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
                  <span className="timeline-type">{getRecordLabel(record.type)}</span>
                </div>
                <div style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>
                  {getRecordDescription(record)}
                </div>
                {record.notes && (
                  <div className="record-notes">📝 {record.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Graphs Section (Placeholder) */}
      <div className="graphs-section">
        <p>Gráficos semanais em breve...</p>
      </div>
    </div>
  );
}