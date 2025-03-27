import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser, registerUser } from '../services/api'; // Import API functions
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => { // Add async here
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      console.log('Login successful:', data);
      // Store token (assuming loginUser returns it)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to subscription selection page
      navigate('/subscribe');
    } catch (error) {
      console.error('Login failed:', error);
      // Clear token if login fails? Maybe not necessary here.
      alert(`Login failed: ${error.message || 'Please check console for details'}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const registerData = await registerUser({ email, password });
      console.log('Sign up successful:', registerData);

      // Attempt to log in immediately after successful registration
      try {
        const loginData = await loginUser({ email, password });
        console.log('Auto-login after signup successful:', loginData);
        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
        }
        // Redirect to subscription selection page
        navigate('/subscribe');
      } catch (loginError) {
         console.error('Auto-login after signup failed:', loginError);
         alert(`Sign up successful, but auto-login failed: ${loginError.message || 'Please log in manually.'}`);
         // Stay on the landing page to allow manual login
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      alert(`Sign up failed: ${error.message || 'Please check console for details'}`);
    }
  };

  return (
    <div className="landing-container">
      <h1>Mosh</h1>
      <h2>Automate Your Instagram Effortlessly</h2>
      <p>
        Sign up or log in to connect your Instagram account, choose a plan,
        and let Mosh handle your content creation, scheduling, and promotion autonomously.
      </p>

      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" onClick={handleLogin}>Login</button>
          <button type="button" onClick={handleSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
