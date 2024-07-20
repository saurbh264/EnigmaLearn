import React from "react";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import Img1 from "../../../assets/Images/Know_your_progress.svg"
import Img2 from "../../../assets/Images/Compare_with_others.svg"
import Img3 from "../../../assets/Images/Plan_your_lessons.svg"
import Button from "./Button";

const TimeLine = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    Heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className="bg-white">
        <div className="mt w-3/4 flex mx-auto py-20">
            <div className="w-1/2 text-4xl font-bold px-2">Get the skills you need for a <span className="span1">job that is in demand.</span></div>
            <div className="w-1/2 flex flex-col gap-8 items-center"><div className="text-richblack-700">The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</div>
            <Button active={true} linkto={"/signup"} className="font-semibold">Learn More</Button></div>
        </div>

      <div className="flex flex-col lg:flex-row gap-7 mb-20 items-center bg-white">
        <div className="lg:w-[50%] flex  py-4 flex-col lg:pl-40 gap-12 lg:gap-3 poppins-medium">
          {TimeLine.map((ele, i) => {
            return (
              <div className="flex flex-col lg:gap-2" key={i}>
                <div className="flex gap-6" key={i}>
                  <div className="w-[52px] h-[52px] bg-white rounded-full flex shadow-[#00000012] shadow-[0_0_62px_0]">
                    <img src={ele.Logo} alt="" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[18px]">{ele.Heading}</h2>
                    <p className="text-base">{ele.Description}</p>
                  </div>
                </div>
                <div
                  className={`hidden ${
                    TimeLine.length - 1 === i ? "none" : "lg:block"
                  }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
            {/* Section 1 */}
            <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
              <h1 className="text-3xl font-bold w-[75px]">10</h1>
              <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
                Years experiences
              </h1>
            </div>

            {/* Section 2 */}
            <div className="flex gap-5 items-center lg:px-14 px-7">
              <h1 className="text-3xl font-bold w-[75px]">250</h1>
              <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
                types of courses
              </h1>
            </div>
            <div></div>
          </div>
          <img
            src={TimeLineImage}
            alt="timelineImage"
            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
          />
        </div>
      </div>

      <div className="mt-12 w-3/4 mx-auto pt-5 pb-12 text-center ">
        <div className="text-4xl font-inter font-semibold ">
          Your Swiss Knife for{" "}
          <span className="span1">learning any language</span>
        </div>
        <div className="text-richblack-200 text-xl w-3/4 mx-auto mt-2 ">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className="relative h-[50vh] w-3/4 mx-auto mt-8">
            <img src={Img1} className="absolute top-4 left-2 mx-auto"/>
            <img src={Img2} className="absolute -top-8 left-52"/>
            <img src={Img3}  className="absolute -top-8 right-0"/>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
