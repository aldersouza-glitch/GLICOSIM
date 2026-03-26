import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialGlucoseData = [];

export const DataProvider = ({ children }) => {
  const [glucoseRecords, setGlucoseRecords] = useState(() => {
    const saved = localStorage.getItem('glicotrack_glucose_v2');
    if (saved) return JSON.parse(saved);
    return initialGlucoseData;
  });

  const [mealRecords, setMealRecords] = useState(() => {
    const saved = localStorage.getItem('glicotrack_meals_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('glicotrack_glucose_v2', JSON.stringify(glucoseRecords));
  }, [glucoseRecords]);

  useEffect(() => {
    localStorage.setItem('glicotrack_meals_v2', JSON.stringify(mealRecords));
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
