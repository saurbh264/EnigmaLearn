import React, { useRef } from "react";
import Logo from "../assets/logo-white.png";

const PreLoader = ({ bodyref, logoref }) => {
  return (
    <div
      ref={bodyref}
      className="h-[100vh] bg-black fixed w-[100vw] flex justify-center items-center top-0 right-0 bottom-0 left-0 z-50"
    >
      <div>
        <img ref={logoref} src={Logo} className="opacity-0 scale-0" />
      </div>
    </div>
  );
};

export default PreLoader;
