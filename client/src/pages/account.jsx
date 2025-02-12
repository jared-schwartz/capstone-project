import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Review from "../components/reviews";
import Comment from "../components/comments";

export default function Account({ user, setUser, setToken, token }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState(null)
  const [comments, setComments] = useState(null)

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/users/reviews/${user.id}`, {
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Failed to fetch");



        const data = await response.json();
        setReviews(data)

      } catch (ex) {
        throw new Error("empty ")
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    async function getComments() {
      try {
        const response = await fetch(`/api/users/comments/${user.id}`, {
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Failed to fetch")
        console.log("hello!")
        setComments(data)
      } catch (ex) {
        throw new Error("empty ");

      }
    }
    getComments();
  })


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
          <button className="account-page-button" onClick={handleLogout}>Log Out</button>
          <br />
          <br />
          {userData.is_admin && (
            <button className="account-page-button" onClick={() => navigate("/admin")}>Admin Panel</button>
          )}
        </div>
      ) : (
        <div>Loading user data...</div>
      )}
      <div id="reviews-and-comments">
        <h2>Reviews</h2>

        {reviews && reviews.map((review) => (
          <Review key={review.id} user={user} review={review} token={token} />
        ))}

        <h2>Comments</h2>

        {comments && <>
          {
            comments.map((comment) => <Comment comment={comment} />)
          }
        </>
        }

      </div>
    </div>
  );
}



