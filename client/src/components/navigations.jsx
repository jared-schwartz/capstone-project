import { Link } from "react-router-dom";

export default function Navigation({ user }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
    </nav>
  );
}