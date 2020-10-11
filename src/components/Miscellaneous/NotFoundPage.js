import React from "react";
import { Link } from "react-router-dom";
import Nav from "../Navbar/Nav";
import "./css/style.css";

function NotFoundPage() {
  return (
    <>
      <Nav />
      <div className="container center not-found">
        <h6 className="flow-text">
          The page you are looking for does not exist.{" "}
          <Link to="/" className="teal-text">
            Back to PhotoTab
          </Link>
        </h6>
      </div>
    </>
  );
}

export default NotFoundPage;
