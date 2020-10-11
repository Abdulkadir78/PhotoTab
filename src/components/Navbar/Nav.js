import React, { useState, useEffect } from "react";
import { Navbar } from "react-materialize";
import { firestore, auth } from "../../firebase/config";
import SignedInNavbar from "./SignedInNavbar";
import SignedOutNavbar from "./SignedOutNavbar";

function Nav(props) {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsub = () => {};
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        unsub = firestore
          .collection("users")
          .doc(authUser.uid)
          .onSnapshot(
            (snap) => setUser({ id: snap.id, ...snap.data() }),
            (err) => console.log(err)
          );
      }

      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    });

    return () => {
      unsubscribe();
      unsub();
    };
  }, [setUser, props.history]);

  if (pageLoading) {
    return <Navbar className="teal lighten-2" menuIcon={<></>}></Navbar>;
  }

  return user ? <SignedInNavbar user={user} /> : <SignedOutNavbar />;
}

export default Nav;
