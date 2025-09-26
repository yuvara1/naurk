import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="navbar-layout">
      <div className="nav-logo">logo</div>
      <nav className="navbar">
        <div className="navlinks">home</div>
        <div className="navlinks">home</div>
        <div className="navlinks">home</div>
        <div
          className="navlinks"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          logout
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
