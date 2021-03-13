import React, { useEffect, useState } from "react";
import { Row, Col } from "react-materialize";
import { firestore } from "../../../firebase/config";

function Following({ followingId }) {
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(followingId)
      .get()
      .then((doc) => setFollowing(doc.data()));
  }, [followingId, setFollowing]);

  return following ? (
    <Row>
      <Col s={4} m={2} offset="m3">
        <a href={`/users/${following.username}`}>
          <img
            src={
              following.profilePic ||
              `${process.env.PUBLIC_URL}/images/default-profile.png`
            }
            alt="profile-pic"
            className="following-pic"
          />
        </a>
      </Col>

      <Col s={4} m={1} className="following-name">
        <a href={`/users/${following.username}`}>
          <h6 className="black-text">{following.username}</h6>
        </a>
      </Col>
    </Row>
  ) : null;
}

export default Following;
