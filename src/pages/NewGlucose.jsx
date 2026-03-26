import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const NewGlucose = () => {
  const { addGlucose, updateGlucose, glucoseRecords } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    value: '',
    time: format(new Date(), 'HH:mm'),
    date: new Date().toISOString().split('T')[0],
    type: 'jejum',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const existing = glucoseRecords.find(r => r.id === id);
      if (existing) {
        setFormData({
          value: existing.value,
          time: existing.time,
          date: existing.date,
          type: existing.type || 'jejum',
          notes: existing.notes || ''
        });
      }
    }
  }, [id, glucoseRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.value) return;
    
    const recordPayload = {
      value: Number(formData.value),
      time: formData.time,
      date: formData.date,
      type: formData.type,
      notes: formData.notes
    };

    if (id) {
      updateGlucose(id, recordPayload);
    } else {
      addGlucose(recordPayload);
    }
    
    navigate('/history');
  };

  return (
    <div className="animated">
      <header className="page-header" style={{ justifyContent: 'center' }}>
        <h1 className="page-title">{id ? "Editar Medição" : "Nova Medição"}</h1>
      </header>

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <div className="stat-icon primary" style={{ width: 40, height: 40, borderRadius: 10 }}>
              <Activity size={20} className="form-icon" />
            </div>
            <h2 className="form-title">Glicose</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Valor (mg/dL)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ex: 110" 
                  required
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Horário da Medição</label>
                <input 
                  type="time" 
                  className="form-control" 
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Medição</label>
              <select 
                className="form-control" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="jejum">Em Jejum (Referência: até 95 mg/dL)</option>
                <option value="pos">Após Refeições (Referência: até 140 mg/dL)</option>
                <option value="other">Outro Momento</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Data do Registro</label>
              <input 
                type="date" 
                className="form-control" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notas (opcional)</label>
              <textarea 
                className="form-control" 
                placeholder="Ex: Senti tontura, cansaço..." 
                rows="3"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">
              {id ? "Salvar Alterações" : "Salvar Medição"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGlucose;
