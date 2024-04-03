import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EnrollmentForm() {
  const { courseTitle } = useParams(); // Access courseTitle from URL parameters

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    degreeType: '', // Added for graduation degree type
    qualificationScore: '',
    statementOfPurpose: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [applicationNumber, setApplicationNumber] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const position = localStorage.getItem('applicationPosition');
    const applicationDate = `${year}${month}${day}`;
    setApplicationNumber(`KH${applicationDate}${position}`);
    
    // Fetch the position of the application from the server or local storage and update the state
    if (position) {
      // setPosition(parseInt(position)); // Removed as it's not used
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:3001/save-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Form data submitted successfully');
      setFormSubmitted(true); // Set formSubmitted to true upon successful submission
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Handle errors (e.g., display an error message to the user)
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Enrollment Form for {courseTitle}</h2>
      {formSubmitted ? (
        <div className="alert alert-success" role="alert">
          Form submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Application Details */}
          <fieldset>
            <legend className="text-left">Application Details</legend>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="applicationNumber" className="form-label">Application Number</label>
                <input type="text" className="form-control" id="applicationNumber" name="applicationNumber" value={applicationNumber} readOnly />
              </div>
            </div>
          </fieldset>
          {/* Personal Details */}
          <fieldset>
            <legend className="text-left">Personal Details</legend>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="col">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>
          {/* Educational Qualification */}
          <fieldset>
            <legend className="text-left">Educational Qualification</legend>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="qualification" className="form-label">Highest Qualification</label>
                <select className="form-select" id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} required>
                  <option value="">Select Qualification</option>
                  <option value="10th Class">10th Class</option>
                  <option value="12th Class">12th Class</option>
                  <option value="Graduation">Graduation</option>
                </select>
              </div>
              {formData.qualification === 'Graduation' && (
                <div className="col">
                  <label htmlFor="degreeType" className="form-label">Type of Degree</label>
                  <input type="text" className="form-control" id="degreeType" name="degreeType" value={formData.degreeType} onChange={handleChange} required />
                </div>
              )}
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="qualificationScore" className="form-label">Qualification Score</label>
                <input type="number" step="0.1" min="5" max="10" className="form-control" id="qualificationScore" name="qualificationScore" value={formData.qualificationScore} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>
          {/* Statement of Purpose */}
          <fieldset>
            <legend className="text-left">Statement of Purpose</legend>
            <div className="row mb-3">
              <div className="col">
                <textarea className="form-control" id="statementOfPurpose" name="statementOfPurpose" value={formData.statementOfPurpose} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      )}
    </div>
  );
}

export default EnrollmentForm;
