import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ user }) {
  return (
    <nav id="navbar">
      <a href="/">
        <img
          src="https://www.pngall.com/wp-content/uploads/15/Dr-Pepper-Logo-PNG-Image-HD.png"
          width="50px"
          alt="Dr Pepper Logo"
        />
      </a>
      <h1>Dr Pepper Reviews</h1>
      <div id="links">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>

        {}
        {user ? (
          <>
            <Link to="/account">My Account</Link>
          </>
        ) : null}

        {}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
