const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Define the path for the CSV file
const csvFilePath = 'enrollmentformdata.csv';
app.post('/save-form-data', async (req, res) => {
  try {
    const { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose } = req.body;
    const formData = { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose };

    const csvWriterInstance = csvWriter({ 
      path: csvFilePath,
      header: [
        { id: 'fullName', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'qualification', title: 'Qualification' },
        { id: 'degreeType', title: 'Degree Type' },
        { id: 'qualificationScore', title: 'Qualification Score' },
        { id: 'statementOfPurpose', title: 'Statement of Purpose' }
      ],
      append: true // Append to existing file
    });

    await csvWriterInstance.writeRecords([formData]);

    console.log("Form data saved successfully.");
    res.json({ success: true, message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ success: false, message: 'Failed to save form data.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
