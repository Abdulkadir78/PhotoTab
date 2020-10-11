import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Icon } from "react-materialize";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { auth } from "../../firebase/config";
import checkLoginAuth from "./Functions/checkLoginAuth";
import Loader from "../Loaders/Loader";
import PageLoader from "../Loaders/PageLoader";
import Logo from "./Logo";

function Login({ history }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  useEffect(() => {
    const unsubscribe = checkLoginAuth(history, setPageLoading);

    return () => unsubscribe();
  }, [history]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setShowLoader(true);
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setShowLoader(false);
      setError("Invalid credentials");
      setPassword("");
    }
  };

  // for the password field in login form
  const showHidePassword = () => {
    const toggle =
      passwordType === "password" ? (
        <BsEye
          size={25}
          className="prefix password-eye"
          onClick={() => setPasswordType("text")}
          hidden={showLoader}
        />
      ) : (
        <BsEyeSlash
          size={25}
          className="prefix password-eye"
          onClick={() => setPasswordType("password")}
          hidden={showLoader}
        />
      );

    return toggle;
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Logo />

      <div className="container section login-form">
        <h3 className="center">
          <Icon small>login</Icon> Login
        </h3>

        {showLoader && <Loader />}
        <h6 className="center red-text">{error}</h6>

        <form className="section" onSubmit={handleLogin}>
          <Row>
            <div className="input-field col s12 m4 offset-m4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                disabled={showLoader}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Row>

          <Row>
            <div className="input-field col s12 m4 offset-m4">
              <label htmlFor="password">Password</label>
              <input
                type={passwordType}
                value={password}
                disabled={showLoader}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {showHidePassword()}
            </div>
          </Row>

          <div className="center-align">
            <button
              type="submit"
              className="waves-effect waves-light btn"
              disabled={showLoader}
            >
              Login
            </button>
          </div>
        </form>

        <div className="center" hidden={showLoader}>
          Don't have an account?{" "}
          <Link to="/signup" className="teal-text text-lighten-2">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
