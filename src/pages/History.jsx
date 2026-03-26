import { useState } from 'react';
import { useData } from '../context/DataContext';

const History = () => {
  const [activeTab, setActiveTab] = useState('glucose');
  const { glucoseRecords, mealRecords } = useData();

  const getDateLabel = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const glucoseSorted = [...glucoseRecords].sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
  const mealsSorted = [...mealRecords].sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

  return (
    <div className="animated">
      <header className="page-header">
        <h1 className="page-title">Histórico</h1>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'glucose' ? 'active' : ''}`}
            onClick={() => setActiveTab('glucose')}
          >
            Glicose
          </button>
          <button 
            className={`tab ${activeTab === 'meal' ? 'active' : ''}`}
            onClick={() => setActiveTab('meal')}
          >
            Alimentação
          </button>
        </div>
      </header>

      <div className="list-section" style={{ marginTop: '2rem' }}>
        <div className="list-header" style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '1rem 1rem 0 0', border: '1px solid var(--border-color)', borderBottom: 'none', margin: 0 }}>
          <h3 className="list-title" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {activeTab === 'glucose' ? 'Medições Recentes' : 'Refeições Recentes'}
          </h3>
        </div>
        
        {activeTab === 'glucose' && glucoseSorted.length === 0 && (
          <div className="empty-state" style={{ borderRadius: '0 0 1rem 1rem', borderTop: 'none', border: '1px solid var(--border-color)', minHeight: '150px' }}>
            Nenhum registro de glicose encontrado.
          </div>
        )}

        {activeTab === 'meal' && mealsSorted.length === 0 && (
          <div className="empty-state" style={{ borderRadius: '0 0 1rem 1rem', borderTop: 'none', border: '1px solid var(--border-color)', minHeight: '150px' }}>
            Nenhum registro de refeição encontrado.
          </div>
        )}

        {activeTab === 'glucose' && glucoseSorted.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '0 0 1rem 1rem', backgroundColor: 'var(--bg-surface)' }}>
            {glucoseSorted.map(record => (
              <div className="list-item" key={record.id}>
                <div className="list-item-content">
                  <span className="list-item-title">{record.time} {record.type === 'jejum' ? '(Jejum)' : record.type === 'pos' ? '(Pós-refeição)' : ''} {record.notes ? `- ${record.notes}` : ''}</span>
                  <span className="list-item-desc">{getDateLabel(record.date)}</span>
                </div>
                <div className={`list-item-value ${
                    (record.type === 'jejum' && record.value > 95) || 
                    (record.type === 'pos' && record.value > 140) ||
                    (!record.type && record.value > 110) ? 'high' : 'normal'
                  }`}>
                  {record.value} mg/dL
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meal' && mealsSorted.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '0 0 1rem 1rem', backgroundColor: 'var(--bg-surface)' }}>
            {mealsSorted.map(record => (
              <div className="list-item" key={record.id}>
                <div className="list-item-content">
                  <span className="list-item-title">{record.time} - {record.type ? `[${record.type}] ` : ''}{record.food}</span>
                  <span className="list-item-desc">{getDateLabel(record.date)} {record.notes ? `| ${record.notes}` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
