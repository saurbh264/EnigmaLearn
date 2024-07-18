const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { fileUpload } = require("../utils/fileUpload");
require("dotenv").config();

exports.createCourse = async (req, res) => {
  try {
    // Fetch Data
    const {
      courseName,
      courseDescription,
      whatwillyoulearn,
      category,
      price,
      tag,
      instructions,
    } = req.body;
    const thumbnail = req.files.thumbnail;
    const userid = req.user.id;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatwillyoulearn ||
      !category ||
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
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(402).json({
        success: false,
        response: "Tag details not found.",
      });
    }

    // Upload to Cloudinary
    const thumbnailImage = await fileUpload(thumbnail, process.env.FOLDER_NAME);
    const courseDetails = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag,
      instructions,
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
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
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
      error: err.message,
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
    )
      .populate("instructor")
      .exec();
    res.status(200).json({
      success: true,
      response: "All Courses Fetched Successfully",
      allCourses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while fetching course",
      error: err.message,
    });
  }
};

// getCourse Details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const CourseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      // .populate("ratingAndReviews")
      .exec();
    if (!CourseDetails) {
      return res.status(400).json({
        success: false,
        response: "No Such Course Exists",
      });
    }
    return res.status(200).json({
      success: true,
      response: "Course Details Fetched Successfully.",
      data: CourseDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error Fetching Course Details.",
      error: err.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
