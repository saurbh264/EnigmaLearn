const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { fileUpload } = require("../utils/fileUpload");
require("dotenv").config();

exports.createCourse = async (req, res) => {
  try {
    // Fetch Data
    const { courseName, courseDescription, whatwillyoulearn, tag, price } =
      req.body;
    const thumbnail = req.files.thumbnail;
    const userid = req.user.id;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatwillyoulearn ||
      !tag ||
      !thumbnail
    ) {
      return res.status(401).json({
        success: false,
        response: "All Fields are required.",
      });
    }

    // fetch the details of instructor as we need to push his ID here and vice-versa
    const instructorDetails = await User.findById(userid);
    if (!instructorDetails) {
      return res.status(402).json({
        success: false,
        response: "Instuctor details not found.",
      });
    }

    // check the given tag exist or not.
    // Why did we use tag as id, cause in the model we have defined it to be ObjectId
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(402).json({
        success: false,
        response: "Tag details not found.",
      });
    }

    // Upload to Cloudinary
    const thumbnailImage = await fileUpload(
      thumbnail,
      process.env.FOLDER_NAME
    );
    const courseDetails = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Now update the coursedetail in instructor schema in user
    const updatedInstructor = await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: courseDetails._id,
        },
      },
      { new: true }
    );

    // Now update the course details in Tag Schema
    const updatedTag = await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: courseDetails._id,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: "Course Created Successfully.",
      data: courseDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while creating course",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    ).populate("instructor").exec();
    res.status(200).json({
      success: true,
      response: "All Courses Fetched Successfully",
      allCourses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while fetching course",
      error: err.message
    });
  }
};
