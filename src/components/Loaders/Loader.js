import React from "react";
import { Row, Col, ProgressBar } from "react-materialize";

function Loader() {
  return (
    <Row>
      <Col s={10} m={2} offset="s1 m5">
        <ProgressBar />
      </Col>
    </Row>
  );
}

export default Loader;
