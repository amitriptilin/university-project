import { useState } from 'react';
import './GradeJournal.css';

const GradeJournal = () => {
  const [inputs, setInputs] = useState(['']);
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInputs, setEditInputs] = useState([]);

  const addInput = () => setInputs([...inputs, '']);
  const addEditInput = () => setEditInputs([...editInputs, '']);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleEditInputChange = (index, value) => {
    const newEditInputs = [...editInputs];
    newEditInputs[index] = value;
    setEditInputs(newEditInputs);
  };

  const removeInput = (index) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const removeEditInput = (index) => {
    if (editInputs.length > 1) {
      setEditInputs(editInputs.filter((_, i) => i !== index));
    }
  };

  const saveData = () => {
    const nonEmptyInputs = inputs.filter(input => input.trim() !== '');
    if (nonEmptyInputs.length > 0) {
      setItems([...items, nonEmptyInputs]);
      setInputs(['']);
      setIsAdding(false);
    }
  };

  const cancelAdding = () => {
    setInputs(['']);
    setIsAdding(false);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditInputs([]);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditInputs([...items[index]]);
  };

  const saveEdit = () => {
    const nonEmptyEditInputs = editInputs.filter(input => input.trim() !== '');
    if (nonEmptyEditInputs.length > 0 && editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = nonEmptyEditInputs;
      setItems(newItems);
      setEditingIndex(null);
      setEditInputs([]);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditInputs([]);
  };

  const getItemTitle = (itemGroup) => itemGroup[0] || 'Без названия';
  const getItemGrades = (itemGroup) => itemGroup.slice(1);

  const calculateAverageGrade = (itemGroup) => {
    const grades = getItemGrades(itemGroup);
    if (grades.length === 0) return null;
    
    const numericGrades = grades
      .map(grade => parseFloat(grade.replace(',', '.')))
      .filter(grade => !isNaN(grade) && grade >= 1 && grade <= 5);
    
    if (numericGrades.length === 0) return null;
    
    const sum = numericGrades.reduce((total, grade) => total + grade, 0);
    return Math.round((sum / numericGrades.length) * 100) / 100;
  };

  const getAverageColor = (average) => {
    if (average === null) return '#95a5a6';
    if (average >= 4.5) return '#27ae60';
    if (average >= 3.5) return '#f39c12';
    if (average >= 2.5) return '#e67e22';
    return '#c0392b';
  };

  const getAverageText = (average) => {
    if (average === null) return 'Нет валидных оценок';
    if (average >= 4.5) return 'Отлично';
    if (average >= 3.5) return 'Хорошо';
    if (average >= 2.5) return 'Удовлетворительно';
    return 'Неудовлетворительно';
  };

  const getGradeClass = (grade) => {
    const numericGrade = parseFloat(grade.replace(',', '.'));
    const isValidGrade = !isNaN(numericGrade) && numericGrade >= 1 && numericGrade <= 5;
    
    if (!isValidGrade) return 'invalidGrade';
    if (numericGrade >= 4.5) return 'excellentGrade';
    if (numericGrade >= 3.5) return 'goodGrade';
    if (numericGrade >= 2.5) return 'satisfactoryGrade';
    return 'poorGrade';
  };

  const isValidGrade = (grade) => {
    const numericGrade = parseFloat(grade.replace(',', '.'));
    return !isNaN(numericGrade) && numericGrade >= 1 && numericGrade <= 5;
  };

  const calculateOverallStats = () => {
    const allAverages = items
      .map(item => calculateAverageGrade(item))
      .filter(avg => avg !== null);
    
    if (allAverages.length === 0) return 'Нет данных';
    
    const totalAverage = allAverages.reduce((sum, avg) => sum + avg, 0) / allAverages.length;
    return Math.round(totalAverage * 100) / 100;
  };

  return (
    <div className="gradeJournal">
      <div className="gradeJournal-header">
        <h2>Журнал предметов и оценок</h2>
      </div>
      
      <div className="gradeJournal-content">
        {!isAdding && !editingIndex && (
          <button onClick={() => setIsAdding(true)} className="addButton">
            Добавить предмет
          </button>
        )}

        {isAdding && (
          <div className="addingContainer">
            <h3>Добавление нового предмета:</h3>
            <p className="hintText">
              Первое поле - название предмета, остальные - оценки (от 1 до 5)
            </p>
            
            {inputs.map((input, index) => (
              <div key={index} className="inputContainer">
                <div className="inputLabel">
                  {index === 0 ? 'Название предмета:' : `Оценка ${index}:`}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={index === 0 ? 'Введите название предмета' : 'Введите оценку (1-5)'}
                  className="textInput"
                />
                {inputs.length > 1 && (
                  <button onClick={() => removeInput(index)} className="removeInputButton">
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <div className="buttonGroup">
              <button onClick={addInput} className="actionButton successButton">
                + Добавить оценку
              </button>
              
              <button 
                onClick={saveData}
                disabled={inputs[0]?.trim() === ''}
                className={`actionButton primaryButton ${inputs[0]?.trim() === '' ? 'disabledButton' : ''}`}
              >
                Сохранить предмет
              </button>
              
              <button onClick={cancelAdding} className="actionButton secondaryButton">
                Отмена
              </button>
            </div>
          </div>
        )}

        {editingIndex !== null && (
          <div className="editingContainer">
            <h3>Редактирование предмета:</h3>
            <p className="hintText">
              Редактирование: {getItemTitle(items[editingIndex])}
            </p>
            
            {editInputs.map((input, index) => (
              <div key={index} className="inputContainer">
                <div className="inputLabel">
                  {index === 0 ? 'Название предмета:' : `Оценка ${index}:`}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleEditInputChange(index, e.target.value)}
                  placeholder={index === 0 ? 'Введите название предмета' : 'Введите оценку (1-5)'}
                  className="textInput"
                />
                {editInputs.length > 1 && index > 0 && (
                  <button onClick={() => removeEditInput(index)} className="removeInputButton">
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <div className="buttonGroup">
              <button onClick={addEditInput} className="actionButton successButton">
                + Добавить оценку
              </button>
              
              <button 
                onClick={saveEdit}
                disabled={editInputs[0]?.trim() === ''}
                className={`actionButton primaryButton ${editInputs[0]?.trim() === '' ? 'disabledButton' : ''}`}
              >
                Сохранить изменения
              </button>
              
              <button onClick={cancelEdit} className="actionButton secondaryButton">
                Отмена
              </button>
            </div>
          </div>
        )}

        <div>
          <h3>Список предметов и оценок:</h3>
          {items.length === 0 ? (
            <p className="placeholderText">Нет добавленных предметов</p>
          ) : (
            items.map((itemGroup, index) => {
              const averageGrade = calculateAverageGrade(itemGroup);
              const averageColor = getAverageColor(averageGrade);
              const averageText = getAverageText(averageGrade);
              const grades = getItemGrades(itemGroup);
              const validGradesCount = grades.filter(grade => isValidGrade(grade)).length;
              
              return (
                <div key={index} className="itemCard">
                  <div className="cardControls">
                    <button 
                      onClick={() => startEditing(index)}
                      className="controlButton editButton"
                      title="Редактировать предмет"
                    >
                      ✏️ Редакт.
                    </button>
                    <button 
                      onClick={() => removeItem(index)}
                      className="controlButton deleteButton"
                      title="Удалить предмет"
                    >
                      ✕ Удалить
                    </button>
                  </div>
                  
                  <div className="cardHeader">
                    <div style={{ flex: 1 }}>
                      <h4 className="subjectTitle">
                        {getItemTitle(itemGroup)}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="gradesContainer">
                    <strong style={{ color: '#146C94' }}>Оценки:</strong>
                    <div style={{ marginTop: '8px' }}>
                      {grades.length > 0 ? (
                        grades.map((grade, gradeIndex) => (
                          <span 
                            key={gradeIndex}
                            className={`gradeBadge ${getGradeClass(grade)}`}
                            title={isValidGrade(grade) ? '' : 'Невалидная оценка'}
                          >
                            {grade}
                            {!isValidGrade(grade) && ' ⚠️'}
                          </span>
                        ))
                      ) : (
                        <span className="placeholderText">
                          Оценок пока нет
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {averageGrade !== null && (
                    <div className="averageContainer">
                      <div 
                        className="averageBadge"
                        style={{ backgroundColor: averageColor }}
                      >
                        <div className="averageValue">
                          {averageGrade}
                        </div>
                        <div className="averageText">
                          {averageText}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="cardStats">
                    <div className="statsInfo">
                      <span>Всего оценок: {grades.length}</span>
                      {averageGrade !== null && (
                        <span>Валидных оценок: {validGradesCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="overallStats">
            <strong>Общая статистика:</strong><br />
            Всего предметов: {items.length} | 
            Всего оценок: {items.reduce((total, item) => total + (item.length - 1), 0)} |
            Общий средний балл: {calculateOverallStats()}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeJournal;