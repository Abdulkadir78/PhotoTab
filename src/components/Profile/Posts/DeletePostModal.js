import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { firestore, storage } from "../../../firebase/config";
import { MdDelete } from "react-icons/md";
import { Modal, Button } from "react-materialize";
import ReactTooltip from "react-tooltip";

function DeletePostModal({ post, user }) {
  const [redirect, setRedirect] = useState(false);

  const handleDelete = async () => {
    try {
      // redirect to profile
      setRedirect(true);

      const postRef = firestore.collection("posts").doc(post.id);
      const commentsRef = postRef.collection("comments");
      const userRef = firestore.collection("users").doc(user.id);

      // delete all comments on the post
      commentsRef.onSnapshot(
        (snap) =>
          snap.docs.forEach((doc) =>
            commentsRef
              .doc(doc.id)
              .delete()
              .catch((err) => console.log(err))
          ),
        (err) => console.log(err)
      );

      // delete post from firestore
      await postRef.delete();

      // decrease user's number of posts
      const doc = await userRef.get();
      let { posts } = doc.data();
      posts -= 1;
      await userRef.update({ posts });

      // delete post from firebase storage
      await storage.ref(`${user.id}/${post.storageId}`).delete();
    } catch (err) {
      console.log(err);
    }
  };

  return redirect ? (
    <Redirect to={`/${user.username}`} />
  ) : (
    <Modal
      header="Delete Post"
      actions={[
        <Button
          waves="red"
          className="red darken-3"
          style={{ marginRight: "10px" }}
          onClick={handleDelete}
          disabled={redirect}
        >
          Yes
        </Button>,
        <Button
          modal="close"
          waves="light"
          className="black"
          disabled={redirect}
        >
          Cancel
        </Button>,
      ]}
      className="center"
      trigger={
        <div className="red">
          <MdDelete
            size={30}
            className="red-text right delete-post-btn"
            data-for="delete"
            data-tip="Delete"
          />
          <ReactTooltip id="delete" place={"bottom"} effect={"solid"} />
        </div>
      }
    >
      <hr />
      <h6>Are you sure you want to delete this post?</h6>
    </Modal>
  );
}

export default DeletePostModal;
