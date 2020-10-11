import React from "react";
import { Preloader, TailSpin } from "react-preloader-icon";

function Spinner({ color }) {
  return (
    <Preloader
      use={TailSpin}
      size={25}
      strokeWidth={7}
      strokeColor={color}
      duration={800}
    />
  );
}

export default Spinner;
