const User = require("../models/User");
const Course = require("../models/Course");
const { instance } = require("../config/Razorpay");
const mailSender = require("../utils/mailSender");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessfulMail");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");

// capture the payment and initialise the Razorpau Order
exports.capturePayment = async (req, res) => {
  try {
    // get the courseID and userId
    const { courseId } = req.body;
    const userId = req.user.id;
    // Validation
    // valid courseID
    if (!courseId) {
      return res.status(401).json({
        success: false,
        message: "Please provide proper course id.",
      });
    }
    // valid courseDetail
    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.status(401).json({
          success: false,
          response: "Course doesn't exist.",
        });
      }

      // user already payed for the same course
      const uid = mongoose.Types.ObjectId.createFromHexString(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(403).json({
          success: false,
          response: "Student is already enrolled.",
        });
      }

      // order create
      const amount = course.price;
      const currency = "INR";
      const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
          courseId: courseId,
          userId: userId,
        },
      };

      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: courseDescription,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        response: "Couldn't Initiate Payment.",
      });
    }

    // check if the user already paid for the same course
    // order create
    // return response
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an error during Payment.",
      error: err.message,
    });
  }
};

exports.verifySignature = async (req, res) => {
  const webhooksecret = "12345678"; // for time being we're using this,it is encrypted string

  const signature = req.headers["x-razorpay-signature"]; // this is how you fetch razorpay signature

  // We're basically creating a secured key for checking signatures.
  // If you don't understand it no worries, consider it to be steps.
  const shasum = crypto.createHmac("sha256", webhooksecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorised.");
    // Now since the payment is done you need to perform some actions like adding course to user and
    // adding user to enrolled course in course

    // Also signature verification request is coming from Razorpay so you will have to use
    // notes in order to to fetch user id and course id that's why we deliberately send it in notes.

    const { courseId, userId } = req.body.payload.payment.entity.notes; // this is the way to fetch notes.
    try {
      // fulfill the actions
      const updatedCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        {
          $push: {
            enrolledStudents: userId,
          },
        },
        { new: true }
      );
      const updatedStudent = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );

      // Now Send Out the emails
      const firstMail = await mailSender(
        updatedStudent.email,
        "Payment Successful",
        paymentSuccessEmail(updatedStudent.firstName, updatedCourse.price)
      );
      const secondMail = await mailSender(
        updatedStudent.email,
        "Successfully Enrolled In Course",
        courseEnrollmentEmail(
          updatedStudent.firstName,
          updatedCourse.courseName
        )
      );
      res.status(200).json({
        success: true,
        response: "Payment Successful, Student Enrolled in Course",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        response: "Bad Request",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      response: "Invalid Request",
    });
  }
};

