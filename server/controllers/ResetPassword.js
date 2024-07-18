const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;
    //verify/validate the email
    const cUser = await User.findOne({ email: email });
    if (!cUser) {
      res.status(401).json({
        sucess: false,
        response: "User Doesn't Exists.",
      });
    }
    //generate token using crypto
    const token = crypto.randomUUID();
    //update token and expiration time in user (it would help us to better map token with user)
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpiry: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true, // This returns the updated document.
      }
    );
    // create url
    let url = `http://localhost:5173/change-passwords/${token}`;
    // send url to mail
    await mailSender(
      email,
      "EnigmaLearn Password Reset Link",
      `
            <h2>Hi There! We hope you're doing good</h2><br/>
            The link to reset Password is ${url} <br/>
            Regards <br/>
            Team EnigmaLearn`
    );
    //return response
    res.status(200).json({
      success: true,
      response:
        "Email Sent Successfully, Please Check the Email and Change your Password.",
    });
  } catch (err) {
    return res.status.json({
      success: false,
      response: "Couldn't Send Mail, Encountered an Error.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // fetch data
    const { password, confirmPassword, token } = req.body;
    // If you're wondering we can get token using req.params so why the hell we're getting it using
    // req.body cause we'll send this in body when we submit on frontend
    console.log(token)
    // validate password
    if (!password || !confirmPassword) {
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
    // get Userdetails from db using token
    const cUser = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!cUser) {
      return res.status(403).json({
        success: false,
        response: "Invalid Token",
      });
    }
    // token time check
    // Let day you time is 10am and you generated token at 9 with expiry 9;10 then 9:10 < 10
    if (cUser.resetPasswordExpiry < Date.now) {
      return res.status(403).json({
        success: false,
        response:
          "Your Token is Expired. Regenerate the Token to Reset Password",
      });
    }
    //hash the password
    const newPass = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      { password: newPass },
      { new: true }
    );
    // return response
    res.status(200).json({
      success: true,
      response: "Password Reset Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Somthing went wrong while resetting your password.",
      error:err.message,
    });
  }
};
