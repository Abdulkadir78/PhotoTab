import React, { useEffect, useState } from "react";
import { Row } from "react-materialize";
import { firestore, auth } from "../../../firebase/config";
import Nav from "../../Navbar/Nav";
import LikedPost from "./LikedPost";
import PageLoader from "../../Loaders/PageLoader";
import ScrollToTopOnMount from "../../Miscellaneous/ScrollToTopOnMount";
import Masonry from "react-masonry-css";

function LikedPosts(props) {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { usernameL } = props.match.params;

  useEffect(() => {
    let unsub = () => {};
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        return props.history.push("/login");
      }

      unsub = firestore
        .collection("users")
        .doc(authUser.uid)
        .onSnapshot(
          (snap) => {
            const { username } = snap.data();
            // users can only see their own liked posts
            if (username !== usernameL) {
              return props.history.push(`/${usernameL}`);
            }

            setUser({ id: snap.id, ...snap.data() });
            setPageLoading(false);
          },
          (err) => console.log(err)
        );
    });

    return () => {
      unsub();
      unsubscribe();
    };
  }, [usernameL, setUser, props.history]);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTopOnMount />

      <Nav />
      <Row className="container section">
        {user && user.liked.length ? (
          <Masonry
            breakpointCols={{
              default: 3,
              800: 2,
              500: 1,
            }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {user.liked.map((postId) => (
              <LikedPost key={postId} postId={postId} user={user} />
            ))}
          </Masonry>
        ) : (
          <>
            <h5 className="center grey-text flow-text">No liked posts</h5>
          </>
        )}
      </Row>
    </>
  );
}

export default LikedPosts;
