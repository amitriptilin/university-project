import React, { useState } from 'react';
import GradeJournal from './components/GradeJournal';
import PerformanceJournal from './components/PerformanceJournal';
import './App.css';

function App() {
  const [gradeData, setGradeData] = useState([]);
  const [activeTab, setActiveTab] = useState('grades');

  return (
    <div className="App">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          Журнал оценок
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
          disabled={gradeData.length === 0}
        >
          Журнал успеваемости
        </button>
      </div>
      
      {activeTab === 'grades' && (
        <GradeJournal onDataUpdate={setGradeData} />
      )}
      
      {activeTab === 'performance' && gradeData.length > 0 && (
        <PerformanceJournal gradeData={gradeData} />
      )}
      
      {activeTab === 'performance' && gradeData.length === 0 && (
        <div className="empty-message">
          <h3>Нет данных для отображения</h3>
          <p>Добавьте предметы и оценки в журнал оценок</p>
        </div>
      )}
    </div>
  );
}

export default App;