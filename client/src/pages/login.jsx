import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function loginUser(credentials) {
  try {
    const response = await fetch("/api/login", {
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
    //console.log(result);
    return result;
  } catch (error) {
    console.error("Login error:", error.message);
    return null;
  }
}

function LoginForm({ setUser, setToken }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/login");
    }
  }, [navigate]);

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
      setToken(token.token);
      setUser(token.user);
      localStorage.setItem("token", token.token);
      navigate("/account");
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
            placeholder="johndoe123"
            required
            name="username"
            value={credentials.username}
            type="text"
            onChange={handleChange}
          />
                    <br />
        </label>
        <br />
        <label>
          Password:
          <br />
          <input
            placeholder="********"
            required
            name="password"
            value={credentials.password}
            type="password"
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <button type="submit">Login</button>
        <br />
        <br />
        <a href="./register"><b>Create An Account</b></a>
      </form>
    </div>
  );
}

export default LoginForm;
