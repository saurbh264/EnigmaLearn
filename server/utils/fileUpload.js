const cloudinary = require("cloudinary").v2

exports.fileUpload = async (file, folder, quality) => {
    const options = { folder, resource_type: "auto" };
    if(quality){
      options.quality =quality
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
    
  };