import { createContext, useContext, useState, useEffect } from 'react';

const GradeDataContext = createContext();

export const GradeDataProvider = ({ children }) => {
  const [gradeData, setGradeData] = useState(() => {
    try {
      const savedData = localStorage.getItem('gradeJournalData');
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gradeJournalData', JSON.stringify(gradeData));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [gradeData]);
  
  return (
    <GradeDataContext.Provider value={{ gradeData, setGradeData }}>
      {children}
    </GradeDataContext.Provider>
  );
};

export const useGradeData = () => {
  const context = useContext(GradeDataContext);
  if (!context) {
    throw new Error('useGradeData must be used within a GradeDataProvider');
  }
  return context;
};