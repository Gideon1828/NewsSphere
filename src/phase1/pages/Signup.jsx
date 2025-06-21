import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'otp'

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email || !fullName || !password) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const response = await fetch('https://newssphere-wxr1.onrender.com/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // e.g. "OTP sent to your email"
        setStep('otp');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch('https://newssphere-wxr1.onrender.com/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, password, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/Categories');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      alert('Something went wrong during verification.');
    }
  };

  return (
    <div className="signup-backdrop">
      <div className="signup-modal">
        <div className="signup-left">
          <img src="/logo.png" alt="Logo" className="signup-logo" />
          <h2>Join NewsSphere</h2>
          <ul className="benefits">
            <li className="li-icons">
              <img src="/Vector1.png" alt="Vector1" width="30px" height="30px" /> Follow Topics
            </li>
            <li className="li-icons">
              <img src="/Vector2.png" alt="Vector2" width="30px" height="30px" /> Share News
            </li>
            <li className="li-icons">
              <img src="/Vector3.png" alt="Vector3" width="30px" height="30px" /> Stay Ahead
            </li>
          </ul>
        </div>

        <div className="signup-right">
          {step === 'form' ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="signup-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Full name"
                className="signup-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="signup-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="signup-button" onClick={handleSendOtp}>Continue</button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="signup-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="signup-button" onClick={handleVerifyOtp}>Verify OTP</button>
            </>
          )}

          <p className="signup-or">or sign up with</p>
          <div className="signup-icons">
            <img src="/google.png" alt="Google" />
          </div>

          <p className="signup-footer">
            Already have an Account? <Link to="/Login">Log In</Link>
          </p>

          <p className="signup-terms">
            By continuing, you accept the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
