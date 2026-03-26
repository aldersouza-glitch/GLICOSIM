import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialGlucoseData = [
  { id: '1', value: 95, time: '08:00', date: new Date().toISOString().split('T')[0], notes: 'Após acordar' },
  { id: '2', value: 110, time: '11:00', date: new Date().toISOString().split('T')[0], notes: '' },
  { id: '3', value: 105, time: '14:00', date: new Date().toISOString().split('T')[0], notes: 'Após o almoço' },
  { id: '4', value: 120, time: '18:00', date: new Date().toISOString().split('T')[0], notes: '' },
  { id: '5', value: 100, time: '21:00', date: new Date().toISOString().split('T')[0], notes: 'Antes de dormir' },
];

export const DataProvider = ({ children }) => {
  const [glucoseRecords, setGlucoseRecords] = useState(() => {
    const saved = localStorage.getItem('glico_glucose');
    if (saved) return JSON.parse(saved);
    return initialGlucoseData;
  });

  const [mealRecords, setMealRecords] = useState(() => {
    const saved = localStorage.getItem('glico_meals');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('glico_glucose', JSON.stringify(glucoseRecords));
  }, [glucoseRecords]);

  useEffect(() => {
    localStorage.setItem('glico_meals', JSON.stringify(mealRecords));
  }, [mealRecords]);

  const addGlucose = (record) => {
    setGlucoseRecords(prev => [...prev, { ...record, id: Date.now().toString() }]);
  };

  const addMeal = (record) => {
    setMealRecords(prev => [...prev, { ...record, id: Date.now().toString() }]);
  };

  return (
    <DataContext.Provider value={{ glucoseRecords, setGlucoseRecords, mealRecords, setMealRecords, addGlucose, addMeal }}>
      {children}
    </DataContext.Provider>
  );
};
