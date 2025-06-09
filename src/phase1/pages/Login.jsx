import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data); // ✅ Debug log

    if (response.ok) {
      alert(data.message);

      // ✅ Correct way to store token
      localStorage.setItem("token", data.token);
      // ✅ Store user info (this includes fullName)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Check if token is actually there
      if (!data.token) {
        console.error("No token found. User may not be logged in.");
        return;
      }

      navigate('/Aftersignup');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong. Please try again later.');
  }
};


  return (
    <div className="login-backdrop">
      <div className="login-modal">
        <img src="/logo.png" alt="NewsSphere Logo" className="login-logo" />
        <h2 className="login-title">Login To NewsSphere</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Continue
        </button>

        <p className="login-or">or Login with</p>

        <div className="login-icons">
          <img src="/google.png" alt="Google" />
        </div>

        <p className="login-footer">
          Don’t have an Account? <Link to="/Signup">Sign up</Link>
        </p>

        <p className="login-terms">
          By continuing, you accept the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
