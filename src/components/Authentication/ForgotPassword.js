import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "react-materialize";
import { RiKeyLine } from "react-icons/ri";

import { auth } from "../../firebase/config";
import Logo from "./Logo";
import PageLoader from "../Loaders/PageLoader";
import Loader from "../Loaders/Loader";
import checkLoginAuth from "./Functions/checkLoginAuth";

function ForgotPassword({ history }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const unsubscribe = checkLoginAuth(history, setPageLoading);

    return () => unsubscribe();
  }, [history]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccessMsg("");
      setShowLoader(true);

      await auth.sendPasswordResetEmail(email);
      setSuccessMsg("Check your email for further details");
      setShowLoader(false);
    } catch (err) {
      setError(err);
      setShowLoader(false);
    }
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Logo />

      <div className="container section reset-form">
        <h4 className="center">
          <RiKeyLine /> Forgot Password
        </h4>

        {showLoader && <Loader />}

        {error && (
          <h6 className="center red-text">
            {error.code === "auth/user-not-found"
              ? "Email address not found in our records"
              : "Something went wrong.Please try again later."}
          </h6>
        )}

        <h6 className="center green-text">{successMsg}</h6>

        <form className="section" onSubmit={handleReset}>
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

          <div className="center-align">
            <button
              type="submit"
              className="waves-effect waves-light btn"
              disabled={showLoader}
            >
              Submit
            </button>
          </div>
        </form>

        <div className="center" hidden={showLoader}>
          <Link to="/login" className="teal-text text-lighten-2">
            Go Back
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
