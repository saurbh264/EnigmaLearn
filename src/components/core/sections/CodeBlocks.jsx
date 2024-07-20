import React from "react";
import CNTButton from "./CNTButton";
import { TypeAnimation } from "react-type-animation";
import Tilt from "react-parallax-tilt";
const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctnbtn1,
  ctnbtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    
    <Tilt glareEnable={true} glareMaxOpacity={0.8} glareColor="lightblue" glarePosition="all" glareBorderRadius="20px" className={`${position} w-3/4 mx-auto my-[8rem] gap-8 rounded-xl py-16 px-8`}>
      <div className="w-[55%] text-white font-inter flex flex-col gap-8 text-xl">
        {heading}
        {subheading}
        <div className="flex gap-8 mx-4">
          <CNTButton
            active={ctnbtn1.active}
            linkto={ctnbtn1.linkto}
            content={ctnbtn1.content}
          ></CNTButton>
          <CNTButton
            active={ctnbtn2.active}
            linkto={ctnbtn2.linkto}
            content={ctnbtn2.content}
          ></CNTButton>
        </div>
      </div>
      <div className="w-[45%] flex bg-richblack-800 px-1 py-2 relative z-10 rounded-xl ">
        <div className="flex flex-col text-center w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock]}
            repeat={3}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
          />
          <div className={`absolute top-0 left-0 -z-10 w-[350px] h-[320px] opacity-20 ${backgroundGradient} -rotate-45 rounded-full blur-lg`}></div>
        </div>
      </div>
    </Tilt>
  );
};

export default CodeBlocks;
