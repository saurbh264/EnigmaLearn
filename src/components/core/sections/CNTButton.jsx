import React from 'react'
import {Link} from "react-router-dom"
const CNTButton = ({ active, linkto,content }) => {
    return (
      <Link to={linkto}>
          <button
        className={`px-5 py-2 rounded-lg font-lg font-inter font-semibold ${
          active
            ? "bg-yellow-50 text-black"
            : "bg-richblack-800 shadow-sm shadow-richblack-100"
        }`}
      >
        {content}
      </button>
      </Link>
  
    );
  };
  

export default CNTButton
