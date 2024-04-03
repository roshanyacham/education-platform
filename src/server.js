const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Define the path for the CSV file
const csvFilePath = 'form_data.csv';

app.post('/save-form-data', async (req, res) => {
  try {
    const { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose } = req.body;
    const formData = { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose };

    if (!fs.existsSync(csvFilePath)) {
      // If the CSV file doesn't exist, create it with headers
      const header = Object.keys(formData);
      const csvWriterInstance = csvWriter({ 
        path: csvFilePath,
        header: header.map(key => ({ id: key, title: key }))
      });
      await csvWriterInstance.writeRecords([formData]);
    } else {
      // If the CSV file exists, append the data to it
      const csvWriterInstance = csvWriter({ append: true, path: csvFilePath });
      await csvWriterInstance.writeRecords([formData]);
    }

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
