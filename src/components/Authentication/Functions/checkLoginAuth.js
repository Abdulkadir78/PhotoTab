import { auth } from "../../../firebase/config";

const checkLoginAuth = (history, setPageLoading) => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      return history.push("/");
    }
    setPageLoading(false);
  });

  return unsubscribe;
};

export default checkLoginAuth;
