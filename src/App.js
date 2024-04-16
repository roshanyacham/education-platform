import React, { useState } from 'react';
import './App.css';
import CourseList from './CourseList';
import EnrollmentForm from './EnrollmentForm';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './authContext';

function App() {
  // Define searchQuery and related functions here
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Define handleFilterChange and filters here
  const [filters, setFilters] = useState({
    subjectArea: '',
    duration: '',
    startDate: ''
  });

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header>
            <h1>Knowledge Hub</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/enroll/:courseId/:courseTitle" element={<EnrollmentForm />} />
              {/* Default route to redirect to login page */}
              <Route path="/dashboard" element={<Dashboard filters={filters} searchQuery={searchQuery} handleFilterChange={handleFilterChange} handleSearchInputChange={handleSearchInputChange} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Dashboard component with CourseList
function Dashboard({ filters, searchQuery, handleFilterChange, handleSearchInputChange }) {
  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search courses..."
          style={{
            width: '80%',
            padding: '8px',
            borderRadius: '4px',
            marginRight: '8px',
          }}
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="filters">
        <div className="filter-option">
          <label htmlFor="subjectArea">
            Filter by Subject Area/Category:
          </label>
          <select
            id="subjectArea"
            onChange={(e) =>
              handleFilterChange('subjectArea', e.target.value)
            }
          >
            <option value="">All</option>
            <option value="IT Software">IT Software</option>
            <option value="Humanities">Humanities</option>
            <option value="Sciences">Sciences</option>
            <option value="Statistics">Statistics</option>
          </select>
        </div>
        <div className="filter-option">
          <label htmlFor="duration">
            Filter by Course Duration/Period:&ensp;
          </label>
          <select
            id="duration"
            onChange={(e) =>
              handleFilterChange('duration', e.target.value)
            }
          >
            <option value="">All</option>
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </div>
        <div className="filter-option">
          <label htmlFor="startDate">Filter by Start Date:</label>
          <input
            type="date"
            id="startDate"
            onChange={(e) =>
              handleFilterChange('startDate', e.target.value)
            }
          />
        </div>
      </div>
      <CourseList filters={filters} searchQuery={searchQuery} />
    </div>
  );
}

export default App;
