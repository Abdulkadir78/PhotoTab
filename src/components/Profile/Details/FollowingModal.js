import React from "react";
import { Modal, Button } from "react-materialize";
import Following from "./Following";

function FollowingModal({ visitingUser }) {
  return (
    <Modal
      header="Following"
      actions={[
        <Button modal="close" waves="red" className="red darken-3">
          Close
        </Button>,
      ]}
      className="center"
      trigger={
        <div className="card col s8 offset-s2 m2 hoverable following">
          <h4 className="center flow-text">{visitingUser.following.length}</h4>
          <h5 className="center flow-text">Following</h5>
        </div>
      }
    >
      {visitingUser.following.length !== 0 ? (
        visitingUser.following.map((followingId) => (
          <Following key={followingId} followingId={followingId} />
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

export default FollowingModal;
