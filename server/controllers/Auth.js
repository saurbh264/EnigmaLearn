const user = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const profile = require("../models/Profile");
require("dotenv").config();

// Send OTP
exports.sendotp = async (req, res) => {
  try {
    // Fetch Email
    const { email } = req.body;
    // Check If the user already exists
    const userpresent = await user.findOne({ email });

    // If user exist return response
    if (userpresent) {
      res.status(401).json({
        sucess: false,
        response: "User Already Exists.",
      });
    }

    // Now if user not exist, generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = OTP.findOne({ otp: otp });
    // This is not so good approach because we are ensuring the OTP is not repeated,using while loop
    // A better approach is to find a library which ensured not repeating OTP

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = otp.findOne({ otp: otp });
    }

    const otpObject = await OTP.create({
      email,
      otp,
    });
    res.status(200).json({
      success: true,
      response: "OTP Sent Successfully",
      otp,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      response: "Couldn't send OTP",
    });
  }
};

// Sign Up

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        response: "Fill All The Details",
      });
    }

    if (password != confirmPassword) {
      return res.status(403).json({
        success: false,
        response: "Passwords didn't match. Try Again.",
      });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        response: " User Already Exist, try to log in.",
      });
    }

    // find the most recent OTP
    const recentOTP = await otp
      .findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    // Validate the OTP
    if (recentOTP.length == 0) {
      return res.status(403).json({
        success: true,
        message: "No OTP Found",
      });
    } else if (otp != recentOTP.otp) {
      return res.status(403).json({
        success: false,
        message: "The OTP didn't match.",
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Entry in DB.
    // Since we want to link profile to user so we have to create an entry of profile
    const profileDetails = await profile.create({
      gender: null,
      about: null,
      dateofbirth: null,
      contactNumber: contactNumber !== undefined ? contactNumber : null,
    });

    const userdata = await user.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg/seed=${firstName} ${lastName}`,
    });

    res.status(200).json({
      success: true,
      response: "User Created Successfully",
    });
  } catch (err) {
    console.log("User cannot be created : ", err.message);
    res.status(500).json({
      success: false,
      response: "User cannot be registered, please try later.",
    });
  }
};

// Log in

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        response: "Fill All The Details",
      });
    }

    //check if the user is registered
    const existingUser = await user
      .findOne({ email })
      .populate("additionalDetails");
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        response: " No Such User Exists. Try Signing Up",
      });
    }

    // Check if the passwords match
    if (bcrypt.compare(password, existingUser.password)) {
      // Create a JWT Token for the user
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // Create Cookie and Send Response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: true,
        response: "Incorrect Password. Try Again",
      });
    }
  } catch (err) {
    console.log("Can't Login Encountered an error : ", err.message);
    res.status(500).json({
      success: false,
      response: "Can't Login Right Now, please try later.",
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, newConfirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !newConfirmPassword) {
      return res.status(401).json({
        success: false,
        response: "Please Fill all the details.",
      });
    }
    // Current User
    const cUser = await user.findOne({ email });
    if (!cUser) {
      return res.status(400).json({
        success: false,
        response: "No Such User",
      });
    }
    if (oldPassword != cUser.password) {
      return res.status(403).json({
        success: false,
        response: "Incorrect Old Password, try again.",
      });
    }
    if (newPassword != newConfirmPassword) {
      return res.status(403).json({
        success: false,
        response: "Passwords didn't match.",
      });
    }
    const updatedUser = await user.findByIdAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: "Your Password Changed Successfully.",
    });
  } catch (err) {
    console.log("Can't change Password :", err.message);
    res.status(500).json({
      success: false,
      response: "Encountered an Error while changing the password",
    });
  }
};
