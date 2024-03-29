// App.js
import React, { useState } from 'react';
import './App.css';
import CourseList from './CourseList';

function App() {
  // State for filters
  const [filters, setFilters] = useState({
    subjectArea: '',
    duration: '',
    startDate: ''
  });

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <div className="App">
      <header>
        <h1>Knowledge Hub</h1>
      </header>
      <main>
        <div className="search-bar">
          {/* Larger search input field */}
          <input type="text" placeholder="Search courses..." style={{ width: '80%', padding: '8px', borderRadius: '4px', marginRight: '8px' }} />
          <button type="button" style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
            Search
          </button>
        </div>
        <div className="filters">
          {/* Filter options */}
          <div className="filter-option">
            <label htmlFor="subjectArea">Filter by Subject Area/Category:</label>
            <select id="subjectArea" onChange={(e) => handleFilterChange('subjectArea', e.target.value)}>
              <option value="">All</option>
              <option value="IT Software">IT Software</option>
              <option value="Humanities">Humanities</option>
              <option value="Sciences">Sciences</option>
              <option value="Statistics">Statistics</option>
            </select>
          </div>
          <div className="filter-option">
            <label htmlFor="duration">Filter by Course Duration/Period:&ensp;</label>
            <select id="duration" onChange={(e) => handleFilterChange('duration', e.target.value)}>
              <option value="">All</option>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>
          </div>
          <div className="filter-option">
            <label htmlFor="startDate">Filter by Start Date:</label>
            <input type="date" id="startDate" onChange={(e) => handleFilterChange('startDate', e.target.value)} />
          </div>
        </div>
        <CourseList filters={filters} />
      </main>
    </div>
  );
}

export default App;
