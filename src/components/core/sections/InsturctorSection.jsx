import React from "react";
import masterni from "../../../assets/Images/Instructor.png";
import Button from "./Button";
import { FaArrowRight } from "react-icons/fa";
const InsturctorSection = () => {
  return (
    <div className="flex w-3/4 text-white mx-auto py-24 gap-24">
      <div className="w-1/2">
        <img src={masterni} alt="master jin ki photo" />
      </div>
      <div className="w-1/2  font-inter flex flex-col gap-10 items-center justify-center">
        <div className="text-5xl font-bold">
          Become an <div className="span1">Instructor</div>
        </div>
        <div className="text-richblack-200">
          Instructors from around the world teach millions of students on
          StudyNotion. We provide the tools and skills to teach what you love.
        </div>
        <Button active={true} linkto={"/signup"}>
          {" "}
          <div className="flex items-center gap-2 font-semibold">
            <div>Try It Yourself</div> <FaArrowRight />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default InsturctorSection;
