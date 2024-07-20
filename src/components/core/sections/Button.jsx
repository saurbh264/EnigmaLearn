import React from "react";
import {Link} from "react-router-dom"

const Button = ({ active, linkto, children,content }) => {
  return (
    <Link to={linkto}>
        <button
      className={`px-5 py-2 rounded-lg ${
        active
          ? "bg-yellow-50 text-black"
          : "bg-richblack-800 shadow-sm shadow-richblack-100"
      }`}
    >
      {children}
    </button>
    </Link>

  );
};

export default Button;
