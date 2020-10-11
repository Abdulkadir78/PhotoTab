import React from "react";
import Loader from "./Loader";
import { Row, Col } from "react-materialize";
import "./css/style.css";

function PageLoader() {
  return (
    <Row>
      <div className="valign-wrapper page-loader">
        <Col s={6} m={8} pull="s3 m2">
          <Loader />
        </Col>
      </div>
    </Row>
  );
}

export default PageLoader;
