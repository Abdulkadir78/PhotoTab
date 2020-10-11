import React from "react";
import { Row, Col, ProgressBar } from "react-materialize";

function Progress({ progress, heading }) {
  return (
    <Row>
      <h6>
        {heading} ({progress}%)
      </h6>
      <Col m={8} offset="m2">
        <ProgressBar progress={progress} />
      </Col>
    </Row>
  );
}

export default Progress;
