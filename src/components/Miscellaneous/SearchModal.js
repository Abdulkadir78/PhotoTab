import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Row, Col, TextInput } from "react-materialize";
import { MdSearch } from "react-icons/md";
import { firestore } from "../../firebase/config";

function SearchModal({ authUser }) {
  const [usernameField, setUsernameField] = useState("");
  const [users, setUsers] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setInputDisable(true);
      const snap = await firestore.collection("users").get();
      let searchResult = [];

      snap.docs.forEach((doc) => {
        if (
          doc.data().username.includes(usernameField.trim().toLowerCase()) &&
          doc.data().username !== authUser.username
        ) {
          const { username, profilePic } = doc.data();
          searchResult.push({ id: doc.id, username, profilePic });
        }
      });

      if (!searchResult.length) {
        setUsers([]);
        return setNotFound(true);
      }

      setUsers(searchResult);
      setNotFound(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      header="Search"
      actions={[
        <Button modal="close" waves="red" className="red darken-3">
          Close
        </Button>,
      ]}
      options={{
        onCloseEnd: () => {
          setUsernameField("");
          setUsers([]);
          setNotFound(false);
          setInputDisable(false);
        },
      }}
      className="center"
      trigger={
        <Link to="">
          <MdSearch size={20} />
        </Link>
      }
    >
      <br />

      <form onSubmit={handleSubmit}>
        <Row>
          <Col s={12} m={9} offset="m3">
            <TextInput
              label="Username"
              s={12}
              m={9}
              value={usernameField}
              required
              onChange={(e) => {
                setUsernameField(e.target.value);
                setInputDisable(false);
                setNotFound(false);
                setUsers([]);
              }}
            />
          </Col>
        </Row>

        <Button type="submit" disabled={inputDisable} waves="light">
          Search
        </Button>
      </form>
      <br />
      <br />

      {notFound ? <h4 className="flow-text">No results</h4> : null}

      {users.map((user) => (
        <Row key={user.id}>
          <Col s={4} m={2} offset="m3">
            <a href={`/${user.username}`}>
              <img
                src={
                  user.profilePic ||
                  `${process.env.PUBLIC_URL}/images/default-profile.png`
                }
                alt="profile-pic"
                className="profile-pic"
              />
            </a>
          </Col>

          <Col s={4} m={1}>
            <a href={`/${user.username}`}>
              <h6 className="black-text">{user.username}</h6>
            </a>
          </Col>
        </Row>
      ))}
    </Modal>
  );
}

export default SearchModal;
