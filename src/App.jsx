import ScrollToTop from "./ScrollToTop";
import Home from "./phase1/pages/Home.jsx";
import Readnews from "./phase1/pages/Readnews.jsx";
import Login from "./phase1/pages/Login.jsx";
import Signup from "./phase1/pages/Signup.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      
        <ScrollToTop/>
        <Routes>
          {/*Phase1*/}
          <Route path="/" element={<Home />} />
          <Route path="/Readnews" element={<Readnews />} />
          <Route path="Login" element={<Login />} />
          <Route path="Signup" element={<Signup />} />
          {/*Phase2*/}
          
          
        </Routes>
         
      
    </div>
  )
}
export default App