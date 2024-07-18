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

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}