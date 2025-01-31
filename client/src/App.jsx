import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigations";
import Home from "./pages/home";
import Flavors from "./pages/flavors";
import Reviews from "./pages/reviews";
import Login from "./pages/login";
import Register from "./pages/register";
import FlavorDetails from "./pages/flavorDetails";



function App() {
  const [user, setUser] = useState(null); // User state
  const [token, setToken] = useState(null); // Token state

  return (
    <>
      <header>
        <Navigation user={user} />
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} token={token} />} />
          <Route path="/flavors" element={<Flavors />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flavors/:flavor_id" element={<FlavorDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
