import React, { useEffect, useState } from "react";
import { Button } from "react-materialize";
import { Link } from "react-router-dom";
import { firestore } from "../../../firebase/config";
import PostLoader from "../../Loaders/PostLoader";
import ReactTooltip from "react-tooltip";

function LikedPost({ postId, user }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);

  useEffect(() => {
    firestore
      .collection("posts")
      .doc(postId)
      .get()
      .then((doc) => {
        // set post if it exists (not deleted)
        if (doc.data()) {
          const { downloadUrl } = doc.data();
          setPost({ id: doc.id, downloadUrl });
          return setLoading(false);
        }

        // else show a remove button to be able to remove it from
        // user's liked posts
        setShowRemoveBtn(true);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [postId, setPost, setShowRemoveBtn, setLoading]);

  const handleRemove = async () => {
    try {
      const userRef = firestore.collection("users").doc(user.id);

      const snap = await userRef.get();
      let { liked } = snap.data();
      const index = liked.indexOf(postId);
      liked.splice(index, 1);

      await userRef.update({ liked });
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <PostLoader />;
  }

  return showRemoveBtn ? (
    <div className="card hoverable">
      <div className="card-image">
        <Button
          className="black right"
          onClick={handleRemove}
          data-for="remove"
          data-tip="Remove"
        >
          &times;
        </Button>
        <ReactTooltip id="remove" place={"bottom"} effect={"solid"} />

        <img
          src={`${process.env.PUBLIC_URL}/images/post-deleted.png`}
          alt="Liked post"
        />
      </div>
    </div>
  ) : (
    <Link to={`/post/${post.id}`}>
      <img
        src={post.downloadUrl}
        alt="Liked post"
        className="responsive-img hoverable"
      />
    </Link>
  );
}

export default LikedPost;
