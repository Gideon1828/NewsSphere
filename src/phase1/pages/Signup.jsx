import React from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="signup-backdrop">
      <div className="signup-modal">
        <div className="signup-left">
          <img src="/logo.png" alt="Logo" className="signup-logo" />
          <h2>Join NewsSphere</h2>
          <ul className="benefits">
            <li className='li-icons'><img src="/Vector1.png" alt="Google" width="30px" height="30px" /> Follow Topics</li>
            <li className='li-icons'><img src="/Vector2.png" alt="Google"width="30px" height="30px"  /> Share News</li>
            <li className='li-icons'><img src="/Vector3.png" alt="Google"width="30px" height="30px"  /> Stay Ahead</li>
          </ul>
        </div>
        <div className="signup-right">
          <input type="email" placeholder="Email" className="signup-input" />
          <input type="text" placeholder="Full name" className="signup-input" />
          <input type="password" placeholder="Password" className="signup-input" />

          <Link to="/Aftersignup1"><button className="signup-button">Continue</button></Link>

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
