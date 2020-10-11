import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Dropdown } from "react-materialize";
import { MdNotifications, MdHome } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { auth } from "../../firebase/config";
import AddPostModal from "../Upload/AddPostModal";
import SearchModal from "../Miscellaneous/SearchModal";
import Notifications from "../Miscellaneous/Notifications";
import "./css/style.css";

function SignedInNavbar({ history, user }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        return history.push("/login");
      }
    });
    return () => unsubscribe();
  }, [history]);

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper teal lighten-2">
          <ul className="center nav-ul">
            <li className="nav-link" data-for="add-post" data-tip="Add post">
              <AddPostModal user={user} />
            </li>

            <li className="nav-link">
              <Link to="/" data-for="feed" data-tip="Feed">
                <MdHome size={20} />
              </Link>
            </li>

            <li className="nav-link" data-for="search" data-tip="Search">
              <SearchModal authUser={user} />
            </li>

            <li className="nav-link">
              <Dropdown
                options={{
                  alignment: "left",
                  coverTrigger: false,
                  constrainWidth: false,
                  closeOnClick: false,
                }}
                trigger={
                  <Link to="">
                    <MdNotifications size={20} />
                    <span className="yellow-text" id="notif-number"></span>
                  </Link>
                }
              >
                <Notifications user={user} />
              </Dropdown>
            </li>

            <li className="nav-link" data-for="profile" data-tip="Profile">
              {user && (
                <Link to={`/${user.username}`}>
                  <img
                    src={
                      user.profilePic ||
                      `${process.env.PUBLIC_URL}/images/default-profile.png`
                    }
                    alt="profile-pic"
                    className="user-profile-pic"
                  />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <ReactTooltip id="add-post" place={"bottom"} effect={"solid"} />
      <ReactTooltip id="feed" place={"bottom"} effect={"solid"} />
      <ReactTooltip id="search" place={"bottom"} effect={"solid"} />
      <ReactTooltip id="profile" place={"bottom"} effect={"solid"} />
    </div>
  );
}

export default withRouter(SignedInNavbar);
