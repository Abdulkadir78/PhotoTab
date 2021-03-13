import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "react-materialize";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { firestore, auth } from "../../firebase/config";
import checkLoginAuth from "./Functions/checkLoginAuth";
import Loader from "../Loaders/Loader";
import PageLoader from "../Loaders/PageLoader";
import Logo from "./Logo";

function Signup({ history }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  useEffect(() => {
    const unsubscribe = checkLoginAuth(history, setPageLoading);

    return () => unsubscribe();
  }, [history]);

  // to reset the form fields on unsuccessful attempt
  const reset = () => {
    setShowLoader(false);
    setPassword("");
    setConfirmPassword("");
    setPasswordType("password");
    setConfirmPasswordType("password");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setShowLoader(true);
      if (password !== confirmPassword) {
        reset();
        return setError("Passwords don't match");
      }

      let usernameTaken = false;
      const snap = await firestore.collection("users").get();

      snap.docs.forEach((doc) => {
        if (doc.data().username === username.trim().toLowerCase()) {
          reset();
          setError("Username is taken");
          usernameTaken = true;
        }
      });

      if (usernameTaken) return;

      const authUser = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      firestore.collection("users").doc(authUser.user.uid).set({
        username: username.trim().toLowerCase(),
        profilePic: "",
        bio: "",
        posts: 0,
        liked: [],
        followers: [],
        following: [],
      });
    } catch (err) {
      reset();
      setError(err.message);
    }
  };

  // for the password field in signup form
  const showHidePassword = (inputType) => {
    let toggle;

    if (inputType === "confirm") {
      toggle =
        confirmPasswordType === "password" ? (
          <BsEye
            size={25}
            className="prefix password-eye"
            onClick={() => setConfirmPasswordType("text")}
            hidden={showLoader}
          />
        ) : (
          <BsEyeSlash
            size={25}
            className="prefix password-eye"
            onClick={() => setConfirmPasswordType("password")}
            hidden={showLoader}
          />
        );
      return toggle;
    }

    toggle =
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

      <div className="container section">
        <h3 className="center">
          <AiOutlineUserAdd size={35} /> SignUp
        </h3>

        {showLoader && <Loader />}
        <h6 className="center red-text">{error}</h6>

        <form onSubmit={handleSignup} className="section">
          <Row>
            <div className="input-field col s12 m4 offset-m4">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                disabled={showLoader}
                required
                maxLength="20"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </Row>

          <Row>
            <div className="input-field col s12 m4 offset-m4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
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
                id="password"
                value={password}
                disabled={showLoader}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {showHidePassword()}
            </div>
          </Row>

          <Row>
            <div className="input-field col s12 m4 offset-m4">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                type={confirmPasswordType}
                id="confirm-password"
                value={confirmPassword}
                disabled={showLoader}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {showHidePassword("confirm")}
            </div>
          </Row>

          <div className="center">
            <button
              type="submit"
              className="waves-effect waves-light btn"
              disabled={showLoader}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="center" hidden={showLoader}>
          Have an account?{" "}
          <Link to="/login" className="teal-text text-lighten-2">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default Signup;
