import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import Button from "./Button";
const SectionOne = () => {
  return (
    <div className="text-white text-xl w-4/5 flex flex-col items-center gap-[2.5rem] mx-auto font-inter font-[600]">
      <button className="text-richblack-200 flex py-4 px-6 rounded-3xl bg-richblack-800 items-center gap-2 w-1/4 shadow-sm shadow-richblack-100 hover:bg-richblue-900">
        <div>Become an Instructor</div>
        <div>
          <FaArrowRight />
        </div>
      </button>
      <div className="flex flex-col gap-4 px-[4rem] items-center">
        {" "}
        <div className="text-4xl">
          Empower Your Future with <span className="span1">Coding Skills</span>
        </div>
        <div className="px-10 font-[500] text-richblack-100 leading-6">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.{" "}
        </div>
      </div>
      <div className="space-x-8 ">
        <Button active={true} linkto={"/signup"}>Learn More</Button>
        <Button active={false} linkto={"/login"}>Book A Demo</Button>
      </div>
    </div>
  );
};

export default SectionOne;
