import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplet, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';
import { authHeaders } from '../auth';
import Orientacao from '../components/Orientacao';

// Data local no formato AAAA-MM-DD (evita o problema do fuso UTC)
const diaLocal = (valor) => {
  const d = new Date(valor);
  return isNaN(d) ? '' : d.toLocaleDateString('en-CA');
};

// Data e hora local no formato do input datetime-local
const agoraLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function Nocturia() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: agoraLocal(),
    volume: '',
    teve_perda: '',
    tamanho_perda: 'pequena',
    notas: '',
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/api/nocturia`, {
          headers: authHeaders(),
        });
        const data = await response.json();

        const hoje = diaLocal(new Date());
        const todayRecords = data.filter((r) => diaLocal(r.timestamp) === hoje);

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
      const response = await fetch(`${API_URL}/api/nocturia`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          volume: parseInt(form.volume),
          teve_perda: form.teve_perda === 'sim',
          tamanho_perda: form.teve_perda === 'sim' ? form.tamanho_perda : null,
          notes: form.notas,
          timestamp: form.horario,
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);

        setForm({
          horario: agoraLocal(),
          volume: '',
          teve_perda: '',
          tamanho_perda: 'pequena',
          notas: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  const totalVolume = records.reduce((sum, r) => sum + r.volume, 0);
  const withLosses = records.filter((r) => r.teve_perda).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>Durante o Sono</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Orientação da página */}
      <Orientacao titulo="Registre os despertares noturnos" imagem="/ilustracao-sono.webp">
        <p>
          Informe os episódios em que você acordar durante o período de sono para urinar. Registre o
          horário e, quando possível, o volume eliminado. Informe também se houve perda involuntária
          de urina.
        </p>
        <p><strong>Sempre que solicitado, registre também:</strong></p>
        <ul>
          <li>O horário em que foi dormir.</li>
          <li>O horário em que acordou definitivamente.</li>
          <li>Os horários dos despertares para urinar.</li>
          <li>O volume de cada micção noturna, quando medido.</li>
          <li>Se houve perda involuntária de urina.</li>
        </ul>
        <p>
          <strong>Exemplo ilustrativo:</strong> dormiu às 22h30, acordou para urinar às 02h15 e
          acordou definitivamente às 06h30. Este é apenas um exemplo; os horários e a quantidade de
          despertares variam de pessoa para pessoa.
        </p>
        <p>
          <strong>Observação importante:</strong> acordar durante a noite não significa
          necessariamente ter noctúria. O termo é usado quando a pessoa desperta do sono para urinar
          e depois volta a dormir.
        </p>
      </Orientacao>

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

          <div className="questions-section">
            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#E85D75' }}>
              <AlertCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Informações Adicionais
            </h4>

            {/* Teve Perda */}
            <div className="form-group">
              <label>Houve perda involuntária?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="teve_perda"
                    value="sim"
                    checked={form.teve_perda === 'sim'}
                    onChange={handleChange}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="teve_perda"
                    value="nao"
                    checked={form.teve_perda === 'nao'}
                    onChange={handleChange}
                  />
                  Não
                </label>
              </div>

              {/* Tamanho da Perda - Aparece apenas se teve_perda === 'sim' */}
              {form.teve_perda === 'sim' && (
                <div className="form-group" style={{ marginTop: '12px', marginLeft: '20px' }}>
                  <label htmlFor="tamanho_perda">Tamanho da perda:</label>
                  <select
                    id="tamanho_perda"
                    name="tamanho_perda"
                    value={form.tamanho_perda}
                    onChange={handleChange}
                  >
                    <option value="pequena">Pequena</option>
                    <option value="media">Média</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              )}
            </div>
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
                    <strong>Status:</strong>{' '}
                    {record.teve_perda ? `Com perda (${record.tamanho_perda})` : 'Sem perda'}
                  </div>
                </div>
                {record.notas && <div className="record-notes">Obs: {record.notas}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}