import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Clock, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { authHeaders } from '../auth';
import Orientacao from '../components/Orientacao';

const LIQUID_TYPES = [
  'Água',
  'Café',
  'Chá — xícara',
  'Chá — caneca',
  'Leite',
  'Suco natural',
  'Suco industrializado',
  'Refrigerante',
  'Água de coco',
  'Bebida isotônica',
  'Outra bebida',
];

const OUTRA_QUANTIDADE = 'Outra quantidade — informar em mL';

const VOLUMES = [
  { rotulo: 'Copo pequeno — 150 mL', ml: 150 },
  { rotulo: 'Copo médio — 200 mL', ml: 200 },
  { rotulo: 'Copo grande — 300 mL', ml: 300 },
  { rotulo: 'Xícara pequena — 150 mL', ml: 150 },
  { rotulo: 'Caneca — 250 mL', ml: 250 },
  { rotulo: 'Copo descartável — 180 mL', ml: 180 },
  { rotulo: 'Garrafa pequena — 500 mL', ml: 500 },
  { rotulo: OUTRA_QUANTIDADE, ml: null },
];

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

export default function Hidratacao() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    horario: agoraLocal(),
    volume_opcao: '',
    volume: '',
    tipo: 'Água',
    outra_bebida: '',
    notas: '',
  });

  const [records, setRecords] = useState([]);
  const [totalLiquids, setTotalLiquids] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/api/hydrations`, {
          headers: authHeaders(),
        });
        const data = await response.json();

        const hoje = diaLocal(new Date());
        const todayRecords = data.filter((r) => diaLocal(r.timestamp) === hoje);

        setRecords(todayRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

        const total = todayRecords.reduce((sum, r) => sum + Number(r.volume), 0);
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

  const addRecord = async (record) => {
    try {
      const response = await fetch(`${API_URL}/api/hydrations`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(record),
      });

      if (response.ok) {
        const savedRecord = await response.json();
        setRecords((prev) => [savedRecord, ...prev]);
        setTotalLiquids((prev) => prev + Number(savedRecord.volume));
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const volume =
      form.volume_opcao === OUTRA_QUANTIDADE
        ? form.volume
        : VOLUMES.find((v) => v.rotulo === form.volume_opcao)?.ml;
    if (!volume) {
      alert('Por favor, informe o volume');
      return;
    }

    addRecord({
      volume: parseInt(volume),
      tipo:
        form.tipo === 'Outra bebida' && form.outra_bebida.trim()
          ? `Outra: ${form.outra_bebida.trim()}`
          : form.tipo,
      notes: form.notas,
      timestamp: form.horario,
    });

    setForm({
      horario: agoraLocal(),
      volume_opcao: '',
      volume: '',
      tipo: 'Água',
      outra_bebida: '',
      notas: '',
    });
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

      {/* Orientação da página */}
      <Orientacao titulo="Registre os líquidos que você bebe" imagem="/ilustracao-hidratacao.webp">
        <p>
          Anote as bebidas consumidas ao longo do dia, incluindo água, café, chá, leite, sucos e
          outras bebidas. Informe o horário, o tipo de líquido e a quantidade aproximada ingerida.
        </p>
        <ul>
          <li><strong>Horário:</strong> quando você bebeu.</li>
          <li><strong>Volume (ml):</strong> quantidade ingerida.</li>
          <li><strong>Tipo de líquido:</strong> selecione a bebida correspondente.</li>
          <li><strong>Observações:</strong> campo opcional para informações que considerar relevantes.</li>
        </ul>
        <p>
          <strong>Exemplo ilustrativo:</strong> Horário 10h00 · Tipo de líquido: Água · Volume 250 ml.
        </p>
        <p>
          <strong>Atenção:</strong> mantenha sua ingestão habitual de líquidos, a menos que tenha
          recebido orientação específica de um profissional de saúde. O objetivo do registro é
          observar seus hábitos, não modificá-los por conta própria.
        </p>
      </Orientacao>

      {/* Progresso do dia */}
      <div className="hydration-progress">
        <div className="progress-label">
          <span>Total de líquidos hoje</span>
          <span>{totalLiquids} ml / 2000 ml</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
            {Math.round(progressPercentage)}%
          </div>
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
                Volume
              </label>
              <select
                id="volume_opcao"
                name="volume_opcao"
                value={form.volume_opcao}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione a quantidade
                </option>
                {VOLUMES.map(({ rotulo }) => (
                  <option key={rotulo} value={rotulo}>
                    {rotulo}
                  </option>
                ))}
              </select>
              {form.volume_opcao === OUTRA_QUANTIDADE && (
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="Informe em mL"
                  min="1"
                  required
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Líquido</label>
            <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
              {LIQUID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {form.tipo === 'Outra bebida' && (
              <input
                type="text"
                name="outra_bebida"
                value={form.outra_bebida}
                onChange={handleChange}
                placeholder="Qual bebida?"
                style={{ marginTop: '10px' }}
                required
              />
            )}
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
                    {record.tipo}
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