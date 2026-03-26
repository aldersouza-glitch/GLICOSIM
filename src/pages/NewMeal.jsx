import { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const NewMeal = () => {
  const { addMeal, updateMeal, mealRecords } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    time: format(new Date(), 'HH:mm'),
    type: 'Café da Manhã',
    food: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const existing = mealRecords.find(r => r.id === id);
      if (existing) {
        setFormData({
          time: existing.time,
          type: existing.type || 'Café da Manhã',
          food: existing.food,
          date: existing.date,
          notes: existing.notes || ''
        });
      }
    }
  }, [id, mealRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.food) return;

    const recordPayload = {
      time: formData.time,
      type: formData.type,
      food: formData.food,
      date: formData.date,
      notes: formData.notes
    };

    if (id) {
      updateMeal(id, recordPayload);
    } else {
      addMeal(recordPayload);
    }

    navigate('/history');
  };

  return (
    <div className="animated">
      <header className="page-header" style={{ justifyContent: 'center' }}>
        <h1 className="page-title">{id ? "Editar Refeição" : "Nova Refeição"}</h1>
      </header>

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <div className="stat-icon warning" style={{ width: 40, height: 40, borderRadius: 10 }}>
              <Utensils size={20} className="form-icon orange" />
            </div>
            <h2 className="form-title">Alimentação</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Horário da Alimentação</label>
              <input 
                type="time" 
                className="form-control" 
                required
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qual Refeição?</label>
              <select 
                className="form-control" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Jejum">Jejum</option>
                <option value="Café da Manhã">Café da Manhã</option>
                <option value="Lanche da Manhã">Lanche da Manhã</option>
                <option value="Almoço">Almoço</option>
                <option value="Lanche da Tarde">Lanche da Tarde</option>
                <option value="Jantar">Jantar</option>
                <option value="Lanche da Noite">Lanche da Noite</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">O que você comeu?</label>
              <textarea 
                className="form-control" 
                placeholder="Ex: 2 fatias de pão integral, café com leite..." 
                rows="3"
                required
                value={formData.food}
                onChange={e => setFormData({...formData, food: e.target.value})}
              ></textarea>
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
                rows="2"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary btn-orange">
              {id ? "Salvar Alterações" : "Salvar Refeição"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMeal;
