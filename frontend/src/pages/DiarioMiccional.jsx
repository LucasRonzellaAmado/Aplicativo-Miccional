import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplet, FileText, AlertCircle } from 'lucide-react';
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

export default function DiarioMiccional() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: agoraLocal(),
    volume: '',
    urgencia: '',
    teve_perda: '',
    tamanho_perda: 'pequena',
    esforco: '',
    esvaziou_completo: '',
    gotinhas_pos: '',
    notas: '',
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/api/micturitions`, {
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
      const response = await fetch(`${API_URL}/api/micturitions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          volume: parseInt(form.volume),
          urgencia: form.urgencia === 'sim',
          teve_perda: form.teve_perda === 'sim',
          tamanho_perda: form.teve_perda === 'sim' ? form.tamanho_perda : null,
          esforco: form.esforco === 'sim',
          esvaziou_completo: form.esvaziou_completo === 'sim',
          gotinhas_pos: form.gotinhas_pos === 'sim',
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
          urgencia: '',
          teve_perda: '',
          tamanho_perda: 'pequena',
          esforco: '',
          esvaziou_completo: '',
          gotinhas_pos: '',
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

      {/* Orientação da página */}
      <Orientacao titulo="Registre suas micções" imagem="/ilustracao-diario.webp">
        <p>
          Anote cada vez que urinar durante o período orientado pelo profissional de saúde. Sempre
          que possível, meça o volume de urina e preencha as informações adicionais.
        </p>
        <p><strong>O que significa cada campo?</strong></p>
        <ul>
          <li><strong>Horário:</strong> momento em que você urinou.</li>
          <li><strong>Volume (ml):</strong> quantidade de urina eliminada, medida em mililitros.</li>
          <li><strong>Urgência:</strong> vontade súbita e difícil de adiar de urinar.</li>
          <li><strong>Perda de urina:</strong> escape involuntário de urina antes de chegar ao banheiro ou em outra situação.</li>
          <li><strong>Esforço para esvaziar a bexiga:</strong> necessidade de fazer força para conseguir urinar.</li>
        </ul>
        <p>
          <strong>Exemplo ilustrativo</strong> (registre o que aconteceu com você, sem tentar
          reproduzir estes valores): Horário 10h30 · Volume 250 ml · Urgência: Não · Perda de
          urina: Não.
        </p>
      </Orientacao>

      {/* Form Section */}
      <div className="form-section">
        <h3>Registrar Micção</h3>
        <form onSubmit={handleSubmit}>
          {/* Linha 1: Horário e Volume */}
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

          {/* Perguntas: Sim/Não */}
          <div className="questions-section">
            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#E85D75' }}>
              <AlertCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Informações Adicionais
            </h4>

            {/* Urgência */}
            <div className="form-group">
              <label>Teve urgência para ir ao banheiro?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="urgencia"
                    value="sim"
                    checked={form.urgencia === 'sim'}
                    onChange={handleChange}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="urgencia"
                    value="nao"
                    checked={form.urgencia === 'nao'}
                    onChange={handleChange}
                  />
                  Não
                </label>
              </div>
            </div>

            {/* Teve Perda */}
            <div className="form-group">
              <label>Teve alguma perda?</label>
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

            {/* Esforço */}
            <div className="form-group">
              <label>Precisou fazer esforço para esvaziar a bexiga?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="esforco"
                    value="sim"
                    checked={form.esforco === 'sim'}
                    onChange={handleChange}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="esforco"
                    value="nao"
                    checked={form.esforco === 'nao'}
                    onChange={handleChange}
                  />
                  Não
                </label>
              </div>
            </div>

            {/* Esvaziou Completo */}
            <div className="form-group">
              <label>Você sentiu que esvaziou completamente a bexiga?</label>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888' }}>
                Pense se, ao terminar de urinar, você teve a sensação de que ainda havia urina na bexiga.
              </p>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="esvaziou_completo"
                    value="sim"
                    checked={form.esvaziou_completo === 'sim'}
                    onChange={handleChange}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="esvaziou_completo"
                    value="nao"
                    checked={form.esvaziou_completo === 'nao'}
                    onChange={handleChange}
                  />
                  Não
                </label>
              </div>
            </div>

            {/* Gotinhas Pós */}
            <div className="form-group">
              <label>Após terminar de urinar, saíram algumas gotinhas de urina?</label>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888' }}>
                Considere se houve saída de pequenas gotas logo após terminar a micção.
              </p>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gotinhas_pos"
                    value="sim"
                    checked={form.gotinhas_pos === 'sim'}
                    onChange={handleChange}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gotinhas_pos"
                    value="nao"
                    checked={form.gotinhas_pos === 'nao'}
                    onChange={handleChange}
                  />
                  Não
                </label>
              </div>
            </div>
          </div>

          {/* Notas */}
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
                    <strong>Urgência:</strong> {record.urgencia ? 'Sim' : 'Não'}
                  </div>
                  <div className="record-detail">
                    <strong>Teve perda:</strong> {record.teve_perda ? `Sim (${record.tamanho_perda})` : 'Não'}
                  </div>
                  <div className="record-detail">
                    <strong>Esforço:</strong> {record.esforco ? 'Sim' : 'Não'}
                  </div>
                  <div className="record-detail">
                    <strong>Esvaziou completo:</strong> {record.esvaziou_completo ? 'Sim' : 'Não'}
                  </div>
                  <div className="record-detail">
                    <strong>Gotinhas pós:</strong> {record.gotinhas_pos ? 'Sim' : 'Não'}
                  </div>
                </div>
                {record.notas && <div className="record-notes">📝 {record.notas}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}