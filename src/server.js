const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3001;

// Create a new pool to manage connections to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'knowledge_hub',
  password: 'Murali@123',
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to handle form submissions
app.post('/save-form-data', async (req, res) => {
  try {
    const { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose } = req.body;
    // Insert form data into the PostgreSQL database
    await pool.query(
      'INSERT INTO form_data (full_name, email, phone, qualification, degree_type, qualification_score, statement_of_purpose) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose]
    );
    // Send a success response back to the client
    res.json({ success: true, message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error saving form data:', error);
    // Send an error response back to the client
    res.status(500).json({ success: false, message: 'Failed to save form data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
