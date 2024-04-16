const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import nodemailer
const app = express();
const PORT = process.env.PORT || 3001;
const bcrypt = require('bcrypt');

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
        { id: 'applicationNumber', title: 'Application Number' },
        { id: 'fullName', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'qualification', title: 'Qualification' },
        { id: 'degreeType', title: 'Degree Type' },
        { id: 'qualificationScore', title: 'Qualification Score' },
        { id: 'statementOfPurpose', title: 'Statement of Purpose' },
        { id: 'courseName', title: 'Course Name' } // Add courseName to header
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
      text: `Dear ${formData.fullName},\n\nThank you for submitting the enrollment form. Your application for the course ${formData.courseName} has been received. Your application number is ${formData.applicationNumber}. We will let you know your application status within 4 working days. \n\nBest regards,\nKnowledge Hub Team`
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

// In-memory storage for registered users (limited and not secure)
let registeredUsers = {};

// Function to register a new user
const registerUser = async (userData) => {
  try {
    const { username, password } = userData;

    // Check if username already exists
    if (registeredUsers[username]) {
      return { success: false, message: 'Username already exists' };
    }

    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store username and hashed password in memory
    registeredUsers[username] = hashedPassword;

    console.log('User registered successfully.');
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Registration failed' };
  }
};

// Function to login a user
const loginUser = async (userData) => {
  try {
    const { username, password } = userData;

    // Check if username exists
    if (!registeredUsers[username]) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, registeredUsers[username]);

    if (isPasswordValid) {
      console.log('User logged in successfully.');
      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, message: 'Login failed' };
  }
};

// ... other routes for your application ...

app.post('/register', async (req, res) => {
  const registrationResponse = await registerUser(req.body);
  if (registrationResponse.success) {
    // Redirect to login page after successful registration
    res.redirect('/login');  // Option 1: Using res.redirect
    // OR
    // res.send(`<html><head><meta http-equiv="refresh" content="0; url=login.html"></head></body></html>`); // Option 2: Sending redirect HTML
  } else {
    // Handle registration failure (e.g., send error message)
    res.json(registrationResponse);
  }
});

app.post('/login', async (req, res) => {
  const loginResponse = await loginUser(req.body);
  res.json(loginResponse);
});



// Endpoint to save form data
app.post('/save-form-data', async (req, res) => {
  try {
    const { fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose, courseName } = req.body;
    const { applicationNumber } = req.body;
    const formData = { applicationNumber, fullName, email, phone, qualification, degreeType, qualificationScore, statementOfPurpose, courseName }; // Include courseName in formData

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
