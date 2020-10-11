import React from "react";
import { Col, Preloader } from "react-materialize";
import "./css/style.css";

function PostLoader() {
  return (
    <Col s={11} className="center post-loader">
      <Preloader color="green" flashing={false} size="small" />
    </Col>
  );
}

export default PostLoader;
