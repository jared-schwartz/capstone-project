import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin({ user, setUser, setToken }) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allFlavors, setAllFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newFlavor, setNewFlavor] = useState({ name: "", description: "" });
  const [postingFlavor, setPostingFlavor] = useState(false);
  const [postFlavorError, setPostFlavorError] = useState(null);


  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await fetch(`/api/user/${user.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        const currentUser = Array.isArray(userData) ? userData.find(u => u.id === user.id) : userData;
        setUserData(currentUser);

        const usersResponse = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch all users");
        }
        const usersData = await usersResponse.json();
        setAllUsers(usersData);

        const flavorsResponse = await fetch("/api/flavors", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!flavorsResponse.ok) {
          throw new Error("Failed to fetch flavors");
        }
        const flavorsData = await flavorsResponse.json();
        setAllFlavors(flavorsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleFlavorInputChange = (e) => {
    setNewFlavor({ ...newFlavor, [e.target.name]: e.target.value });
  };

  const handlePostFlavor = async (e) => {
    e.preventDefault();
    setPostingFlavor(true);
    setPostFlavorError(null);

    try {
      const response = await fetch("/api/flavors", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlavor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post flavor");
      }

      const flavorsData = await fetch("/api/flavors", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }).then(r=>r.json());
      setAllFlavors(flavorsData);
      setNewFlavor({ name: "", description: "", photo_URL:"" });
    } catch (err) {
      setPostFlavorError(err.message);
    } finally {
      setPostingFlavor(false);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="admin-page">
      <h1><u>Admin Panel</u></h1>

      {userData ? (
        <div>
          <h2><u>Welcome, {userData.username}</u></h2>
          <div id="user-list">
            <h3>User List:</h3>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Is Admin</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.is_admin ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Flavor List:</h3>
          <div id="flavor-list">
            <table>
              <thead>
                <tr>
                  <th>Flavor Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {allFlavors.map((flavor) => (
                  <tr key={flavor.id}>
                    <td>{flavor.name}</td>
                    <td>{flavor.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div>Loading admin panel...</div>
      )}
    </div>
  );
}