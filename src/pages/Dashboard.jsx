import { Activity, TrendingDown, TrendingUp, CalendarDays, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { glucoseRecords, mealRecords } = useData();
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  // Calculate stats
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayRecords = glucoseRecords.filter(r => r.date === todayDateStr);
  const recordsToUse = todayRecords.length > 0 ? todayRecords : glucoseRecords;

  const avg = recordsToUse.length 
    ? Math.round(recordsToUse.reduce((acc, curr) => acc + curr.value, 0) / recordsToUse.length) 
    : '--';
  const min = recordsToUse.length 
    ? Math.min(...recordsToUse.map(r => r.value)) 
    : '--';
  const max = recordsToUse.length 
    ? Math.max(...recordsToUse.map(r => r.value)) 
    : '--';

  // Chart data
  const chartData = [...recordsToUse]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(-7); // Last 7 records for the chart

  // Recent lists
  const recentGlucose = [...glucoseRecords]
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
    .slice(0, 3);
  
  const recentMeals = [...mealRecords]
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
    .slice(0, 3);

  const getDateLabel = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleDownloadReport = () => {
    let report = `RELATÓRIO DIÁRIO GLICOTRACK\n`;
    report += `Data: ${today}\n`;
    report += `=========================================\n\n`;
    report += `RESUMO DO DIA:\n`;
    report += `Média: ${avg} mg/dL | Mínima: ${min} mg/dL | Máxima: ${max} mg/dL\n\n`;

    report += `[ MEDIÇÕES DE GLICOSE ]\n`;
    if (todayRecords.length === 0) {
      report += `Nenhuma medição registrada hoje.\n`;
    } else {
      [...todayRecords]
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach(r => {
          let labelStr = '';
          if (r.type === 'jejum') labelStr = '[Jejum] ';
          if (r.type === 'pos') labelStr = '[Pós-Refeição] ';
          let statusStr = '';
          if (r.type === 'jejum' && r.value > 95) statusStr = ' (ALTO)';
          if (r.type === 'pos' && r.value > 140) statusStr = ' (ALTO)';
          
          report += `- ${r.time}: ${labelStr}${r.value} mg/dL${statusStr} ${r.notes ? '- ' + r.notes : ''}\n`;
        });
    }

    const todayMeals = mealRecords.filter(r => r.date === todayDateStr);
    report += `\n[ REFEIÇÕES ]\n`;
    if (todayMeals.length === 0) {
      report += `Nenhuma refeição registrada hoje.\n`;
    } else {
      [...todayMeals]
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach(r => {
          const typeStr = r.type ? `[${r.type}] ` : '';
          report += `- ${r.time}: ${typeStr}${r.food} ${r.notes ? '(' + r.notes + ')' : ''}\n`;
        });
    }

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_GlicoTrack_${todayDateStr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animated">
      <header className="page-header">
        <div>
          <h1 className="page-title">Olá, {localStorage.getItem('glicotrack_user') || ''}</h1>
          <p className="page-subtitle">Aqui está o resumo da sua saúde hoje.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="header-action">
            <CalendarDays size={18} />
            <span>{today}</span>
          </div>
          <button 
            className="header-action" 
            style={{ cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'white', border: 'none', transition: 'opacity 0.2s' }} 
            onClick={handleDownloadReport}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Download size={18} />
            <span>Relatório</span>
          </button>
        </div>
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Média</span>
            <div className="stat-value">{avg} <span className="stat-unit">mg/dL</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Mínima</span>
            <div className="stat-value">{min} <span className="stat-unit">mg/dL</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Máxima</span>
            <div className="stat-value">{max} <span className="stat-unit">mg/dL</span></div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Tendência de Glicose</h2>
          <div className="chart-legend">
            <div className="legend-dot"></div>
            <span>Glicose</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} dx={-10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: '100%' }}>
              Nenhum dado para exibir no gráfico.
            </div>
          )}
        </div>
      </div>

      <div className="lists-grid">
        <div className="list-section">
          <div className="list-header">
            <h3 className="list-title">Últimas Medições</h3>
            <Link to="/history" className="list-action">Ver tudo</Link>
          </div>
          
          {recentGlucose.length === 0 ? (
            <div className="empty-state">
              Nenhuma medição registrada.
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '1rem', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
              {recentGlucose.map(r => (
                <div className="list-item" key={r.id}>
                  <div className="list-item-content">
                    <span className="list-item-title">{r.time}</span>
                    <span className="list-item-desc">{getDateLabel(r.date)} {r.type === 'jejum' ? '(Jejum)' : r.type === 'pos' ? '(Pós-refeição)' : ''}</span>
                  </div>
                  <div className={`list-item-value ${
                    (r.type === 'jejum' && r.value > 95) || 
                    (r.type === 'pos' && r.value > 140) ||
                    (!r.type && r.value > 110) ? 'high' : 'normal'
                  }`}>
                    {r.value} mg/dL
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="list-section">
          <div className="list-header">
            <h3 className="list-title">Últimas Refeições</h3>
            <Link to="/history" className="list-action">Ver tudo</Link>
          </div>
          
          {recentMeals.length === 0 ? (
            <div className="empty-state">
              Nenhuma refeição registrada.
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '1rem', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
              {recentMeals.map(r => (
                <div className="list-item" key={r.id}>
                  <div className="list-item-content">
                    <span className="list-item-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                      {r.type ? `[${r.type}] ` : ''}{r.food}
                    </span>
                    <span className="list-item-desc">{getDateLabel(r.date)} - {r.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
