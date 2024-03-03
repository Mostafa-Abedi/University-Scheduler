import React, { useState } from 'react';
import './App.css';

function App() {
  const [schedules, setSchedules] = useState([]);
  const [scheduleName, setScheduleName] = useState('');
  const [numTerms, setNumTerms] = useState(0);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(null);
  const [courseNames, setCourseNames] = useState([]);

  const handleAddSchedule = () => {
    const newCourseNames = new Array(numTerms).fill([]);
    setCourseNames(newCourseNames);
    setSchedules([...schedules, { name: scheduleName, numTerms, courses: new Array(numTerms).fill([]) }]);
    setScheduleName('');
    setNumTerms(0);
  };

  const handleAddCourse = (termIndex) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[selectedScheduleIndex].courses[termIndex] = [...updatedSchedules[selectedScheduleIndex].courses[termIndex], { name: courseNames[selectedScheduleIndex][termIndex], id: Math.random() }];
    setSchedules(updatedSchedules);
    const newCourseNames = [...courseNames];
    newCourseNames[selectedScheduleIndex][termIndex] = '';
    setCourseNames(newCourseNames);
  };

  const handleDragStart = (e, termIndex, courseIndex) => {
    e.dataTransfer.setData('termIndex', termIndex);
    e.dataTransfer.setData('courseIndex', courseIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetTermIndex) => {
    const sourceTermIndex = e.dataTransfer.getData('termIndex');
    const courseIndex = e.dataTransfer.getData('courseIndex');

    if (sourceTermIndex !== targetTermIndex) {
      const updatedSchedules = [...schedules];
      const courseToMove = updatedSchedules[selectedScheduleIndex].courses[sourceTermIndex][courseIndex];
      updatedSchedules[selectedScheduleIndex].courses[sourceTermIndex] = updatedSchedules[selectedScheduleIndex].courses[sourceTermIndex].filter((_, index) => index !== courseIndex);
      updatedSchedules[selectedScheduleIndex].courses[targetTermIndex].push(courseToMove);
  
      setSchedules(updatedSchedules);
    }
  };

  const handleCourseNameChange = (e, termIndex, courseIndex) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[selectedScheduleIndex].courses[termIndex][courseIndex].name = e.target.value;
    setSchedules(updatedSchedules);
  };

  const handleDeleteCourse = (termIndex, courseIndex) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[selectedScheduleIndex].courses[termIndex] = updatedSchedules[selectedScheduleIndex].courses[termIndex].filter((_, index) => index !== courseIndex);
    setSchedules(updatedSchedules);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h2>Program Schedules</h2>
        <ul id="schedule-list">
          {schedules.map((schedule, index) => (
            <li key={index} onClick={() => setSelectedScheduleIndex(index)}>{schedule.name}</li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="Enter Schedule Name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Number of Terms"
            value={numTerms}
            onChange={(e) => setNumTerms(parseInt(e.target.value))}
          />
          <button onClick={handleAddSchedule}>Create Schedule</button>
        </div>
      </div>
      <div className="right-section">
        {selectedScheduleIndex !== null && (
          <div className="term-container">
            {schedules[selectedScheduleIndex].courses.map((termCourses, termIndex) => (
              <div key={termIndex} className="term-column" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, termIndex)}>
                <h3>Term {termIndex + 1}</h3>
                <ul>
                  {termCourses.map((course, courseIndex) => (
                    <li key={course.id} draggable onDragStart={(e) => handleDragStart(e, termIndex, courseIndex)}>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => handleCourseNameChange(e, termIndex, courseIndex)}
                        onDoubleClick={(e) => e.target.focus()}
                        onBlur={(e) => e.target.blur()}
                      />
                      <button onClick={() => handleDeleteCourse(termIndex, courseIndex)}>X</button>
                    </li>
                  ))}
                </ul>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Course Name"
                    value={courseNames[selectedScheduleIndex][termIndex]}
                    onChange={(e) => {
                      const newCourseNames = [...courseNames];
                      newCourseNames[selectedScheduleIndex][termIndex] = e.target.value;
                      setCourseNames(newCourseNames);
                    }}
                  />
                  <button onClick={() => handleAddCourse(termIndex)}>Add Course</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;