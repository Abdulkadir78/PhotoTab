import React from "react";
import { Link } from "react-router-dom";

function SignedOutNavbar() {
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper teal lighten-2">
          <ul className="center">
            <li className="nav-link">
              <Link to="/signup">Signup</Link>
            </li>
            <li className="nav-link">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default SignedOutNavbar;
