import React, { useEffect } from "react";
import useStorage from "./hooks/useStorage";
import Progress from "../Loaders/Progress";

function Upload({
  user,
  file,
  caption,
  setFile,
  setCaption,
  setReady,
  setInputDisable,
}) {
  const { url, progress } = useStorage(user, file, caption);

  useEffect(() => {
    if (url) {
      setReady(false);
      setFile(null);
      setCaption("");
      setInputDisable(false);
    }
  }, [url, setFile, setCaption, setReady, setInputDisable]);

  return <Progress progress={progress} heading="Uploading" />;
}

export default Upload;
