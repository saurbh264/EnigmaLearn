const category = require("../models/Category");

exports.createCategory = async (req, res) => {
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
    const newCategory = category.create({
      name: name,
      description: description,
    });
    return res.status(200).json({
      sucess: true,
      response: "Category Created Successfully",
    });
  } catch (err) {
    console.log("Can't create Category -", err.message);
    res.status(500).json({
      success: false,
      response: "Encountered an Error while creating Category",
    });
  }
};

exports.showAllcategory = async (req, res) => {
  try {
    const Category = await category.find(
      {},
      {
        name: true,
        description: true,
      }
    );
    //It means on fetching all the category I want name and description for all the category.
    return res.status(200).json({
      sucess: true,
      message: "Category Fetched Successfully",
      response: Category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while fetching category.",
    });
  }
};
