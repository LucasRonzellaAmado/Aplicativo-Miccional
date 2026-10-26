import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplet,
  Calendar,
  TrendingUp,
  Moon,
  CalendarDays,
  Clock,
  CalendarCheck,
  FileEdit,
} from 'lucide-react';
import { API_URL } from '../config';
import { authHeaders } from '../auth';
import Orientacao from '../components/Orientacao';

// Data local no formato AAAA-MM-DD (evita o problema do fuso UTC)
const diaLocal = (valor) => {
  const d = new Date(valor);
  return isNaN(d) ? '' : d.toLocaleDateString('en-CA');
};

const COMO_PREENCHER = [
  {
    Icone: CalendarDays,
    titulo: 'Durante 3 dias consecutivos',
    texto:
      'Preencha o diário por três dias seguidos, sem pular dias, conforme a orientação do profissional de saúde.',
  },
  {
    Icone: Clock,
    titulo: 'Durante as 24 horas do dia',
    texto:
      'Registre as micções e os líquidos consumidos durante o dia e a noite. Anote também os despertares noturnos para urinar e as demais informações solicitadas no diário.',
  },
  {
    Icone: CalendarCheck,
    titulo: 'Escolha dias mais tranquilos',
    texto:
      'Se possível, escolha três dias consecutivos em que sua rotina esteja mais tranquila, com poucos compromissos, para conseguir fazer os registros com atenção.',
  },
  {
    Icone: FileEdit,
    titulo: 'Registre ao longo do dia',
    texto:
      'Procure preencher cada informação assim que possível. Mantenha seus hábitos habituais de alimentação e ingestão de líquidos, salvo orientação diferente do profissional de saúde.',
  },
];

export default function Home({ userName }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    micturitions: 0,
    liquids: '0.00',
    losses: 0,
    nocturia: 0,
  });
  const [diaDoDiario, setDiaDoDiario] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [micResponse, hydResponse, noctResponse] = await Promise.all([
          fetch(`${API_URL}/api/micturitions`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/hydrations`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/nocturia`, { headers: authHeaders() }),
        ]);

        const micData = await micResponse.json();
        const hydData = await hydResponse.json();
        const noctData = await noctResponse.json();

        const hoje = diaLocal(new Date());
        const doDia = (lista) => lista.filter((r) => diaLocal(r.timestamp) === hoje);

        const todayMic = doDia(micData);
        const todayHyd = doDia(hydData);
        const todayNoct = doDia(noctData);

        // Dia do diário: contado a partir do primeiro registro feito
        const dias = [...micData, ...hydData, ...noctData]
          .map((r) => diaLocal(r.timestamp))
          .filter(Boolean)
          .sort();
        if (dias.length) {
          const inicio = new Date(`${dias[0]}T00:00:00`);
          const hojeMeiaNoite = new Date(`${hoje}T00:00:00`);
          setDiaDoDiario(Math.round((hojeMeiaNoite - inicio) / 86400000) + 1);
        }

        const totalLiquids = todayHyd.reduce((sum, h) => sum + Number(h.volume), 0) / 1000;

        setStats({
          micturitions: todayMic.length,
          liquids: totalLiquids.toFixed(2),
          losses: [...todayMic, ...todayNoct].filter((r) => r.teve_perda === true).length,
          nocturia: todayNoct.length,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Bem-vinda, {userName}!</h2>
        <p>Acompanhe seu diário miccional e sua hidratação diária</p>
      </div>

      {/* Spacing */}
      <div style={{ height: '40px' }}></div>

      {/* Como preencher */}
      <Orientacao titulo="Como preencher seu Diário Miccional" ilustracao="completa">
        {diaDoDiario > 0 && (
          <p style={{ marginTop: 0, fontWeight: 600, color: '#E85D75' }}>
            {diaDoDiario <= 3 ? `Dia ${diaDoDiario} de 3` : 'Período de 3 dias concluído'}
          </p>
        )}
        {COMO_PREENCHER.map(({ Icone, titulo, texto }) => (
          <div key={titulo} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div
              style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#FFE4EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icone size={20} style={{ color: '#E85D75' }} />
            </div>
            <div>
              <strong>{titulo}</strong>
              <p style={{ margin: '4px 0 0' }}>{texto}</p>
            </div>
          </div>
        ))}
      </Orientacao>

      <div style={{ height: '20px' }}></div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div
          className="action-card"
          onClick={() => navigate('/diario')}
          style={{ cursor: 'pointer' }}
        >
          <Calendar size={40} style={{ color: '#E85D75' }} />
          <h3>Diário Miccional</h3>
          <p>Registre suas micções do dia</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/hidratacao')}
          style={{ cursor: 'pointer' }}
        >
          <Droplet size={40} style={{ color: '#E85D75' }} />
          <h3>Hidratação</h3>
          <p>Acompanhe sua ingestão de líquidos</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/nocturia')}
          style={{ cursor: 'pointer' }}
        >
          <Moon size={40} style={{ color: '#E85D75' }} />
          <h3>Durante o Sono</h3>
          <p>Registre os despertares noturnos</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/historico')}
          style={{ cursor: 'pointer' }}
        >
          <TrendingUp size={40} style={{ color: '#E85D75' }} />
          <h3>Histórico</h3>
          <p>Veja seu histórico completo</p>
        </div>
      </div>

      {/* Daily Stats */}
      <div>
        <h3 style={{ color: '#E85D75', marginBottom: '20px' }}>Estatísticas de Hoje</h3>
        <div className="daily-stats">
          <div className="stat-card">
            <div className="stat-label">Micções</div>
            <div className="stat-number">{stats.micturitions}</div>
            <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
              registros hoje
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-label">Líquidos</div>
            <div className="stat-number">{stats.liquids}L</div>
            <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
              total registrado hoje
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-label">Perdas</div>
            <div className="stat-number">{stats.losses}</div>
            <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
              registros hoje
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-label">Noctúria</div>
            <div className="stat-number">{stats.nocturia}</div>
            <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
              despertares
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: '40px' }}></div>

      {/* Sobre */}
      <Orientacao titulo="Sobre o Diário Miccional">
        <p>
          O Diário Miccional é uma ferramenta de registro dos hábitos urinários e da ingestão de
          líquidos. As informações preenchidas podem auxiliar o profissional de saúde na avaliação
          dos sintomas e na identificação de padrões ao longo do dia e da noite.
        </p>
        <p>
          Preencha os registros com a maior precisão possível e siga as orientações recebidas para
          o período de acompanhamento. O diário não realiza diagnóstico e não substitui a avaliação
          de um profissional de saúde.
        </p>
      </Orientacao>
    </div>
  );
}