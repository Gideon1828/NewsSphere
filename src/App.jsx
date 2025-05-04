import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from "./ScrollToTop";

import Home from "./phase1/pages/Home.jsx";
import Readnews from "./phase1/pages/Readnews.jsx";
import Login from "./phase1/pages/Login.jsx";
import Signup from "./phase1/pages/Signup.jsx";

import Categories from "./phase2/pages/Categories.jsx";
import Aftersignup from "./phase2/pages/Aftersignup.jsx";


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
          <Route path="Categories" element={<Categories />} />
          <Route path="Aftersignup" element={<Aftersignup />} />

          
        </Routes>
         
      
    </div>
  )
}
export default App