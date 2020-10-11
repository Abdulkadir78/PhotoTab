import React from "react";
import { Modal, Button } from "react-materialize";
import Follower from "./Follower";

function FollowersModal({ visitingUser }) {
  return (
    <Modal
      header="Followers"
      actions={[
        <Button modal="close" waves="red" className="red darken-3">
          Close
        </Button>,
      ]}
      className="center"
      trigger={
        <div className="card col s8 offset-s2 m2 hoverable followers">
          <h4 className="center flow-text">{visitingUser.followers.length}</h4>
          <h5 className="center flow-text">Followers</h5>
        </div>
      }
    >
      {visitingUser.followers.length !== 0 ? (
        visitingUser.followers.map((followerId) => (
          <Follower key={followerId} followerId={followerId} />
        ))
      ) : (
        <>
          <br />
          <h6 className="grey-text">It's empty in here</h6>
        </>
      )}
    </Modal>
  );
}

export default FollowersModal;
