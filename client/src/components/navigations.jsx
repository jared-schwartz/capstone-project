import { Link } from "react-router-dom";

export default function Navigation({ user }) {
  return (
    <nav className="navbar">
        <h1>Dr Pepper Reviews</h1>
        <Link to="/home">Home</Link>
        <Link to="/flavors">Flavors</Link>
    </nav>
  );
}