const Category = require("../models/Category");

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
    const newCategory = Category.create({
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

exports.showAllCategories = async (req, res) => {
  try {
    const category = await Category.find(
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
      response: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      response: "Encountered an Error while fetching category.",
      error:err.message
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;
    // get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    // validation
    if (!validation) {
      return res.status(404).json({
        success: false,
        response: "No Such Category Exist.",
      });
    }
    // get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    // get top selling courses
    const allCategories = await Category.find().populate("courses").exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // send response
    return res.status(200).json({
      sucess: true,
      message: "Category Fetched Successfully",
      response: {
        selectedCategory,
        differentCategories,
        mostSellingCourses,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      response: "Error Fetching Category Page Details",
      error: err.message,
    });
  }
};
