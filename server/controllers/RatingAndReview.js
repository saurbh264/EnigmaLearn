const Course = require("../models/Course");
const User = require("../models/User");
const RatingAndReview = require("../models/RatingAndReview");
const mongoose = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    //get user id and data
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;

    //check if user is enrolled or not
    const course = await Course.findById(courseId);
    if (!course.enrolledStudents.include(userId)) {
      return res.status(401).json({
        success: false,
        response: "User not enrolled in ther course, can't review",
      });
    }
    // check if user has already reviewed the course
    if (
      await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      })
    ) {
      return res.status(401).json({
        success: false,
        response: "User has already reviewed the course.",
      });
    }
    const newRating = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: newRating._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      response: "Created Review Successfully.",
      newRating,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error Creating Review",
      error: err.message,
    });
  }
};

// getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    // calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId.createFromHexString(courseId),
        },

        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // This may look hard but it is not. Just Google it and take reference on how can I take average.
    //return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating, // This is where your average rating  is stored.
      });
    } else {
      return res.status(200).json({
        success: true,
        response: "Average Rating - 0, no one rated the course till now.",
        averageRating: 0,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error Fetching Average Review",
      error: err.message,
    });
  }
};

exports.getAllRating = async(req,res) => {
    try{
        // Another way to fetch reviews 
        const allReviews = await RatingAndReview.find({})
        .sort({rating :"desc"})
        .populate({
            path:"User",
            select:"firstName lastName email images",
        })
        .populate({
            path:"Course",
            select:"courseName",
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"All Reviews Fetched Successfully.",
            data : allReviews
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            response: "Error Fetching All Review",
            error: err.message,
          });
    }
}

exports.getCourseRating = async(req,res) => {
    try{
        // Another way to fetch reviews
        const {courseId} = req.body
        const allReviews = await RatingAndReview.find({course:mongoose.Types.ObjectId(courseId)})
        .sort({rating :"desc"})
        .populate({
            path:"User",
            select:"firstName lastName email images",
        })
        .populate({
            path:"Course",
            select:"courseName",
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"All Course Reviews Fetched Successfully.",
            data : allReviews
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            response: "Error Fetching All Course Reviews",
            error: err.message,
          });
    }
}