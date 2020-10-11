import React from "react";
import { Navbar } from "react-materialize";
import "./css/style.css";

function Logo() {
  return (
    <Navbar
      className="teal lighten-2"
      brand={
        <a href=" " className="brand-logo">
          PhotoTab
        </a>
      }
      menuIcon={<></>}
      centerLogo
    ></Navbar>
  );
}

export default Logo;
