import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Calendar, AlertCircle, TrendingUp, Moon } from 'lucide-react';

export default function Home({ userName }) {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    micturitions: 0,
    liquids: 0,
    losses: 0,
    nocturia: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [micResponse, hydResponse, lossResponse, noctResponse] = await Promise.all([
          fetch(`${API_URL}/api/micturitions`),
          fetch('/api/hydrations'),
          fetch('/api/losses'),
          fetch('/api/nocturia'),
        ]);

        const micData = await micResponse.json();
        const hydData = await hydResponse.json();
        const lossData = await lossResponse.json();
        const noctData = await noctResponse.json();

        const today = new Date().toISOString().split('T')[0];

        const todayMic = micData.filter(
          (m) => new Date(m.timestamp).toISOString().split('T')[0] === today
        );

        const todayHyd = hydData.filter(
          (h) => new Date(h.timestamp).toISOString().split('T')[0] === today
        );

        const todayLoss = lossData.filter(
          (l) => new Date(l.timestamp).toISOString().split('T')[0] === today
        );

        const todayNoct = noctData.filter(
          (n) => new Date(n.timestamp).toISOString().split('T')[0] === today
        );

        const totalLiquids = todayHyd.reduce((sum, h) => sum + h.volume, 0) / 1000;

        setStats({
          micturitions: todayMic.length,
          liquids: totalLiquids.toFixed(2),
          losses: todayLoss.length,
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
          <h3>Noctúria</h3>
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
              meta: 2.0L
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
    </div>
  );
}