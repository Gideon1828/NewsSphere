import './Readnews.css'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

import { Link } from 'react-router-dom';

const Readnews = () => {
  return (
    <div>
        {/* 1. Header component */} 
        <Header />
        {/* 2. Main content */}
        <main className="Mymain">
      <div className="main-feature">
        <div className="highlight">
          <img src="/news-image.jpg" alt="headline" className="headline-img" />
          <div className="headline-content">
            <h2>
              Starmer and Macron to join Zelensky in Ukraine & Russia War
            </h2>
            <p>
              Even among the many lies and distortions in President Donald Trump’s never-ending
              address to Congress on Tuesday evening, one claim stood out. The ...
            </p>
            <p className="meta">
              Rolling Stone - Miles Klee • 8h<br />
              <Link to="/Login" className="login-read">Login To Read more</Link> 
            </p>
          </div>
        </div>
        <div className="storyboard">
          <h3>Related Storyboard</h3>
          {Array(3).fill(0).map((_, i) => (
            <Link to="/Readnews" className="article-link" key={i}>
              <div className="story-snippet">
              <img src="/news-image.jpg" alt="story" />
              <div>
                <p><b>“Hamilton Cancels Kennedy’s Center Run”</b></p>
                <span>The Hill-Flip timojita</span>
              </div>
              </div>  
            </Link>
          ))}
        </div>
      </div>

      <div className="related-articles-section">
        <h3>Related articles</h3>
        <div className="related-grid">
          {Array(6).fill(0).map((_, i) => (
            <Link to="/featured" className="article-link" key={i}>
            <div className="related-card" >
              <img src="/news-image.jpg" alt="related" />
              <div>
                <p><b>“Hamilton Cancels Kennedy’s Center Run”</b></p>
                <span>The Hill-Flip timojita</span>
              </div>
            </div>
            </Link>
          ))}
        </div>
        {/* <div className="read-more-btn">
          <button>Read More</button>
        </div> */}
      </div>
      </main>
      {/* 3. Footer component */} 
      <Footer />
    </div>
  )
}
export default Readnews