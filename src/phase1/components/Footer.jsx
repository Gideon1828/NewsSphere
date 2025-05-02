import './Footer.css'
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='Footer-comp'>
        <footer className="footer">
        <div className="footer-links">
          <span><Link to="/Login">Login</Link></span>
          <span>About Us</span>
          <span>Help</span>
          <span>Terms</span>
          <span>Privacy Policy</span>
        </div>
        <p className="copyright">©2025 NewsSphere</p>
      </footer>
    </div>
  )
}
export default Footer