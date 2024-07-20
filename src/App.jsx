import React, { useRef, useState, useEffect } from "react";
import PreLoader from "./components/PreLoader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Routes,Route } from "react-router-dom";
import Home from "./Pages/Home"

const App = () => {
  const body = useRef();

  // const bodyref = useRef();
  // const logoref = useRef();
  // useGSAP(() => {
  //   var t1 = gsap.timeline();
  //   t1.to(body.current, {
  //     css: { display: "none" },
  //   });

  //   t1.to(logoref.current, {
  //     scale: 0.8,
  //     opacity: 0.8,
  //     duration: 1.5,
  //   });
  //   t1.to(bodyref.current, {
  //     y: -1600,
  //     duration: 2,
  //   });
  //   var t2 = gsap.timeline();
  //   t2.from(body.current, {
  //     css: { display: "none" },
  //     delay: 2.8
  //   });
  //   t2.from(body.current, {
  //     opacity: 0,
  //     duration: 0.5,
  //   });
  // });

  return (
    <div>
      {/* <PreLoader bodyref={bodyref} logoref={logoref}></PreLoader> */}
      <div ref={body} className="min-h-screen flex flex-col bg-richblack-900">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
