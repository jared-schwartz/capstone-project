import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

async function loginUser(credentials) {
  try {
    const response = await fetch(
      `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }
    const result = await response.json();
    return result.token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function Login({ user, setUser, token, setToken }) {
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
      setUser({ username: credentials.username }); // Customize as needed
      navigate("/dashboard"); // Redirect to your desired route
    } else {
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      <form id="login-form" onSubmit={handleSubmit}>
        <h1>
          <u>Login</u>
        </h1>
        <label>
          Username:
          <br />
          <input
            required
            name="username" // Ensure this matches the key in your credentials state
            value={credentials.username}
            type="text"
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
