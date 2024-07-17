const Profile = require("../models/Profile");
const User = require("../models/User");

// You've already created Profile in user, now you need to update it.
exports.updateProfile = async (req, res) => {
  try {
    const { dateofbirth = "", about = "", gender, contactNumber } = req.body;
    const { userId } = req.user.id;

    if (!userId || !gender || !contactNumber) {
      return res.status(400).json({
        success: false,
        response: "Please fill all the details.",
      });
    }

    const user = await User.findById(userId);
    const profileId = user.additionalDetails;
    const profile = await Profile.findById(profileId);
    profile.dateofbirth = dateofbirth;
    profile.about = about;
    profile.gender = gender;
    profile.contactNumber = contactNumber;
    profile.save();
    // we're using the save method as we have created an object first

    res.status(200).json({
      success: true,
      response: "Profile Updated Sucessfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error encountered while updating profile.",
      error: err.message,
    });
  }
};

// Explore how we can schedule this delete operation
// You can use cron job for this.
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      res.status(400).json({
        success: true,
        response: "No such user exists",
      });
    }
    // seek profile and delete
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // TODO : Unenroll user from all enrolled course

    // delete user
    await User.findByIdAndDelete(id);

    // send response
    res.status(200).json({
      success: true,
      response: "Successfully deleted the User",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      response: "Error encountered while deleting the account.",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate("additionalDetails").exec();

    res.status(200).json({
      success: true,
      response: "Data Fetched Successfully.",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      response: "Error encountered while fetching the account details.",
    });
  }
};
