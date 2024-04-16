// Login.js

import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const authenticateUser = (username, password) => {
    // Here you would implement your authentication logic
    // For simplicity, let's assume a hardcoded username and password
    const validUsername = 'exampleUser';
    const validPassword = 'examplePassword';
    
    // Check if the provided username and password match the valid credentials
    return username === validUsername && password === validPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the provided credentials match any entries in the CSV file
    const isAuthenticated = authenticateUser(formData.username, formData.password);
    if (isAuthenticated) {
      // Handle successful login
      console.log('Login successful');
    } else {
      // Handle login failure
      console.error('Login failed: Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
