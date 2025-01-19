import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


async function loginUser(credentials) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const result = await response.json();
    return result.token; 
  } catch (error) {
    console.error("Login error:", error.message);
    return null;
  }
}

async function selectUser() {
  try {
    const response = await fetch ("/api/users",{
      method: "GET",
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("It didnt work...", error);
  }
}







function Login({ setUser, setToken }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser(credentials);

    if (token) {
      setToken(token); 
      setUser({ username: credentials.username }); 
      navigate("/"); 
    } else {
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <form id="login-form" onSubmit={handleSubmit}>
        <h1>
          <u>Login</u>
        </h1>
        <label>
          Username:
          <br />
          <input
            required
            name="username"
            value={credentials.username}
            type="text"
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <br />
          <input
            required
            name="password"
            value={credentials.password}
            type="password"
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
 