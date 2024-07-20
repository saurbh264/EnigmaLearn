import React from "react";
import banner from "../../../assets/Images/banner.mp4";
import base from "../../../assets/Images/boxoffice.png";
const SectionTwo = () => {
  return (
    <div className="w-3/4 mx-auto mt-12 mb-8 text-white ">
      <div className="relative z-10 w-4/5 mx-auto my-auto  shadow-[-5px_-5px_40px_rgba(8,_112,_184,_0.7)]">
        {/* <video muted loop autoPlay>
          <source src={banner} type="video/mp4" />
        </video> */}
        <img src={base} alt="" />
        <div className="h-full w-full bg-white absolute -z-10 top-4 -right-4"></div>
      </div>
    </div>
  );
};

export default SectionTwo;
