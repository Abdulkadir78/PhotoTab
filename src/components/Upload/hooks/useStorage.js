import { useState, useEffect } from "react";
import { storage, firestore, timestamp } from "../../../firebase/config";
import { v4 as uuidv4 } from "uuid";

function useStorage(user, file, caption) {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const storageId = uuidv4();
    const storageRef = storage.ref(`${user.id}/${storageId}`);
    const collectionRef = firestore.collection("posts");
    const userRef = firestore.collection("users").doc(user.id);

    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        // progress of the upload process
        const percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setProgress(percentage);
      },
      (err) => console.log(err),
      async () => {
        try {
          // getting the url from firebase storage
          const downloadUrl = await storageRef.getDownloadURL();
          setUrl(downloadUrl);

          // adding the image to the "posts" collection in firestore
          collectionRef.add({
            storageId,
            authorId: user.id,
            authorName: user.username,
            downloadUrl,
            caption,
            likes: 0,
            createdAt: timestamp(),
          });

          // incrementing the no. of posts by the user
          const snap = await userRef.get();
          let { posts } = snap.data();
          posts += 1;
          userRef.update({ posts });
        } catch (err) {
          console.log(err);
        }
      }
    );
  }, [user, file, caption]);

  return { url, progress };
}

export default useStorage;
