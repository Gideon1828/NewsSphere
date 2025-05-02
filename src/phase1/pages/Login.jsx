import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login-backdrop">
      <div className="login-modal">
        <img src="/logo.png" alt="NewsSphere Logo" className="login-logo" />
        <h2 className="login-title">Login To NewsSphere</h2>

        <input type="email" placeholder="Email" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />

        <Link to="/afterLogin"><button className="login-button">Continue</button></Link>

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
