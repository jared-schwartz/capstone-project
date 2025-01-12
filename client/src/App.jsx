import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigations";
import Home from "./pages/home";
import Flavors from "./pages/flavors";



function App() {
  const [user, setUser] = useState(null); // User state
  const [token, setToken] = useState(null); // Token state

  return (
    <>
      <header>
        <Navigation user={user} />
      </header>
      <h1>Dr Pepper</h1>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} token={token} />} />
          <Route path="/flavors" element={<Flavors />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
