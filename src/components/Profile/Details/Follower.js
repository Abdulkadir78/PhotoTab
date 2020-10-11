import React, { useEffect, useState } from "react";
import { Row, Col } from "react-materialize";
import { firestore } from "../../../firebase/config";

function Follower({ followerId }) {
  const [follower, setFollower] = useState(null);

  useEffect(() => {
    let mounted = true;
    firestore
      .collection("users")
      .doc(followerId)
      .get()
      .then((doc) => {
        if (mounted) {
          setFollower(doc.data());
        }
      })
      .catch((err) => console.log(err));

    return () => (mounted = false);
  }, [followerId, setFollower]);

  return (
    <Row>
      <Col s={4} m={2} offset="m3">
        <a href={follower ? `/${follower.username}` : ""}>
          <img
            src={
              (follower && follower.profilePic) ||
              `${process.env.PUBLIC_URL}/images/default-profile.png`
            }
            alt="profile-pic"
            className="follower-pic"
          />
        </a>
      </Col>

      <Col s={4} m={1} className="follower-name">
        <a href={follower ? `/${follower.username}` : ""}>
          <h6 className="black-text">{follower && follower.username}</h6>
        </a>
      </Col>
    </Row>
  );
}

export default Follower;
