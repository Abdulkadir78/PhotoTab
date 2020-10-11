import { useState, useEffect } from "react";
import { storage, firestore } from "../../../../firebase/config";

function useStorage(user, file) {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const storageRef = storage.ref(`${user.id}/profilePic`);
    const documentRef = firestore.collection("users").doc(user.id);

    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        const percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );

        setProgress(percentage);
      },
      (err) => console.log(err),
      async () => {
        try {
          const downloadUrl = await storageRef.getDownloadURL();
          setUrl(downloadUrl);

          await documentRef.update({
            profilePic: downloadUrl,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
  }, [user, file]);

  return { url, progress };
}

export default useStorage;
