import React, { useEffect, useState } from "react";
import { firestore, auth } from "../../firebase/config";
import Post from "./Post";
import Nav from "../Navbar/Nav";
import DeletePostModal from "../Profile/Posts/DeletePostModal";
import PageLoader from "../Loaders/PageLoader";
import NotFoundPage from "../Miscellaneous/NotFoundPage";

function PostById({ match: { params }, history }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        return history.push("/login");
      }

      firestore
        .collection("users")
        .doc(authUser.uid)
        .get()
        .then((doc) => {
          setUser({ id: doc.id, ...doc.data() });
          setPageLoading(false);
        })
        .catch((err) => console.log(err));
    });

    return () => unsubscribe();
  }, [history, setUser]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("posts")
      .doc(params.id)
      .onSnapshot((snap) => {
        if (snap.data()) setPost({ id: snap.id, ...snap.data() });
      });

    return () => unsubscribe();
  }, [params.id, setPost, setPageLoading]);

  if (pageLoading) {
    return <PageLoader />;
  }

  return post && user ? (
    <>
      <Nav />
      <div className="section">
        <div className="container">
          {user && user.id === post.authorId ? (
            <DeletePostModal post={post} user={user} />
          ) : null}
        </div>

        <Post post={post} authUser={user} />
      </div>
    </>
  ) : (
    <NotFoundPage />
  );
}

export default PostById;
