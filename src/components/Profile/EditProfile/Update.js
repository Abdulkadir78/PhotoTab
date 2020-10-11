import React, { useEffect } from "react";
import useStorage from "./hooks/useStorage";
import Progress from "../../Loaders/Progress";

function Update({
  user,
  file,
  setFile,
  setReady,
  setInputDisable,
  setButtonDisable,
}) {
  const { url, progress } = useStorage(user, file);

  useEffect(() => {
    if (url) {
      setReady(false);
      setFile(null);
      setInputDisable(false);
    }
    setButtonDisable(true);

  }, [url, setFile, setReady, setInputDisable, setButtonDisable]);

  return <Progress progress={progress} heading="Updating" />;
}

export default Update;
