import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { firestore, auth, timestamp } from "../../firebase/config";
import PostLoader from "../Loaders/PostLoader";
import moment from "moment";
import Spinner from "../Loaders/Spinner";
import ReactTooltip from "react-tooltip";
import {
  Row,
  Col,
  Card,
  CardTitle,
  Icon,
  TextInput,
  Button,
  ProgressBar,
} from "react-materialize";
import "./css/style.css";

function Post({ post, authUser, history }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(post.authorId)
      .get()
      .then((snapshot) => {
        const { username, profilePic } = snapshot.data();
        setUsername(username);
        setProfilePic(profilePic);
        setLoading(false);
      });
  }, [post, setUsername, setProfilePic, setLoading]);

  useEffect(() => {
    // check if the post is liked by the logged in user
    authUser && setLikedPosts(authUser.liked);
    likedPosts.length && likedPosts.includes(post.id)
      ? setLiked(true)
      : setLiked(false);
  }, [authUser, setLikedPosts, likedPosts, setLiked, post.id]);

  useEffect(() => {
    // get all comments on the post
    const unsubscribe = firestore
      .collection("posts")
      .doc(post.id)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snap) => {
          const documents = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(documents);
        },
        (err) => console.log(err)
      );

    return () => unsubscribe();
  }, [post.id, setComments]);

  const sendNotif = async (message) => {
    try {
      const postAuthorRef = firestore.collection("users").doc(post.authorId);

      await postAuthorRef.collection("notifications").add({
        who: authUser.username,
        message,
        postId: post.id,
        createdAt: timestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      if (!auth.currentUser) return history.push("/login");

      // return if the post is updating already
      if (showSpinner) return;

      setShowSpinner(true);
      const authUserRef = firestore.collection("users").doc(authUser.id);
      const postRef = firestore.collection("posts").doc(post.id);

      // increment or decrement likes
      const updatePost = async (action) => {
        const snap = await postRef.get();
        let { likes } = snap.data();
        action === "increment" ? (likes += 1) : (likes -= 1);
        await postRef.update({ likes });
      };

      // get liked posts of the user
      const snap = await authUserRef.get();
      const { liked } = snap.data();

      // if post is already liked then remove it from user's
      // liked posts
      if (liked.includes(post.id)) {
        const index = liked.indexOf(post.id);
        liked.splice(index, 1);
        updatePost("decrement");
        await authUserRef.update({ liked });
        setLiked(false);
        return setShowSpinner(false);
      }

      // if not already liked then add it to user's liked posts
      liked.unshift(post.id);
      updatePost("increment");
      await authUserRef.update({ liked });

      // send a notification to the post author
      if (authUser.id !== post.authorId) {
        sendNotif("liked your post");
      }

      setLiked(true);
      setShowSpinner(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    // only logged in users can comment on posts
    if (!authUser) {
      return history.push("/login");
    }

    try {
      setShowLoader(true);

      const collectionRef = firestore
        .collection("posts")
        .doc(post.id)
        .collection("comments");

      // add comment to the comments collection
      await collectionRef.add({
        text: comment,
        author: authUser.username,
        authorId: authUser.id,
        postOwnerId: post.authorId,
        createdAt: timestamp(),
      });
      setComment("");
      setShowLoader(false);

      // send notification to the post author
      if (authUser.id !== post.authorId) {
        sendNotif("commented on your post");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const commentRef = firestore
        .collection("posts")
        .doc(post.id)
        .collection("comments")
        .doc(commentId);

      await commentRef.delete();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <PostLoader />;
  }

  return (
    <Row>
      <Col m={6} s={12} offset="m3">
        <Card
          closeIcon={<Icon>close</Icon>}
          header={
            <>
              <div className="post-header">
                <Link to={`/${username}`}>
                  <img
                    src={
                      profilePic ||
                      `${process.env.PUBLIC_URL}/images/default-profile.png`
                    }
                    alt="profile-pic"
                    className="left post-profile-pic"
                  />
                </Link>
                <div className="card-title">
                  <Link to={`/${username}`} className="black-text">
                    {username}
                  </Link>
                </div>
              </div>
              <CardTitle image={post.downloadUrl}></CardTitle>
            </>
          }
          reveal={
            <div className="comments">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="comment">
                      <b>
                        <Link to={`/${comment.author}`} className="black-text">
                          {comment.author}
                        </Link>
                      </b>
                      <span> {comment.text}</span>
                      <br />
                      <small className="grey-text text-lighten-1">
                        {comment.createdAt &&
                          moment(comment.createdAt.toDate()).fromNow()}
                      </small>

                      {authUser &&
                      (comment.authorId === authUser.id ||
                        comment.postOwnerId === authUser.id) ? (
                        <MdDelete
                          size={22}
                          className="right red-text delete-btn"
                          data-for="delete"
                          data-tip="Delete"
                          onClick={() => deleteComment(comment.id)}
                        />
                      ) : null}
                    </p>

                    <ReactTooltip id="delete" place={"left"} effect={"solid"} />
                  </div>
                ))
              ) : (
                <h5 className="center flow-text">No comments</h5>
              )}
            </div>
          }
          actions={[
            <span key={post.id}>
              {liked ? (
                showSpinner ? (
                  <Spinner color="#e57373" />
                ) : (
                  <BsHeartFill
                    size={20}
                    onClick={handleLike}
                    className="red-text like-btn"
                  />
                )
              ) : showSpinner ? (
                <Spinner color="#e57373" />
              ) : (
                <BsHeart size={20} onClick={handleLike} className="like-btn" />
              )}
            </span>,
            !showSpinner ? (
              <span key={post.id + "1"}> {post.likes}</span>
            ) : null,
            comments.length > 0 && authUser ? (
              <h6
                key={post.id + "2"}
                className="activator grey-text text-lighten-1 view-comments"
              >
                View {comments.length} comment(s)
              </h6>
            ) : null,

            <form onSubmit={handleComment} key={post.id + "3"}>
              <Row>
                <TextInput
                  data-length={300}
                  s={9}
                  label="Add a comment"
                  value={comment}
                  disabled={showLoader}
                  maxLength="300"
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  disabled={!comment || comment.length > 300}
                  small
                  style={{ marginTop: "1.8rem" }}
                  waves="light"
                >
                  Post
                </Button>
                {showLoader ? (
                  <Col s={7}>
                    <span>Posting...</span>
                    <ProgressBar />
                  </Col>
                ) : null}
              </Row>
            </form>,
            <span key={post.id + "4"} className="grey-text text-lighten-1">
              {post.createdAt && moment(post.createdAt.toDate()).fromNow()}
            </span>,
          ]}
        >
          <p className="caption">
            <Link to={`/${username}`} className="black-text">
              <b>{username}</b>{" "}
            </Link>
            {post.caption}
          </p>
        </Card>
      </Col>
    </Row>
  );
}

export default Post;
