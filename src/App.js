import "./Styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

// Get components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Get pages
import Home from "./pages/Home";
import Movies from "./pages/All_Movies";
import IndividualMovie from "./pages/Individual_Movie";
import Individuals from "./pages/Individuals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";
import Unauthorised from "./pages/Unauthorised";
import Logout from "./pages/Logout";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Home");

  // Retrieve user's email when the application is loaded
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email != undefined || email != null) setLoggedIn(true);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <div className = "page-contents">
          <Header isLoggedIn={loggedIn} activePage={activePage}/>

          <Routes>
            <Route path="/" element={<Home setActivePage={setActivePage}/>} />
            <Route path="/all_movies" element={<Movies setActivePage={setActivePage}/>} />
            <Route path="/movie" element={<IndividualMovie setActivePage={setActivePage}/>} />
            <Route path="/individuals" element={<Individuals setActivePage={setActivePage}/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setActivePage={setActivePage}/>} />
            <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} setActivePage={setActivePage}/>} />
            <Route path="/register" element={<Register setActivePage={setActivePage}/>} />
            <Route path="/unauthorised" element={<Unauthorised />} />
            <Route path="*" element={<Error404 />} />
          </Routes>

        </div>

        <Footer className = "footer-pin"/>
      </div>
    </BrowserRouter>
  );
}
