const Tags = require("../models/Tags");

exports.createTag = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;

    // Validate
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        response: "All Fields are required.",
      });
    }
    // create entry in db
    const newTag = Tags.create({
      name: name,
      description: description,
    });
    return res.status(200).json({
      sucess: true,
      response: "Tag Created Successfully",
    });
  } catch (err) {
    console.log("Can't create tag -", err.message);
    res.status(500).json({
      success: false,
      response: "Encountered an Error while creating tag",
    });
  }
};

exports.showAllTags = async (req, res) => {
  try {
    const tags = await Tags.find(
      {},
      {
        name: true,
        description: true,
      }
    );
    //It means on fetching all the tags I want name and description for all the tags.
    return res.status(200).json({
      sucess: true,
      message: "Tag Fetched Successfully",
      response: tags,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while fetching tags.",
    });
  }
};
