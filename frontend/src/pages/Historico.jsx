import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileDown } from 'lucide-react';
import { API_URL } from '../config';
import { authHeaders } from '../auth';
import Orientacao from '../components/Orientacao';
import { montarRelatorio, tresDias } from '../relatorio';

// Data local no formato AAAA-MM-DD (evita o problema do fuso UTC)
const diaLocal = (valor) => {
  const d = new Date(valor);
  return isNaN(d) ? '' : d.toLocaleDateString('en-CA');
};

export default function Historico({ userName }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(diaLocal(new Date()));
  const [filterType, setFilterType] = useState('todos');
  const [records, setRecords] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    micturitions: 0,
    liquids: '0.00',
    nocturia: 0,
    losses: 0,
  });

  useEffect(() => {
    fetchHistoryData();
  }, [selectedDate, filterType]);

  const fetchHistoryData = async () => {
    try {
      const [micResponse, hydResponse, noctResponse] = await Promise.all([
        fetch(`${API_URL}/api/micturitions`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/hydrations`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/nocturia`, { headers: authHeaders() }),
      ]);

      const micData = await micResponse.json();
      const hydData = await hydResponse.json();
      const noctData = await noctResponse.json();

      const doDia = (lista) => lista.filter((r) => diaLocal(r.timestamp) === selectedDate);

      const mic = doDia(micData);
      const hyd = doDia(hydData);
      const noct = doDia(noctData);

      // Monta a timeline combinada
      let combined = [
        ...mic.map((m) => ({
          type: 'micturition',
          timestamp: m.timestamp,
          volume: m.volume,
          teve_perda: m.teve_perda,
          tamanho_perda: m.tamanho_perda,
          notas: m.notas,
        })),
        ...hyd.map((h) => ({
          type: 'hydration',
          timestamp: h.timestamp,
          volume: h.volume,
          tipo: h.tipo,
          notas: h.notas,
        })),
        ...noct.map((n) => ({
          type: 'nocturia',
          timestamp: n.timestamp,
          volume: n.volume,
          teve_perda: n.teve_perda,
          tamanho_perda: n.tamanho_perda,
          notas: n.notas,
        })),
      ];

      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Aplica o filtro
      let filtrados = combined;
      if (filterType === 'loss') {
        filtrados = combined.filter((r) => r.teve_perda === true);
      } else if (filterType !== 'todos') {
        filtrados = combined.filter((r) => r.type === filterType);
      }
      setRecords(filtrados);

      // Estatísticas do dia selecionado
      const totalLiquidos = hyd.reduce((sum, h) => sum + Number(h.volume), 0);
      setDailyStats({
        micturitions: mic.length,
        liquids: (totalLiquidos / 1000).toFixed(2),
        nocturia: noct.length,
        losses: [...mic, ...noct].filter((r) => r.teve_perda === true).length,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const gerarRelatorio = async () => {
    // Abre a aba já no clique para não ser bloqueada como pop-up
    const janela = window.open('', '_blank');
    if (!janela) {
      alert('Permita pop-ups para gerar o relatório.');
      return;
    }
    janela.document.write('<p style="font-family:sans-serif">Gerando relatório...</p>');
    try {
      const [micData, hydData, noctData] = await Promise.all(
        ['micturitions', 'hydrations', 'nocturia'].map((rota) =>
          fetch(`${API_URL}/api/${rota}`, { headers: authHeaders() }).then((r) => r.json())
        )
      );
      // Período de sono é opcional: se a aba ainda não existir na planilha, segue sem ele
      const sonoData = await fetch(`${API_URL}/api/sono`, { headers: authHeaders() })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []);
      const html = montarRelatorio({
        nome: userName,
        dias: tresDias(selectedDate),
        micData,
        hydData,
        noctData,
        sonoData,
      });
      janela.document.open();
      janela.document.write(html);
      janela.document.close();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      janela.close();
      alert('Não foi possível gerar o relatório. Tente novamente.');
    }
  };

  const getRecordLabel = (type) => {
    switch (type) {
      case 'micturition':
        return 'Micção';
      case 'hydration':
        return 'Hidratação';
      case 'nocturia':
        return 'Noctúria';
      default:
        return 'Registro';
    }
  };

  const getRecordDescription = (record) => {
    switch (record.type) {
      case 'micturition':
        return `${record.volume}ml${
          record.teve_perda ? ` · Perda ${record.tamanho_perda}` : ''
        }`;
      case 'hydration':
        return `${record.volume}ml de ${record.tipo}`;
      case 'nocturia':
        return `${record.volume}ml${
          record.teve_perda ? ` · Perda ${record.tamanho_perda}` : ''
        }`;
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

      {/* Orientação da página */}
      <Orientacao titulo="Consulte seus registros" imagem="/ilustracao-historico.webp">
        <p>
          Nesta página, você pode visualizar os registros por data e consultar as informações sobre
          micções, ingestão de líquidos, noctúria e perdas de urina. Utilize os filtros para ver os
          tipos de registro desejados. O resumo diário apresenta os dados daquela data, e a linha do
          tempo permite acompanhar os acontecimentos ao longo do dia.
        </p>
        <p>
          Se o profissional de saúde solicitar, utilize as informações do diário durante a consulta.
          Os registros auxiliam a avaliação, mas não substituem a análise clínica.
        </p>
      </Orientacao>

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
            className={`filter-button ${filterType === 'nocturia' ? 'active' : ''}`}
            onClick={() => setFilterType('nocturia')}
          >
            Noctúria
          </button>
          <button
            className={`filter-button ${filterType === 'loss' ? 'active' : ''}`}
            onClick={() => setFilterType('loss')}
          >
            Perdas
          </button>
        </div>
      </div>

      {/* Relatório de 3 dias */}
      <div className="questions-section" style={{ textAlign: 'center' }}>
        <p style={{ marginTop: 0, color: '#444', fontSize: '14px' }}>
          Gere um PDF com os 3 dias que terminam em{' '}
          <strong>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString('pt-BR')}</strong> para
          enviar ao profissional de saúde.
        </p>
        <button className="submit-button" onClick={gerarRelatorio}>
          <FileDown size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Gerar relatório de 3 dias (PDF)
        </button>
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
            <div className="summary-stat-number">{dailyStats.nocturia}</div>
            <div className="summary-stat-label">Noctúria</div>
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
                {record.notas && <div className="record-notes">📝 {record.notas}</div>}
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