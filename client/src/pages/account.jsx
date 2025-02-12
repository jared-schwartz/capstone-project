import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account({ user, setUser, setToken }) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${user.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const currentUser = Array.isArray(data) ? data.find(u => u.id === user.id) : data;

        setUserData(currentUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="account-page">
      <h1>My Account</h1>

      {userData ? (
        <div>
          <h2><u>Welcome, {userData.username}</u></h2>

          <p>Username: {userData.username}</p>
          <p>Admin: {userData.is_admin ? "True" : "False"}</p>
          <button onClick={handleLogout}>Log Out</button>
          <br />
          <br />
          {userData.is_admin && (
            <button onClick={() => navigate("/admin")}>Admin Panel</button>
          )}
        </div>
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
  );
}



