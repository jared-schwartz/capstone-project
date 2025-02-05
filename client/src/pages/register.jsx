import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ user, setUser, token, setToken }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    async function isUsernameTaken(username) {
        try {
            const response = await fetch ("/api/users");
            const users = await response.json();

            return users.some(user => user.username === username);
        } catch (error) {
            console.error("Error Fetching Users:", error);
            return true;
        }
    }






    async function handleCreateUser(credentials) {
        if (await isUsernameTaken(credentials.username)){
            setError("Username already taken, please choose another one.");
            return;
        }
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
                throw new Error(errorData.error || "Registration Failed");
            }

            const result = await response.json();
            console.log("Registration successful:", result);
            setToken(result.token);
            setUser(result.user);
            navigate("/login"); 
        } catch (error) {
            console.error("Registration error:", error.message);
            setError(error.message);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        setError(null); // Clear any existing errors before submitting
        handleCreateUser({ username, password });
    }

    return (
        <div id="register-form">
            <form id="form" onSubmit={handleSubmit}>
                <h1><u>Register User</u></h1>

                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <label>Username:</label>
                <br />
                <input 
                    placeholder="johndoe123"
                    required
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null); // Reset error on input change
                    }}
                />
                <br /><br />
                
                <label>Password:</label>
                <br />
                <input 
                    placeholder="********"
                    required
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null); // Reset error on input change
                    }}
                />
                <br /><br />
                
                <button type="submit">Create Account</button>
                <br /><br />
                
                <a href="./login"><b>Already have an account? Login Here</b></a>
                <p>*Password must be at least 8 characters.*</p>
            </form>
        </div>
    );
}
