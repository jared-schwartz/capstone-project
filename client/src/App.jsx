import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigations";
import Home from "./pages/home";
import Flavors from "./pages/flavors";
import Login from "./pages/login";
import Register from "./pages/register";
import FlavorDetails from "./pages/flavorDetails";
import Account from "./pages/account";
import Admin from "./pages/admin";

function App() {

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");


  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken ? (storedToken) : null);
  //     

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  return (
    <>
      <header>
        <Navigation user={user} />
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} token={token} />} />
          <Route path="/flavors" element={<Flavors />} />
          <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />
          <Route path="/register" element={<Register setUser={setUser} setToken={setToken} />} />
          <Route path="/flavors/:flavor_id" element={<FlavorDetails user={user} token={token} />} />
          <Route path="/account" element={<Account user={user} setUser={setUser} setToken={setToken} token={token} />} />
          <Route path="/admin" element={<Admin user={user} setUser={setUser} setToken={setToken} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

