import SectionOne from "./sections/SectionOne";
import SectionTwo from "./sections/SectionTwo";
import CodeBlocks from "./sections/CodeBlocks";
import { FaArrowRight } from "react-icons/fa";
import TimelineSection from "./sections/TimelineSection";
import Footer from "./sections/Footer";
import InsturctorSection from "./sections/InsturctorSection";
const HomePage = () => {
  return (
    <div className="pt-16 relative min-h-screen">
      <SectionOne></SectionOne>
      <SectionTwo></SectionTwo>
      <CodeBlocks
        position={`lg:flex`}
        heading={
          <div className="text-4xl font-semibold">
            Unlock your <span className="span1">Coding Potential</span> with our
            online courses.
          </div>
        }
        subheading={
          <div className="font-[500] text-richblack-100 leading-6">
            Our courses are designed and taught by industry experts who have
            years of experience in coding and are passionate about sharing their
            knowledge with you.
          </div>
        }
        ctnbtn1={{
          linkto: "/signup",
          content: (
            <div className="flex items-center gap-2">
              <div>Try It Yourself</div> <FaArrowRight />
            </div>
          ),
          active: true,
        }}
        ctnbtn2={{
          linkto: "/login",
          content: `Learn More`,
          active: false,
        }}
        codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</ title>\n<linkrel='stylesheet' href='styles.css'>\n</head>\n<body>\n<h1><a href='/'>Header</a></h1>\n<nav><a href='/One'>One</a>\n<a href='/Two'>Two</a>\n<a href='/Three'>Three</a></nav>`}
        codeColor={`text-yellow-5`}
        backgroundGradient={
          "bg-[linear-gradient(123.77deg,_#8A2BE2_-6.46%,_#FFA500_59.04%,_#F8F8FF_124.53%)]"
        }
      ></CodeBlocks>
      <CodeBlocks
        position={`lg:flex lg:flex-row-reverse`}
        heading={
          <div className="text-4xl font-semibold mt-2">
            Start <span className="span1">Coding </span>
            <br />
            <span className="span1">in Seconds</span>
          </div>
        }
        subheading={
          <div className="font-[500] text-richblack-100 leading-6">
            Go ahead, give it a try. Our hands-on learning environment means
            you'll be writing real code from your very first lesson.
          </div>
        }
        ctnbtn1={{
          linkto: "/signup",
          content: (
            <div className="flex items-center gap-2">
              <div>Continue Lesson</div> <FaArrowRight />
            </div>
          ),
          active: true,
        }}
        ctnbtn2={{
          linkto: "/login",
          content: `Learn More`,
          active: false,
        }}
        codeblock={`import React from "react"\nimport CTAButton from "./Button"\nimport TypeAnimation from "react-type-animation"\nimport { FaArrowRight } from "react-icons/fa";\nconst Home = () => {\nreturn(\n<div>Home</div>)\n}\nexport default Home;`}
        codeColor={`text-blue-5`}
        backgroundGradient={
          "bg-[linear-gradient(118.19deg,_#1FA2FF_-3.62%,_#12D8FA_50.44%,_#A6FFCB_104.51%)]"
        }
      ></CodeBlocks>
      <TimelineSection></TimelineSection>
      <InsturctorSection></InsturctorSection>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
