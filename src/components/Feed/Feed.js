import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../firebase/config";
import Nav from "../Navbar/Nav";
import Post from "../Posts/Post";
import PageLoader from "../Loaders/PageLoader";
import ScrollToTopOnMount from "../Miscellaneous/ScrollToTopOnMount";

function Feed(props) {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  let flag = true;

  useEffect(() => {
    // check user's auth state (logged in or not)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        return props.history.push("/login");
      }

      // set user state
      firestore
        .collection("users")
        .doc(authUser.uid)
        .get()
        .then((doc) => setUser({ id: doc.id, ...doc.data() }))
        .catch((err) => console.log(err));
    });

    return () => unsubscribe();
  }, [setUser, props.history]);

  useEffect(() => {
    // get posts sorted by date in descending order
    const unsubscribe = firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const documents = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(documents);
        setPageLoading(false);
      });

    return () => unsubscribe();
  }, [setPosts, setPageLoading]);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTopOnMount />

      <Nav />
      <h2 className="center flow-text">
        Welcome,{" "}
        <span className="teal-text text-lighten-2">
          {user && user.username}
        </span>
      </h2>
      <div className="section">
        {posts.length
          ? posts.map((post) => {
              if (
                user &&
                user.following &&
                (user.following.includes(post.authorId) ||
                  user.id === post.authorId)
              ) {
                flag = false;
                return <Post key={post.id} post={post} authUser={user} />;
              }
              return null;
            })
          : null}
      </div>

      {flag && (
        <p className="center grey-text flow-text">
          It's empty in here
          <br />
          Start following people to see their posts.
        </p>
      )}
    </>
  );
}

export default Feed;
