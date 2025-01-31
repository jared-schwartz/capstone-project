import { Link } from "react-router-dom";

export default function Navigation({ user }) {
  return (
    <nav id="navbar">
      <a href="/"><img src="https://www.pngall.com/wp-content/uploads/15/Dr-Pepper-Logo-PNG-Image-HD.png" width="50px"></img></a>
      <h1>Dr Pepper Reviews</h1>
      <div id="links">
      <Link to="/">Home</Link>
      <Link to="/flavors">Flavors</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}