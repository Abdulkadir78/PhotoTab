import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { Collection, CollectionItem } from "react-materialize";
import { firestore } from "../../firebase/config";
import moment from "moment";
import "./css/style.css";

function Notifications({ user }) {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const notifRef = firestore
      .collection("users")
      .doc(user.id)
      .collection("notifications");

    // get notifications sorted by date in descending order
    const unsubscribe = notifRef
      .orderBy("createdAt", "desc")
      .limit(3)
      .onSnapshot(
        (snap) => {
          const documents = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifs(documents);

          // set number of notifications in UI
          const numberOfNotifs = document.getElementById("notif-number");
          documents.length
            ? (numberOfNotifs.innerText = documents.length)
            : (numberOfNotifs.innerText = "");
        },
        (err) => console.log(err)
      );

    return () => unsubscribe();
  }, [user.id, setNotifs]);

  const removeNotif = async (notifId) => {
    try {
      const notifRef = firestore
        .collection("users")
        .doc(user.id)
        .collection("notifications");

      await notifRef.doc(notifId).delete();
    } catch (err) {
      console.log(err);
    }
  };

  return notifs.length ? (
    <Collection>
      {notifs.map((notif) => (
        <CollectionItem key={notif.id} className="notif">
          <Link
            to={notif.postId ? `/post/${notif.postId}` : `/${notif.who}`}
            className="left black-text"
          >
            <b>{notif.who} </b>
            <span> {notif.message}</span>
            <br />
            <small className="grey-text text-lighten-1">
              {moment(notif.createdAt.toDate()).fromNow()}
            </small>
          </Link>

          <MdClose
            size={18}
            className="close-icon"
            onClick={() => removeNotif(notif.id)}
          />
        </CollectionItem>
      ))}
    </Collection>
  ) : (
    <span className="notif"> No Notifications</span>
  );
}

export default Notifications;
