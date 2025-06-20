import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/Aftersignup');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again later.');
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      alert("Enter your registered email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setStep("otp");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to send OTP.");
    }
  };

  const handleVerifyOtpLogin = async () => {
    if (!otp || !newPassword) {
      alert("Enter OTP and new password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setStep("login");
        setPassword('');
        setOtp('');
        setNewPassword('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("OTP verification failed.");
    }
  };

  return (
    <div className="login-backdrop">
      <div className="login-modal">
        <img src="/logo.png" alt="NewsSphere Logo" className="login-logo" />
        <h2 className="login-title">Login To NewsSphere</h2>

        {step === 'login' && (
          <>
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
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="login-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="login-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="login-button" onClick={handleVerifyOtpLogin}>
              Verify OTP & Reset Password
            </button>
          </>
        )}

        <p className="login-or">or Login with</p>
        <div className="login-icons">
          <img src="/google.png" alt="Google" />
        </div>

        <p className="login-footer">
          Don’t have an Account? <Link to="/Signup">Sign up</Link>
        </p>

        <p className="login-forgot">
          Forgot password? <span style={{ color: "blue", cursor: "pointer" }} onClick={handleSendOtp}>Click here</span>
        </p>

        <p className="login-terms">
          By continuing, you accept the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
