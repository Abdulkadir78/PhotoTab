import React, { useState } from "react";
import { firestore, storage } from "../../../firebase/config";
import { Modal, Button, TextInput, Row, Col, Icon } from "react-materialize";
import ReactTooltip from "react-tooltip";
import Update from "./Update";
import Loader from "../../Loaders/Loader";

function EditProfileModal({ user }) {
  const [file, setFile] = useState(null);
  const [bio, setBio] = useState(user.bio);
  const [ready, setReady] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleFileChange = (imageFile) => {
    if (imageFile) {
      setFile(imageFile);

      // Size of profile pic should be less than 1MB :(
      if (imageFile.size > 1000000) {
        setButtonDisable(true);
        return setError("File too large. File size should be less than 1MB");
      }

      setError(null);
      return setButtonDisable(false);
    }

    setFile(null);
    setError(null);
    if (bio !== user.bio) {
      return setButtonDisable(false);
    }
    setButtonDisable(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (error) {
        return setButtonDisable(true);
      }

      if (file) {
        setInputDisable(true);
        setReady(true);
      }

      // Update the bio only if it was changed
      if (bio !== user.bio) {
        setButtonDisable(true);
        setShowLoader(true);
        setInputDisable(true);
        
        await firestore.collection("users").doc(user.id).update({ bio });
        setInputDisable(false);
        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeProfilePic = async () => {
    try {
      setShowLoader(true);

      // remove profile pic from firestore's user document
      await firestore
        .collection("users")
        .doc(user.id)
        .update({ profilePic: "" });

      // remove the pic from firebase storage
      await storage.ref(`${user.id}/profilePic`).delete();

      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      header="Edit Profile"
      actions={[
        <Button
          modal="close"
          waves="red"
          className="red darken-3"
          disabled={ready || inputDisable}
        >
          Close
        </Button>,
      ]}
      options={{
        dismissible: false,
      }}
      className="center"
      trigger={<Button className="btn">Edit Profile</Button>}
    >
      <div>
        {user.profilePic ? (
          <Button
            floating
            small
            icon={<Icon>remove</Icon>}
            className="black remove-btn"
            onClick={removeProfilePic}
            disabled={ready}
            data-for="remove"
            data-tip="Remove"
          />
        ) : null}
        <ReactTooltip id="remove" place={"right"} effect={"solid"} />

        <img
          src={
            user.profilePic ||
            `${process.env.PUBLIC_URL}/images/default-profile.png`
          }
          alt="profile-pic"
          className="edit-profile-pic"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <Row>
          <label
            htmlFor="profile-pic"
            className={
              ready || inputDisable ? "grey lighten-2 grey-text btn" : "btn"
            }
          >
            Change profile picture
          </label>
          <h6 className="red-text text-darken-1">{error}</h6>
          <h6>{file ? file.name : null}</h6>
          <input
            type="file"
            id="profile-pic"
            accept="image/*"
            hidden
            disabled={ready || inputDisable}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </Row>

        <Row>
          <Col m={10} offset="m2">
            <TextInput
              data-length={200}
              label="Bio"
              m={10}
              disabled={ready || inputDisable}
              value={bio}
              maxLength="200"
              onChange={(e) => {
                const {
                  target: { value },
                } = e;
                setBio(value);
                ((value !== user.bio && bio.length <= 200) || file) && !error
                  ? setButtonDisable(false)
                  : setButtonDisable(true);
              }}
            />
          </Col>

          <Col m={10} offset="m2">
            <TextInput label="Username" m={10} value={user.username} disabled />
          </Col>

          <Col m={10} offset="m2">
            <TextInput label="Email" m={10} value={user.email} disabled />
          </Col>
        </Row>

        <Button type="submit" waves="light" disabled={ready || buttonDisable}>
          Update
        </Button>
      </form>

      {showLoader ? <Loader /> : null}

      {ready && file && (
        <Update
          user={user}
          file={file}
          setFile={setFile}
          setReady={setReady}
          setInputDisable={setInputDisable}
          setButtonDisable={setButtonDisable}
        />
      )}
    </Modal>
  );
}

export default EditProfileModal;
