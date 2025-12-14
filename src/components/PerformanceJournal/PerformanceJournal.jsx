import { useState } from 'react';
import { useGradeData } from '../../context/GradeDataContext';
import './PerformanceJournal.css';

const PerformanceJournal = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { gradeData } = useGradeData();
  
  const calculateAverage = (grades) => {
    if (grades.length === 0) return 0;
    const numericGrades = grades
      .map(grade => parseFloat(grade.replace(',', '.')))
      .filter(grade => !isNaN(grade) && grade >= 1 && grade <= 5);
    
    if (numericGrades.length === 0) return 0;
    
    const sum = numericGrades.reduce((total, grade) => total + grade, 0);
    return Math.round((sum / numericGrades.length) * 100) / 100;
  };
  
  const getGradeColor = (grade) => {
    const numericGrade = parseFloat(grade.replace(',', '.'));
    if (isNaN(numericGrade) || numericGrade < 1 || numericGrade > 5) return '#95a5a6';
    if (numericGrade >= 4.5) return '#27ae60';
    if (numericGrade >= 3.5) return '#f39c12';
    if (numericGrade >= 2.5) return '#e67e22';
    return '#c0392b';
  };
  
  const getSortedSubjects = () => {
    if (!gradeData || gradeData.length === 0) return [];
    
    const subjects = [...gradeData];
    
    return subjects.sort((a, b) => {
      const nameA = a[0]?.toLowerCase() || '';
      const nameB = b[0]?.toLowerCase() || '';
      const avgA = calculateAverage(a.slice(1));
      const avgB = calculateAverage(b.slice(1));
      const gradesA = a.length - 1;
      const gradesB = b.length - 1;
      
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = nameA.localeCompare(nameB);
          break;
        case 'average':
          comparison = avgA - avgB;
          break;
        case 'grades':
          comparison = gradesA - gradesB;
          break;
        default:
          comparison = nameA.localeCompare(nameB);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };
  
  const calculateOverallStats = () => {
    if (!gradeData || gradeData.length === 0) {
      return {
        totalSubjects: 0,
        totalGrades: 0,
        overallAverage: 0,
        excellentSubjects: 0,
        goodSubjects: 0,
        satisfactorySubjects: 0,
        poorSubjects: 0
      };
    }
    
    let totalGrades = 0;
    let validAverages = [];
    
    const stats = gradeData.reduce((acc, subject) => {
      const grades = subject.slice(1);
      const average = calculateAverage(grades);
      totalGrades += grades.length;
      
      if (average > 0) {
        validAverages.push(average);
        
        if (average >= 4.5) acc.excellentSubjects++;
        else if (average >= 3.5) acc.goodSubjects++;
        else if (average >= 2.5) acc.satisfactorySubjects++;
        else acc.poorSubjects++;
      }
      
      return acc;
    }, {
      excellentSubjects: 0,
      goodSubjects: 0,
      satisfactorySubjects: 0,
      poorSubjects: 0
    });
    
    const overallAverage = validAverages.length > 0 
      ? validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length
      : 0;
    
    return {
      totalSubjects: gradeData.length,
      totalGrades,
      overallAverage: Math.round(overallAverage * 100) / 100,
      ...stats
    };
  };
  
  const getPerformanceText = (average) => {
    if (average >= 4.5) return 'Отличная успеваемость';
    if (average >= 3.5) return 'Хорошая успеваемость';
    if (average >= 2.5) return 'Удовлетворительная успеваемость';
    if (average > 0) return 'Неудовлетворительная успеваемость';
    return 'Нет оценок';
  };
  
  const getPerformanceColor = (average) => {
    if (average >= 4.5) return '#27ae60';
    if (average >= 3.5) return '#f39c12';
    if (average >= 2.5) return '#e67e22';
    if (average > 0) return '#c0392b';
    return '#95a5a6';
  };
  
  const sortedSubjects = getSortedSubjects();
  const overallStats = calculateOverallStats();
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="performanceJournal">
      <div className="performanceJournal-header">
        <h2>Журнал успеваемости</h2>
        <p className="hintText">
          Обзор успеваемости по всем предметам
        </p>
      </div>
      
      {(!gradeData || gradeData.length === 0) ? (
        <div className="emptyState">
          <p className="placeholderText">Нет данных об успеваемости</p>
          <p className="hintText">Добавьте предметы и оценки в журнал оценок</p>
        </div>
      ) : (
        <>
          <div className="overallPerformance">
            <div className="performanceCard">
              <div className="performanceHeader">
                <h3>Общая успеваемость</h3>
                <span 
                  className="performanceBadge"
                  style={{ 
                    backgroundColor: getPerformanceColor(overallStats.overallAverage),
                    color: 'white'
                  }}
                >
                  {overallStats.overallAverage > 0 ? overallStats.overallAverage : '—'}
                </span>
              </div>
              <p className="performanceText">
                {getPerformanceText(overallStats.overallAverage)}
              </p>
              
              <div className="statsGrid">
                <div className="statItem">
                  <div className="statValue">{overallStats.totalSubjects}</div>
                  <div className="statLabel">Предметов</div>
                </div>
                <div className="statItem">
                  <div className="statValue">{overallStats.totalGrades}</div>
                  <div className="statLabel">Оценок</div>
                </div>
                <div className="statItem">
                  <div className="statValue">{overallStats.excellentSubjects}</div>
                  <div className="statLabel">Отлично</div>
                </div>
                <div className="statItem">
                  <div className="statValue">{overallStats.goodSubjects}</div>
                  <div className="statLabel">Хорошо</div>
                </div>
                <div className="statItem">
                  <div className="statValue">{overallStats.satisfactorySubjects}</div>
                  <div className="statLabel">Удовл.</div>
                </div>
                <div className="statItem">
                  <div className="statValue">{overallStats.poorSubjects}</div>
                  <div className="statLabel">Неуд.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sortPanel">
            <div className="sortButtons">
              <button 
                onClick={() => handleSort('name')}
                className={`sortButton ${sortBy === 'name' ? 'active' : ''}`}
              >
                По названию {getSortIcon('name')}
              </button>
              <button 
                onClick={() => handleSort('average')}
                className={`sortButton ${sortBy === 'average' ? 'active' : ''}`}
              >
                По среднему баллу {getSortIcon('average')}
              </button>
              <button 
                onClick={() => handleSort('grades')}
                className={`sortButton ${sortBy === 'grades' ? 'active' : ''}`}
              >
                По количеству оценок {getSortIcon('grades')}
              </button>
            </div>
          </div>
          
          <div className="subjectsTable">
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Предмет</th>
                  <th>Средний балл</th>
                  <th>Оценки</th>
                  <th>Успеваемость</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubjects.map((subject, index) => {
                  const subjectName = subject[0] || 'Без названия';
                  const grades = subject.slice(1);
                  const average = calculateAverage(grades);
                  const performanceText = getPerformanceText(average);
                  const performanceColor = getPerformanceColor(average);
                  
                  return (
                    <tr 
                      key={index}
                      className={selectedSubject === index ? 'selected' : ''}
                      onClick={() => setSelectedSubject(selectedSubject === index ? null : index)}
                    >
                      <td className="index">{index + 1}</td>
                      <td className="subjectName">{subjectName}</td>
                      <td className="average">
                        <span 
                          className="averageBadge"
                          style={{ backgroundColor: performanceColor }}
                        >
                          {average > 0 ? average : '—'}
                        </span>
                      </td>
                      <td className="gradesList">
                        <div className="gradesContainer">
                          {grades.map((grade, gradeIndex) => (
                            <span 
                              key={gradeIndex}
                              className="gradeBadge"
                              style={{ 
                                backgroundColor: getGradeColor(grade),
                                color: 'white'
                              }}
                              title={`Оценка: ${grade}`}
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="performance">
                        <span className="performanceIndicator" style={{ color: performanceColor }}>
                          {performanceText}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="viewButton"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubject(selectedSubject === index ? null : index);
                          }}
                        >
                          {selectedSubject === index ? 'Скрыть' : 'Подробнее'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {selectedSubject !== null && sortedSubjects[selectedSubject] && (
            <div className="subjectDetail">
              <div className="detailHeader">
                <h3>Детальная информация</h3>
                <button 
                  className="closeButton"
                  onClick={() => setSelectedSubject(null)}
                >
                  ✕
                </button>
              </div>
              
              {(() => {
                const subject = sortedSubjects[selectedSubject];
                const subjectName = subject[0] || 'Без названия';
                const grades = subject.slice(1);
                const average = calculateAverage(grades);
                const numericGrades = grades
                  .map(grade => parseFloat(grade.replace(',', '.')))
                  .filter(grade => !isNaN(grade) && grade >= 1 && grade <= 5);
                
                return (
                  <div className="detailContent">
                    <div className="detailRow">
                      <span className="detailLabel">Предмет:</span>
                      <span className="detailValue subjectNameLarge">{subjectName}</span>
                    </div>
                    
                    <div className="detailRow">
                      <span className="detailLabel">Средний балл:</span>
                      <span 
                        className="detailValue averageLarge"
                        style={{ color: getPerformanceColor(average) }}
                      >
                        {average > 0 ? average : 'Нет данных'}
                      </span>
                    </div>
                    
                    <div className="detailRow">
                      <span className="detailLabel">Всего оценок:</span>
                      <span className="detailValue">{grades.length}</span>
                    </div>
                    
                    <div className="detailRow">
                      <span className="detailLabel">Валидных оценок:</span>
                      <span className="detailValue">{numericGrades.length}</span>
                    </div>
                    
                    <div className="detailRow">
                      <span className="detailLabel">Оценки:</span>
                      <div className="gradesDetail">
                        {grades.length > 0 ? (
                          <div className="gradesGrid">
                            {grades.map((grade, index) => {
                              const numericGrade = parseFloat(grade.replace(',', '.'));
                              const isValid = !isNaN(numericGrade) && numericGrade >= 1 && numericGrade <= 5;
                              
                              return (
                                <div 
                                  key={index}
                                  className="gradeItem"
                                  style={{ 
                                    backgroundColor: getGradeColor(grade),
                                    color: 'white'
                                  }}
                                >
                                  <div className="gradeNumber">{index + 1}</div>
                                  <div className="gradeValue">{grade}</div>
                                  <div className="gradeStatus">
                                    {isValid ? '✓' : '⚠️'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="placeholderText">Оценок нет</span>
                        )}
                      </div>
                    </div>
                    
                    {average > 0 && (
                      <div className="detailRow">
                        <span className="detailLabel">Рекомендации:</span>
                        <div className="recommendations">
                          {average >= 4.5 && (
                            <p className="recommendationText success">
                              Отличные результаты! Продолжайте в том же духе.
                            </p>
                          )}
                          {average >= 3.5 && average < 4.5 && (
                            <p className="recommendationText warning">
                              Хорошие результаты. Для отличной успеваемости сосредоточьтесь на сложных темах.
                            </p>
                          )}
                          {average >= 2.5 && average < 3.5 && (
                            <p className="recommendationText warning">
                              Удовлетворительные результаты. Рекомендуется больше практики и повторения материала.
                            </p>
                          )}
                          {average > 0 && average < 2.5 && (
                            <p className="recommendationText danger">
                              Требуется дополнительная подготовка. Рекомендуется обратиться к преподавателю.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          
          <div className="performanceSummary">
            <h3>Сводка по успеваемости</h3>
            <div className="summaryGrid">
              <div className="summaryCard excellent">
                <div className="summaryHeader">
                  <h4>Отлично</h4>
                  <span className="summaryCount">{overallStats.excellentSubjects}</span>
                </div>
                <div className="summarySubjects">
                  {sortedSubjects
                    .filter(subject => calculateAverage(subject.slice(1)) >= 4.5)
                    .map((subject, index) => (
                      <span key={index} className="summarySubject">
                        {subject[0] || 'Без названия'}
                      </span>
                    ))}
                </div>
              </div>
              
              <div className="summaryCard good">
                <div className="summaryHeader">
                  <h4>Хорошо</h4>
                  <span className="summaryCount">{overallStats.goodSubjects}</span>
                </div>
                <div className="summarySubjects">
                  {sortedSubjects
                    .filter(subject => {
                      const avg = calculateAverage(subject.slice(1));
                      return avg >= 3.5 && avg < 4.5;
                    })
                    .map((subject, index) => (
                      <span key={index} className="summarySubject">
                        {subject[0] || 'Без названия'}
                      </span>
                    ))}
                </div>
              </div>
              
              <div className="summaryCard satisfactory">
                <div className="summaryHeader">
                  <h4>Удовл.</h4>
                  <span className="summaryCount">{overallStats.satisfactorySubjects}</span>
                </div>
                <div className="summarySubjects">
                  {sortedSubjects
                    .filter(subject => {
                      const avg = calculateAverage(subject.slice(1));
                      return avg >= 2.5 && avg < 3.5;
                    })
                    .map((subject, index) => (
                      <span key={index} className="summarySubject">
                        {subject[0] || 'Без названия'}
                      </span>
                    ))}
                </div>
              </div>
              
              <div className="summaryCard poor">
                <div className="summaryHeader">
                  <h4>Неуд.</h4>
                  <span className="summaryCount">{overallStats.poorSubjects}</span>
                </div>
                <div className="summarySubjects">
                  {sortedSubjects
                    .filter(subject => {
                      const avg = calculateAverage(subject.slice(1));
                      return avg > 0 && avg < 2.5;
                    })
                    .map((subject, index) => (
                      <span key={index} className="summarySubject">
                        {subject[0] || 'Без названия'}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceJournal;