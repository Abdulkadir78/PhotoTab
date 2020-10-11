import React from "react";

function Posts({ visitingUser }) {
  return (
    <div className="card col s8 offset-s2 m2 offset-m3 hoverable posts">
      <h4 className="center flow-text">{visitingUser.posts}</h4>
      <h5 className="center flow-text">Posts</h5>
    </div>
  );
}

export default Posts;
