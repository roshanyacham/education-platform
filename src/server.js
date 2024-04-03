const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import nodemailer
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Define the path for the CSV file
const csvFilePath = 'enrollmentformdata.csv';

// Function to read existing data from CSV file
const readExistingData = () => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Function to write data to CSV file
const writeDataToCSV = async (formData) => {
  try {
    const existingData = await readExistingData();
    existingData.push(formData);

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
      append: true // Append new data to existing file
    });

    await csvWriterInstance.writeRecords(existingData);
    console.log("Form data saved successfully.");
    return true;
  } catch (error) {
    console.error('Error saving form data:', error);
    return false;
  }
};

// Function to send email
const sendEmail = async (formData) => {
  try {
    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lalithahari2002@gmail.com', // Replace with your email
        pass: 'wqmx pdta gjke vgdi' // Replace with your password
      }
    });

    // Define email content
    let mailOptions = {
      from: 'lalithahari2002@gmail.com',
      to: formData.email,
      subject: 'Enrollment Form Submission Confirmation',
      text: `Dear ${formData.fullName},\n\nThank you for submitting the enrollment form. Your application has been received.\n\nBest regards,\nYour Institution`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

app.post('/save-form-data', async (req, res) => {
  try {
    const { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose } = req.body;
    const formData = { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose };

    const success = await writeDataToCSV(formData);

    if (success) {
      // Send email after saving form data
      await sendEmail(formData);
      
      res.json({ success: true, message: 'Form data saved successfully and email sent.' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save form data.' });
    }
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ success: false, message: 'Failed to save form data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
