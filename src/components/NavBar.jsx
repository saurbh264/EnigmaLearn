import React from "react";
import Logo from "../assets/Logo/logo-v7.png";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

const NavBar = () => {
  return (
    <div className="bg-richblack-900 text-richblack-100 flex justify-around p-[1rem] items-center poppins-medium text-xl border-b-[0.5px] border-richblack-20">
      <div>
        <img
          src={Logo}
          alt="EnigmaLearn"
          className="sm:h-[2rem] md:h-[3.25rem]"
        />
      </div>
      <div className="flex gap-[1.25rem]">
        <div>Home</div>
        <div className="flex items-center">
          Catalog
          <FaAngleDown />
        </div>
        <div>About Us</div>
        <div>Contact Us</div>
      </div>

      <div className="flex gap-[1.25rem] font-inter">
        <button className="px-4 py-2 rounded-lg bg-richblack-800">
          Sign Up
        </button>
        <button className="px-4 py-2 rounded-lg bg-richblack-800">
          Log In
        </button>
      </div>

      {/* <div><div><FaSearch /></div>
      <div><FaCartShopping /></div>
      <div className='w-8 h-8 rounded-full bg-richblack-400'></div></div> */}
    </div>
  );
};

export default NavBar;
