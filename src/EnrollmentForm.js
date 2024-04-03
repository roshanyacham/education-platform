import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function EnrollmentForm() {
  const { courseTitle } = useParams(); // Access courseTitle from URL parameters

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    degreeType: '', // Added for graduation degree type
    qualificationScore: '',
    statementOfPurpose: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    // Validation for full name (only alphabets)
    if (name === 'fullName' && value !== '' && !/^[a-zA-Z ]+$/.test(value)) {
      alert('Full Name should contain only alphabets.');
      return;
    }

    // Validation for phone number (only numbers and length equal to 10)
    if (name === 'phone' && value.length === 10) {
      const isValid = /^[0-9]{10}$/g.test(value);
      if (!isValid) {
        alert('Mobile number should be a 10-digit number.');
        return;
      }
    }
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
      // Optionally, you can redirect the user to a success page or perform any other action here
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Handle errors (e.g., display an error message to the user)
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Enrollment Form for {courseTitle}</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default EnrollmentForm;
