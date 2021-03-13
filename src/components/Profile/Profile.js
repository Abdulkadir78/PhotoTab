import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-materialize";
import { MdCheck, MdAdd } from "react-icons/md";
import { firestore, auth, timestamp } from "../../firebase/config";
import Nav from "../Navbar/Nav";
import EditProfileModal from "./EditProfile/EditProfileModal";
import Posts from "./Details/Posts";
import FollowersModal from "./Details/FollowersModal";
import FollowingModal from "./Details/FollowingModal";
import NotFoundPage from "../Miscellaneous/NotFoundPage";
import PageLoader from "../Loaders/PageLoader";
import Spinner from "../Loaders/Spinner";
import ScrollToTopOnMount from "../Miscellaneous/ScrollToTopOnMount";
import Masonry from "react-masonry-css";
import "./css/style.css";

function Profile(props) {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [visitingUser, setVisitingUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const { username } = props.match.params;

  useEffect(() => {
    let unsub = () => {};

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        unsub = firestore
          .collection("users")
          .doc(authUser.uid)
          .onSnapshot(
            (snap) =>
              setUser({ id: snap.id, email: authUser.email, ...snap.data() }),
            (err) => console.log(err)
          );
      }
    });

    return () => {
      unsub();
      unsubscribe();
    };
  }, [setUser]);

  useEffect(() => {
    // get the logged in user's posts
    const unsubscribe = firestore
      .collection("posts")
      .where("authorName", "==", username)
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let imageUrls = [];
        snap.docs.forEach((doc) => {
          const { downloadUrl } = doc.data();
          imageUrls.push({
            id: doc.id,
            downloadUrl,
          });
        });

        setPhotos(imageUrls);
      });

    return () => unsubscribe();
  }, [username, setPhotos]);

  useEffect(() => {
    const unsubscribe = firestore.collection("users").onSnapshot((snap) => {
      snap.docs.forEach((doc) => {
        if (doc.data().username === username) {
          // visiting user is the one whose profile is being visited
          setVisitingUser({ id: doc.id, ...doc.data() });
        }
      });
      setPageLoading(false);
    });
    return () => unsubscribe();
  }, [username, setVisitingUser]);

  const handleFollow = async () => {
    try {
      if (!user) return props.history.push("/login");
      if (showSpinner) return;

      setShowSpinner(true);
      const userRef = firestore.collection("users").doc(user.id);
      const visitingUserRef = firestore
        .collection("users")
        .doc(visitingUser.id);
      const notifRef = visitingUserRef.collection("notifications");

      const { following } = user;
      const { followers } = visitingUser;

      // if the logged in user already follows the visiting user
      // then unfollow the visiting user
      if (following.includes(visitingUser.id)) {
        const index = following.indexOf(visitingUser.id);
        following.splice(index, 1);
        await userRef.update({ following });

        const visitingIndex = followers.indexOf(user.id);
        followers.splice(visitingIndex, 1);
        await visitingUserRef.update({ followers });
        setShowSpinner(false);
        return;
      }

      // follow the visiting user
      following.unshift(visitingUser.id);
      followers.unshift(user.id);
      userRef.update({ following });
      visitingUserRef.update({ followers });

      // send a notification to the visiting user
      await notifRef.add({
        who: user.username,
        message: "started following you",
        createdAt: timestamp(),
      });

      setShowSpinner(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return visitingUser ? (
    <>
      <ScrollToTopOnMount />

      <Nav />
      <div className="center">
        <br />
        <br />
        <img
          src={
            visitingUser.profilePic ||
            `${process.env.PUBLIC_URL}/images/default-profile.png`
          }
          alt="profile-pic"
          className="profile-picture"
        />
        <h4 className="teal-text text-lighten-2 flow-text">
          @{visitingUser.username}
        </h4>
      </div>

      <Row>
        <Col s={10} m={4} offset="s1 m4">
          <p className="center bio">{visitingUser.bio}</p>
        </Col>
      </Row>

      <div className="center">
        {user && user.username === username ? (
          <>
            <EditProfileModal user={user} />
            <Button
              onClick={() => auth.signOut()}
              className="logout-btn white teal-text"
            >
              Logout
            </Button>
          </>
        ) : user && user.following.includes(visitingUser.id) ? (
          <Button
            className="white black-text"
            onClick={handleFollow}
            disabled={showSpinner}
          >
            {showSpinner ? (
              <Spinner color="#4db6ac" />
            ) : (
              <span>
                Following <MdCheck />
              </span>
            )}
          </Button>
        ) : user ? (
          <Button onClick={handleFollow} disabled={showSpinner}>
            {showSpinner ? (
              <Spinner color="#4db6ac" />
            ) : (
              <span>
                Follow <MdAdd />
              </span>
            )}
          </Button>
        ) : (
          <div className="logged-out"></div>
        )}
      </div>
      <br />

      <Row>
        <Posts visitingUser={visitingUser} />
        <FollowersModal visitingUser={visitingUser} />
        <FollowingModal visitingUser={visitingUser} />
      </Row>

      <div className="center">
        {user && visitingUser && user.id === visitingUser.id ? (
          <Link to={`/users/${user.username}/liked`}>
            <Button>Liked Posts</Button>
          </Link>
        ) : null}
      </div>
      <br />

      <Row className="container">
        {photos.length ? (
          <Masonry
            breakpointCols={{
              default: 3,
              800: 2,
              500: 1,
            }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {photos.map((photo) => (
              <Link to={`/post/${photo.id}`} key={photo.id}>
                <img
                  src={photo.downloadUrl}
                  alt="post"
                  className="responsive-img hoverable"
                />
              </Link>
            ))}
          </Masonry>
        ) : (
          <>
            <h5 className="center grey-text flow-text">No posts yet</h5>
            <br />
          </>
        )}
      </Row>
    </>
  ) : (
    <NotFoundPage />
  );
}

export default Profile;
