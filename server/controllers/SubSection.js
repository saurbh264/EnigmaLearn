const SubSection = require("../models/SubSection");
const section = require("../models/Section");
const {fileUpload} = require("../utils/fileUpload");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const videoFile = req.files.video;

    if (!title || !timeDuration || !description || !videoFile) {
      return res.status(401).json({
        success: false,
        response: "Please Fill All The Data",
      });
    }
    const videoUrl = await fileUpload(videoFile, process.env.FOLDER_NAME);
    const subsection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: videoUrl.secure_url,
    });
    const updatedsection = await section.findByIdAndUpdate(sectionId, {
      $push: {
        subSection: subsection._id,
      },
    });
    res.status(200).json({
      success: true,
      response: "Created SubSection Successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Something went wrong while creating subsection",
      error: err.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, subsectionId } = req.body;
    const videoFile = req.files.video;

    if (!title || !timeDuration || !description || !videoFile) {
      return res.status(401).json({
        success: false,
        response: "Please Fill All The Data",
      });
    }
    const videoUrl = await fileUpload(videoFile, process.env.FOLDER_NAME);
    const updatedsubsection = await SubSection.findByIdAndUpdate(
      subsectionId,
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
        videoUrl: videoUrl.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      response: "SubSection Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "error while updating the subsection",
      error: err.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    // fetch id - you may get something like api/:id so we can fetch using params
    const { subsectionId } = req.params;
    if (!SubSection.findById(subsectionId)) {
      return res.status(401).json({
        sucess: false,
        response: "No such sub-section exists",
      });
    }
    await SubSection.findByIdAndDelete(subsectionId);
    res.status(200).json({
      success: true,
      response: "Section Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "error while deleting the sub-section",
      error: err.message,
    });
  }
};
