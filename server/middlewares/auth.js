const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Auth
exports.auth = async (req, res, next) => {
  try {
    let token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        response: " No Tokens Found",
      });
    }

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        response: " Token is Invalid.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error encountered while validating token.",
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType != "Student") {
      return res.status(403).json({
        success: false,
        response: "You're not authorised to access Student Routes.",
      });
      next();
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      response: "Somthing went wrong while authenticating your role",
    });
  }
};

// isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType != "Instructor") {
      return res.status(403).json({
        success: false,
        response: "You're not authorised to access Instructor Routes.",
      });
      next();
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      response: "Somthing went wrong while authenticating your role",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType != "Admin") {
      return res.status(403).json({
        success: false,
        response: "You're not authorised to access Admin Routes.",
      });
      next();
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      response: "Somthing went wrong while authenticating your role",
    });
  }
};
