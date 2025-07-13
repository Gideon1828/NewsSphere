import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from "./ScrollToTop";
import "./App.css"

import Home from "./phase1/pages/Home.jsx";
import Readnews from "./phase1/pages/Readnews.jsx";
import Login from "./phase1/pages/Login.jsx";
import Signup from "./phase1/pages/Signup.jsx";

import Categories from "./phase2/pages/Categories.jsx";
import Aftersignup from "./phase2/pages/Aftersignup.jsx";
import ReadLater from "./phase2/pages/ReadLater.jsx";
import Readarticle from "./phase2/pages/Readarticle.jsx";


const App = () => {
  return (
    <div className="page-container">
      
        <ScrollToTop/>
        <Routes>
          {/*Phase1*/}
          <Route path="/" element={<Home />} />
          <Route path="/search/:query" element={<Home />} />
          <Route path="/Readnews" element={<Readnews />} />
          <Route path="Login" element={<Login />} />
          <Route path="Signup" element={<Signup />} />
          {/*Phase2*/}
          <Route path="Categories" element={<Categories />} />
          <Route path="Aftersignup" element={<Aftersignup />} />
          <Route path="ReadLater" element={<ReadLater />} />
          <Route path="Readarticle" element={<Readarticle/>} />

          
        </Routes>
         
      
    </div>
  )
}
export default App