const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(401).json({
        success: false,
        response: "Please fill the details carefully",
      });
    }
    const sectiondetails = await Section.create({
      sectionName: sectionName,
    });
    let coursedetails = await Course.findById(courseId);
    if (!coursedetails) {
      return res.status(401).json({
        success: false,
        response: "No such course exists",
      });
    }

    coursedetails = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: sectiondetails._id,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: "Section Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "error while creating a section",
      error: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(401).json({
        success: false,
        response: "Please fill the details carefully",
      });
    }
    let sectiondetails = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: "Section Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "error while updating the section",
      error: err.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // fetch id - you may get something like api/:id so we can fetch using params
    const { sectionId, courseId } = req.body;
    if (!Section.findById(sectionId)) {
      return res.status(401).json({
        sucess: false,
        response: "No such section exists",
      });
    }
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    await Section.findByIdAndDelete(sectionId);
    res.status(200).json({
      success: true,
      response: "Section Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "error while deleting the section",
      error: err.message,
    });
  }
};
