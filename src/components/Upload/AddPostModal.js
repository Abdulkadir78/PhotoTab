import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { Modal, Button, TextInput, Row, Col } from "react-materialize";
import Upload from "./Upload";

function AddPostModal({ user }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);

  const handlePost = (e) => {
    e.preventDefault();
    if (!file) {
      return setError("No photo selected");
    }

    // Image size should be less than 1Mb :(
    if (file.size > 1000000) {
      return setError("File too large. File size should be less than 1MB");
    }

    setInputDisable(true);
    setReady(true);
  };

  return (
    <Modal
      header="Upload"
      actions={[
        <Button
          small
          waves="red"
          modal="close"
          className="red darken-3"
          disabled={inputDisable}
        >
          Close
        </Button>,
      ]}
      options={{
        onCloseEnd: () => {
          setReady(false);
          setFile(null);
          setCaption("");
          setError(null);
        },
        dismissible: false,
      }}
      className="center"
      trigger={
        <Link to="">
          <MdAdd size={20} />
        </Link>
      }
    >
      <br />
      <form onSubmit={handlePost}>
        <Row>
          <label
            htmlFor="file"
            className={inputDisable ? "grey lighten-2 grey-text btn" : "btn"}
          >
            Choose photo
          </label>
          <h6 className="red-text text-darken-1">{error}</h6>
          <h6>{file ? file.name : null}</h6>
          <input
            type="file"
            id="file"
            accept="image/*"
            hidden
            disabled={inputDisable}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError(null);
            }}
          />
        </Row>

        <Row>
          <Col m={10} offset="m2">
            <TextInput
              data-length={500}
              m={10}
              label="Caption"
              disabled={inputDisable}
              value={caption}
              maxLength="500"
              onChange={(e) => setCaption(e.target.value)}
            />
          </Col>
        </Row>

        <Button type="submit" waves="light" disabled={inputDisable}>
          Post
        </Button>
      </form>

      {ready && file && (
        <Upload
          user={user}
          file={file}
          caption={caption}
          setFile={setFile}
          setCaption={setCaption}
          setReady={setReady}
          setInputDisable={setInputDisable}
        />
      )}
    </Modal>
  );
}

export default AddPostModal;
